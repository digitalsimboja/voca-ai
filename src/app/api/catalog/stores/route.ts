import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/catalog/stores - Get user's stores
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies (set by login)
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call backend catalog service
    const response = await makeAuthenticatedApiCall('CATALOG', API_ENDPOINTS.CATALOG.MY_STORE, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get stores error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}

// POST /api/catalog/stores - Create a new store
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { store_name, description, website_url, logo_url } = body;

    // Validate input
    if (!store_name) {
      return NextResponse.json(
        { status: 'error', message: 'Store name is required' },
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

    // Call backend catalog service
    const response = await makeAuthenticatedApiCall('CATALOG', API_ENDPOINTS.CATALOG.STORES, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        store_name,
        description: description || '',
        website_url: website_url || '',
        logo_url: logo_url || ''
      })
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Create store error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create store' },
      { status: 500 }
    );
  }
}
