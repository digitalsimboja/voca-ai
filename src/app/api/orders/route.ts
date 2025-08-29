import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (searchParams.get('limit')) queryParams.set('limit', searchParams.get('limit')!);
    if (searchParams.get('offset')) queryParams.set('offset', searchParams.get('offset')!);
    if (searchParams.get('status')) queryParams.set('status', searchParams.get('status')!);
    if (searchParams.get('sort_by')) queryParams.set('sort_by', searchParams.get('sort_by')!);
    if (searchParams.get('sort_order')) queryParams.set('sort_order', searchParams.get('sort_order')!);

    const endpoint = `${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await makeAuthenticatedApiCall('ORDER', endpoint, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch orders'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await makeAuthenticatedApiCall('ORDER', '', token, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to create order'),
      { status: 500 }
    );
  }
}
