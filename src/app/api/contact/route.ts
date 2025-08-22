import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.CONTACT_SERVICE_URL || 'http://localhost:8006'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward the request to the backend contact service
    const response = await fetch(`${BACKEND_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()

    // Return the backend response with the same status code
    return NextResponse.json(result, { status: response.status })

  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error' 
      }, 
      { status: 500 }
    )
  }
}
