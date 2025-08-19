import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// PUT /api/orders/[id]/status - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status, tracking_number, notes, cancelled_reason } = body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled' },
        { status: 400 }
      );
    }

    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call backend order service
    const response = await makeAuthenticatedApiCall('ORDER', API_ENDPOINTS.ORDER.ORDER_STATUS, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status,
        tracking_number: tracking_number || null,
        notes: notes || null,
        cancelled_reason: cancelled_reason || null
      })
    }, { id }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
