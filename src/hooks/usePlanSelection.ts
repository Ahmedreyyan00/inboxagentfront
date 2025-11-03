'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Api from '@/lib/Api'
import toast from 'react-hot-toast'

export const usePlanSelection = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    const handlePlanSelection = async () => {
      // Only proceed if user is authenticated and session is loaded
      if (status !== 'authenticated' || !session?.accessToken) {
        return
      }
      
      // Check for plan selection from URL params or localStorage
      const planId = searchParams.get('plan') || localStorage.getItem('selectedPlanId')
      const planName = searchParams.get('planName') || localStorage.getItem('selectedPlanName')
      
      if (planId) {
        try {
          // Create Stripe checkout session for the selected plan
          const response = await Api.createSubscription(planId)
          
          if (response.data.url) {
            // Clear stored plan data
            localStorage.removeItem('selectedPlanId')
            localStorage.removeItem('selectedPlanName')
            
            // Remove plan params from URL
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('plan')
            newUrl.searchParams.delete('planName')
            window.history.replaceState({}, '', newUrl.toString())
            
            toast.success(`Redirecting to checkout for ${planName || 'selected plan'}...`)
            window.location.href = response.data.url
            return
          }
        } catch (error) {
          console.error('Failed to create checkout session:', error)
          toast.error('Failed to start checkout process. Redirecting to dashboard.')
          
          // Clear stored plan data on error
          localStorage.removeItem('selectedPlanId')
          localStorage.removeItem('selectedPlanName')
          
          // Remove plan params from URL
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('plan')
          newUrl.searchParams.delete('planName')
          window.history.replaceState({}, '', newUrl.toString())
          
          router.push('/dashboard')
        }
      }
    }
    
    handlePlanSelection()
  }, [session, status, searchParams, router])
  
  return {
    hasPlanSelection: !!(searchParams.get('plan') || localStorage.getItem('selectedPlanId'))
  }
}
