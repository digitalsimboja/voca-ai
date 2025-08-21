import { NextRequest, NextResponse } from 'next/server';

const INTEGRATION_SERVICE_URL = process.env.INTEGRATION_SERVICE_URL || 'http://localhost:8009';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${INTEGRATION_SERVICE_URL}/integrations/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Integration statistics API error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch integration statistics',
        data: null 
      }, 
      { status: 500 }
    );
  }
}
