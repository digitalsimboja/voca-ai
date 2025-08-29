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

    const response = await makeAuthenticatedApiCall('NOTIFICATION', '/count', token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch notification count'),
      { status: 500 }
    );
  }
}
