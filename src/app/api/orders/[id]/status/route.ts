import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await makeAuthenticatedApiCall('ORDER', `/${id}/status`, token, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to update order status'),
      { status: 500 }
    );
  }
}
