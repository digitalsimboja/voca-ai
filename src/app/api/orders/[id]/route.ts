import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/orders/[id] - Get specific order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call backend order service
    const response = await makeAuthenticatedApiCall('ORDER', API_ENDPOINTS.ORDER.ORDER_BY_ID, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { id }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call backend order service
    const response = await makeAuthenticatedApiCall('ORDER', API_ENDPOINTS.ORDER.ORDER_BY_ID, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }, { id }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call backend order service
    const response = await makeAuthenticatedApiCall('ORDER', API_ENDPOINTS.ORDER.ORDER_BY_ID, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { id }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
