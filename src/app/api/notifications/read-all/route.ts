import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('NOTIFICATION', '/read-all', token, {
      method: 'PUT'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      createErrorResponse('Failed to mark all notifications as read'),
      { status: 500 }
    );
  }
}
