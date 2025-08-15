// ===== /pages/api/proposals/accept.js =====
// Client accepts a pilot's proposal
import { withAuth } from '../../../lib/auth-middleware'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { proposalId } = req.body
  const supabase = createServerSupabaseClient({ req, res })
  const userId = req.user.id

  try {
    // Get proposal with job details
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        jobs (
          id,
          client_id,
          title,
          budget
        )
      `)
      .eq('id', proposalId)
      .single()

    if (proposalError) throw proposalError

    // Verify the user is the job owner
    if (proposal.jobs.client_id !== userId) {
      return res.status(403).json({ error: 'Forbidden - Not job owner' })
    }

    // Update proposal status
    const { error: updateProposalError } = await supabase
      .from('proposals')
      .update({ status: 'accepted' })
      .eq('id', proposalId)

    if (updateProposalError) throw updateProposalError

    // Reject all other proposals for this job
    const { error: rejectError } = await supabase
      .from('proposals')
      .update({ status: 'rejected' })
      .eq('job_id', proposal.job_id)
      .neq('id', proposalId)

    if (rejectError) throw rejectError

    // Update job status
    const { error: updateJobError } = await supabase
      .from('jobs')
      .update({ 
        status: 'in_progress',
        assigned_pilot_id: proposal.pilot_id
      })
      .eq('id', proposal.job_id)

    if (updateJobError) throw updateJobError

    // Create initial transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'job_escrow',
        amount: -proposal.bid_amount, // Negative for client
        description: `Escrow for job: ${proposal.jobs.title}`,
        job_id: proposal.job_id,
        status: 'pending'
      })

    if (transactionError) throw transactionError

    return res.status(200).json({ 
      message: 'Proposal accepted successfully!',
      proposal 
    })

  } catch (error) {
    console.error('Accept proposal error:', error)
    return res.status(400).json({ error: error.message })
  }
})