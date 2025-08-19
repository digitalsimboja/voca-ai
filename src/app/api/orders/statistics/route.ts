import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/orders/statistics - Get order statistics
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const url = `${API_CONFIG.ORDER.baseUrl}${API_CONFIG.ORDER.prefix}${API_ENDPOINTS.ORDER.ORDER_STATISTICS}`;

    // Call backend order service directly
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ApiResponse;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get order statistics error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch order statistics' },
      { status: 500 }
    );
  }
}
