import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, buildApiUrl, API_ENDPOINTS, getAuthHeaders, handleApiError } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    const { firstName, lastName, username, email, password, companyName, businessType } = body
    
    if (!firstName || !lastName || !username || !email || !password || !companyName || !businessType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'firstName, lastName, username, email, password, companyName, and businessType are required'
        },
        { status: 400 }
      )
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens' },
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

    // Validate business type
    const validBusinessTypes = ['banking', 'retail']
    if (!validBusinessTypes.includes(businessType)) {
      return NextResponse.json(
        { error: `Business type must be one of: ${validBusinessTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare the request payload for the auth service
    const authServicePayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: password,
      company_name: companyName.trim(),
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
      
      if (authResponse.status === 400) {
        return NextResponse.json(
          { 
            error: errorData.message || 'Invalid data provided', 
            details: errorData.errors || errorData.details 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Authentication service error', details: errorData.message || errorData.error },
        { status: authResponse.status }
      )
    }

    const authData = await authResponse.json()

    // Store authentication token in secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId: authData.data?.user_id,
        email: authData.data?.email,
        username: authData.data?.username,
        firstName: authData.data?.first_name,
        lastName: authData.data?.last_name,
        businessType: authData.data?.business_type,
        role: authData.data?.role,
        isVerified: authData.data?.is_verified,
        requiresVerification: authData.data?.requires_verification || false
      }
    })

    // Set secure HTTP-only cookie with JWT token
    if (authData.data?.token) {
      response.cookies.set('voca_auth_token', authData.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      })
    }

    return response

  } catch (error) {
    const errorResult = handleApiError(error, 'Internal server error')
    return NextResponse.json(
      errorResult,
      { status: 500 }
    )
  }
}
