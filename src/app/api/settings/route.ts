import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG, buildApiUrl, API_ENDPOINTS, getAuthHeaders, handleApiError } from '@/config/api'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Call the settings service
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const settingsResponse = await fetch(buildApiUrl('SETTINGS', API_ENDPOINTS.SETTINGS.GET), {
      method: 'GET',
      headers: getAuthHeaders(token),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!settingsResponse.ok) {
      const errorData = await settingsResponse.json().catch(() => ({}))
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch settings', 
          details: errorData.message || errorData.error 
        },
        { status: settingsResponse.status }
      )
    }

    const settingsData = await settingsResponse.json()

    return NextResponse.json({
      status: 'success',
      message: 'Settings retrieved successfully',
      data: settingsData.data
    })

  } catch (error) {
    const errorResult = handleApiError(error, 'Internal server error')
    return NextResponse.json(
      errorResult,
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    if (!body) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      )
    }

    // Call the settings service
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const settingsResponse = await fetch(buildApiUrl('SETTINGS', API_ENDPOINTS.SETTINGS.UPDATE), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(body),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!settingsResponse.ok) {
      const errorData = await settingsResponse.json().catch(() => ({}))
      
      if (settingsResponse.status === 400) {
        return NextResponse.json(
          { 
            error: 'Invalid settings data', 
            details: errorData.errors || errorData.details 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Failed to update settings', 
          details: errorData.message || errorData.error 
        },
        { status: settingsResponse.status }
      )
    }

    const settingsData = await settingsResponse.json()

    return NextResponse.json({
      status: 'success',
      message: 'Settings updated successfully',
      data: settingsData.data
    })

  } catch (error) {
    const errorResult = handleApiError(error, 'Internal server error')
    return NextResponse.json(
      errorResult,
      { status: 500 }
    )
  }
}
