import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// PUT /api/catalog/catalogs/[catalogId] - Update a catalog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ catalogId: string }> }
) {
  try {
    const body = await request.json();
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const response = await makeAuthenticatedApiCall('CATALOG', `/catalogs/${resolvedParams.catalogId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update catalog error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to update catalog' },
      { status: 500 }
    );
  }
}
