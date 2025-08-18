import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// POST /api/catalog/stores/check-name - Check if store name is available
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { status: 'error', message: 'Store name is required' },
        { status: 400 }
      );
    }

    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('CATALOG', API_ENDPOINTS.CATALOG.STORE_NAME_AVAILABLE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store_name: name })
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Check store name error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to check store name availability' },
      { status: 500 }
    );
  }
}

// GET /api/catalog/stores/check-name - Check if store name is available (for backward compatibility)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { status: 'error', message: 'Store name is required' },
        { status: 400 }
      );
    }

    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('CATALOG', API_ENDPOINTS.CATALOG.STORE_NAME_AVAILABLE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store_name: name })
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Check store name error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to check store name availability' },
      { status: 500 }
    );
  }
}
