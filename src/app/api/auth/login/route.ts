import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, buildApiUrl, API_ENDPOINTS, getAuthHeaders, handleApiError } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Email and password are required'
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

    // Prepare the request payload for the auth service
    const authServicePayload = {
      email: email.toLowerCase().trim(),
      password: password
    }

    // Call the auth service
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const authResponse = await fetch(buildApiUrl('AUTH', API_ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(authServicePayload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}))
      
      // Handle specific error cases
      if (authResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
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
      message: 'Login successful',
      data: {
        userId: authData.data?.user_id,
        email: authData.data?.email,
        username: authData.data?.username,
        firstName: authData.data?.first_name,
        lastName: authData.data?.last_name,
        businessType: authData.data?.business_type,
        role: authData.data?.role,
        isVerified: authData.data?.is_verified
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
