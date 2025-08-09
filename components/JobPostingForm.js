// ===== Update JobPostingForm.js =====
import { useState } from 'react'
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
console.log('Stripe key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) // Debug
export default function JobPostingForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = {
      title: e.target.title.value,
      description: e.target.description.value,
      category: e.target.category.value,
      budget: parseFloat(e.target.budget.value),
      duration: e.target.duration.value,
      location: e.target.location.value,
      requirements: e.target.requirements.value,
      equipment: e.target.equipment.value,
      hazardPay: e.target.hazardPay.checked,
      visibilityPackage: e.target.visibilityPackage.value,
      deadline: e.target.deadline.value,
      job_type: e.target.job_type?.value || 'custom'
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: formData.budget,
          duration: formData.duration,
          location: formData.location,
          requirements: formData.requirements.split(',').map(r => r.trim()),
          equipment_needed: formData.equipment.split(',').map(e => e.trim()),
          hazard_pay: formData.hazardPay,
          visibility_package: formData.visibilityPackage || 'basic',
          deadline: formData.deadline,
          job_type: formData.job_type
        })
      })

  console.log('Response status:', response.status)  // ADD THIS
  const data = await response.json()
  console.log('API returned:', data)  // ADD THIS
  console.log('Payment info:', data.payment)  // ADD THIS


      if (!response.ok) throw new Error(data.error)

      // Handle Stripe payment
      if (data.payment?.client_secret) {
          console.log('Payment data:', data.payment)  // Add this
          console.log('Stripe promise:', stripePromise)
        const stripe = await stripePromise
        console.log('Stripe loaded:', stripe)
        const { error } = await stripe.confirmPayment({
          clientSecret: data.payment.client_secret,
          confirmParams: {
            return_url: `${window.location.origin}/jobs/${data.job.id}/success`,
          },
        })

        if (error) {
          alert(error.message)
        }
      } else {
        // Success! Redirect to job page
        router.push(`/jobs/${data.job.id}`)
      }

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Job Title" required />
      <textarea name="description" placeholder="Description" required />
      <input name="category" placeholder="Category" required />
      <input name="budget" type="number" placeholder="Budget" required />
      <input name="duration" placeholder="Duration" required />
      <input name="location" placeholder="Location" required />
      <input name="requirements" placeholder="Requirements (comma separated)" required />
      <input name="equipment" placeholder="Equipment Needed (comma separated)" />
      <label>
        Hazard Pay
        <input name="hazardPay" type="checkbox" />
      </label>
      <select name="visibilityPackage" defaultValue="basic">
        <option value="basic">Basic</option>
        <option value="premium">Premium</option>
      </select>
      <input name="deadline" type="date" required />
      <input name="job_type" placeholder="Job Type" />
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
    </form>
  )
}