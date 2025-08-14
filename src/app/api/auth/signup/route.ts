import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, buildApiUrl, API_ENDPOINTS, getAuthHeaders, handleApiError } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    const { firstName, lastName, email, password, companyName, businessType } = body
    
    if (!firstName || !lastName || !email || !password || !companyName || !businessType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'firstName, lastName, email, password, companyName, and businessType are required'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Prepare the request payload for the auth service
    const authServicePayload = {
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase().trim(),
      password: password,
      company_name: companyName,
      business_type: businessType,
      marketing_consent: body.agreeToMarketing || false
    }

    // Call the auth service
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const authResponse = await fetch(buildApiUrl('AUTH', API_ENDPOINTS.AUTH.SIGNUP), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(authServicePayload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}))
      
      // Handle specific error cases
      if (authResponse.status === 409) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      
      if (authResponse.status === 422) {
        return NextResponse.json(
          { error: 'Invalid data provided', details: errorData.details },
          { status: 422 }
        )
      }

      return NextResponse.json(
        { error: 'Authentication service error', details: errorData.error },
        { status: authResponse.status }
      )
    }

    const authData = await authResponse.json()

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId: authData.data?.user_id,
        email: authData.data?.email,
        businessType: authData.data?.business_type,
        requiresVerification: authData.data?.requires_verification || false
      }
    })

  } catch (error) {
    const errorResult = handleApiError(error, 'Internal server error')
    return NextResponse.json(
      errorResult,
      { status: 500 }
    )
  }
}
