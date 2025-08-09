// Create a test page at pages/test-cron.js
import { useState } from 'react'

export default function TestCron() {
  const [result, setResult] = useState(null)

  const testCron = async () => {
    const res = await fetch('/api/cron/process-transfers', {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
      }
    })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={testCron}>Test Cron Job</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}