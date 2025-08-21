import { NextRequest, NextResponse } from 'next/server';

const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:8008';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const resolvedParams = await params;
    const response = await fetch(`${CUSTOMER_SERVICE_URL}/customers/${resolvedParams.customerId}/orders${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Customer orders API error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch customer orders',
        data: null 
      }, 
      { status: 500 }
    );
  }
}
