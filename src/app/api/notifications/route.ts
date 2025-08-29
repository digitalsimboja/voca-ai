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
    const queryString = searchParams.toString();
    const endpoint = queryString ? `?${queryString}` : '';

    const response = await makeAuthenticatedApiCall('NOTIFICATION', endpoint, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch notifications'),
      { status: 500 }
    );
  }
}
