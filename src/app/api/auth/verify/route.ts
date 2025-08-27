import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, buildApiUrl, API_ENDPOINTS, getAuthHeaders, handleApiError } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Call the auth service to verify token
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const authResponse = await fetch(buildApiUrl('AUTH', API_ENDPOINTS.AUTH.VERIFY), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ token }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const authData = await authResponse.json()
    const backendUser = authData.data?.user || authData.data || {}

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          userId: backendUser.user_id ?? backendUser.userId ?? backendUser.id ?? '',
          email: backendUser.email ?? '',
          username: backendUser.username ?? '',
          firstName: backendUser.first_name ?? backendUser.firstName ?? '',
          lastName: backendUser.last_name ?? backendUser.lastName ?? '',
          businessType: backendUser.business_type ?? backendUser.businessType ?? 'retail',
          role: backendUser.role ?? 'user',
          isVerified: backendUser.is_verified ?? backendUser.isVerified ?? false,
        }
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
