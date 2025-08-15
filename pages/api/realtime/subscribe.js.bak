// ===== /pages/api/realtime/subscribe.js =====
// Subscribe to real-time updates for a job
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { jobId } = req.body

  // Return subscription instructions for client-side
  return res.status(200).json({
    channel: `job:${jobId}`,
    events: ['proposals.INSERT', 'proposals.UPDATE', 'jobs.UPDATE'],
    message: 'Subscribe to this channel using Supabase client'
  })
}