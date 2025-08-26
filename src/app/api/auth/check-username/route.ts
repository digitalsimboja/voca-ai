import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, buildApiUrl, getAuthHeaders, handleApiError } from '@/config/api'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    const { username } = body

    console.log('username', username)
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{4,20}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 4-20 characters long and contain only letters, numbers, underscores, and hyphens' },
        { status: 400 }
      )
    }

    // Call the auth service to check username availability
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const authResponse = await fetch(buildApiUrl('AUTH', '/v1/auth/check-username'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username: username.toLowerCase().trim() }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!authResponse.ok) {
      const errorData = await authResponse.json().catch(() => ({}))
      
      return NextResponse.json(
        { error: 'Username check failed', details: errorData.message || errorData.error },
        { status: authResponse.status }
      )
    }

    const authData = await authResponse.json()

    return NextResponse.json({
      success: true,
      message: 'Username availability checked',
      data: {
        username: authData.data?.username,
        available: authData.data?.available
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
