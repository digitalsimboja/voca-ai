import { NextRequest, NextResponse } from 'next/server';

const INTEGRATION_SERVICE_URL = process.env.INTEGRATION_SERVICE_URL || 'http://localhost:8009';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ integrationId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { integrationId } = resolvedParams;
    
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${INTEGRATION_SERVICE_URL}/integrations/${integrationId}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Test integration API error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to test integration',
        data: null 
      }, 
      { status: 500 }
    );
  }
}
