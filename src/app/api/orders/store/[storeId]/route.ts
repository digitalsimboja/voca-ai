import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/orders/store/[storeId] - Get orders for specific store
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { storeId } = resolvedParams;

    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Build query string
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit);
    if (offset) queryParams.append('offset', offset);

    const endpoint = `${API_ENDPOINTS.ORDER.ORDERS_BY_STORE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Call backend order service
    const response = await makeAuthenticatedApiCall('ORDER', endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { store_id: storeId }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get store orders error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch store orders' },
      { status: 500 }
    );
  }
}
