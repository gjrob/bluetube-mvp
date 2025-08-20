// pages/api/cron/process-transfers.js
// This should be called by a cron job every hour
import { supabaseAdmin } from '../../../lib/supabase-admin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // Verify this is called by your cron service (Vercel Cron, etc)
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // For testing locally, you might want to bypass this
    if (process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  try {
    // Get all scheduled transfers that are due
    const { data: dueTransfers, error } = await supabaseAdmin
      .from('scheduled_transfers')
      .select('*')  // Just get scheduled_transfers data, no JOIN needed
      .lte('scheduled_for', new Date().toISOString())
      .eq('status', 'pending')

    if (error) throw error

    console.log(`Processing ${dueTransfers?.length || 0} scheduled transfers`)

    // Process each transfer
    for (const transfer of dueTransfers || []) {
      try {
        // Create Stripe transfer to pilot's connected account
        const stripeTransfer = await stripe.transfers.create({
          amount: Math.floor(transfer.amount * 100), // Convert to cents
          currency: 'usd',
          destination: transfer.stripe_account_id,
          description: `Payment for completed job`,
          metadata: {
            pilot_id: transfer.pilot_id,
            transaction_id: transfer.transaction_id
          }
        })

        // Update scheduled transfer status
        await supabaseAdmin
          .from('scheduled_transfers')
          .update({
            status: 'completed',
            stripe_transfer_id: stripeTransfer.id,
            processed_at: new Date().toISOString()
          })
          .eq('id', transfer.id)

        // Create payout transaction record
        await supabaseAdmin
          .from('transactions')
          .insert({
            pilot_id: transfer.pilot_id,           // Changed from 'user_id' to 'pilot_id'
            transaction_type: 'payout_processed',  // Changed from 'type' to 'transaction_type'
            total_amount: transfer.amount,         // Changed from 'amount' to 'total_amount'
            description: 'Funds transferred to bank account',
            payment_status: 'completed',           // Changed from 'status' to 'payment_status'
            stripe_transfer_id: stripeTransfer.id,
            metadata: {
              scheduled_transfer_id: transfer.id
            }
          })

        console.log(`Transfer ${transfer.id} completed successfully`)

      } catch (transferError) {
        console.error(`Failed to process transfer ${transfer.id}:`, transferError)
        
        // Mark as failed
        await supabaseAdmin
          .from('scheduled_transfers')
          .update({
            status: 'failed',
            error_message: transferError.message,
            failed_at: new Date().toISOString()
          })
          .eq('id', transfer.id)
      }
    }

    return res.status(200).json({
      success: true,
      processed: dueTransfers?.length || 0
    })

  } catch (error) {
    console.error('Process transfers error:', error)
    return res.status(500).json({ error: 'Failed to process transfers' })
  }
}