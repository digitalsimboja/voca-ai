import { useState, useEffect } from 'react'

export type BusinessType = 'microfinance' | 'retail' | 'ecommerce' | 'banking' | 'social_media'

interface UseBusinessTypeReturn {
  businessType: BusinessType | null
  isLoading: boolean
  error: string | null
  updateBusinessType: (newType: BusinessType) => void
}

export const useBusinessType = (): UseBusinessTypeReturn => {
  const [businessType, setBusinessType] = useState<BusinessType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const detectBusinessType = async () => {
      try {
        setIsLoading(true)
        
        // First, try to get from localStorage (if user has set it)
        const storedBusinessType = localStorage.getItem('voca_business_type')
        if (storedBusinessType) {
          setBusinessType(storedBusinessType as BusinessType)
          setIsLoading(false)
          return
        }

        // Try to get from user profile API
        try {
          const response = await fetch('/api/user/profile', {
            credentials: 'include'
          })
          
          if (response.ok) {
            const userData = await response.json()
            if (userData.businessType) {
              setBusinessType(userData.businessType as BusinessType)
              localStorage.setItem('voca_business_type', userData.businessType)
              setIsLoading(false)
              return
            }
          }
        } catch (profileError) {
          console.log('Could not fetch user profile:', profileError)
        }

        // Try to get from organization settings
        try {
          const response = await fetch('/api/organization/settings', {
            credentials: 'include'
          })
          
          if (response.ok) {
            const orgData = await response.json()
            if (orgData.industry) {
              // Map industry to business type
              const industryMap: Record<string, BusinessType> = {
                'microfinance': 'microfinance',
                'banking': 'banking',
                'retail': 'retail',
                'ecommerce': 'ecommerce',
                'social_media': 'social_media'
              }
              
              const mappedType = industryMap[orgData.industry]
              if (mappedType) {
                setBusinessType(mappedType)
                localStorage.setItem('voca_business_type', mappedType)
                setIsLoading(false)
                return
              }
            }
          }
        } catch (orgError) {
          console.log('Could not fetch organization settings:', orgError)
        }

        // Default to retail if nothing is found
        setBusinessType('retail')
        localStorage.setItem('voca_business_type', 'retail')
        
      } catch (err) {
        setError('Failed to detect business type')
        console.error('Business type detection error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    detectBusinessType()
  }, [])

  const updateBusinessType = (newType: BusinessType) => {
    setBusinessType(newType)
    localStorage.setItem('voca_business_type', newType)
  }

  return {
    businessType,
    isLoading,
    error,
    updateBusinessType
  }
}
