import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/catalog/stores/[storeId]/agents - Get agents for a store
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const response = await makeAuthenticatedApiCall('CATALOG', API_ENDPOINTS.CATALOG.STORE_AGENTS, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { store_id: resolvedParams.storeId }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/catalog/stores/[storeId]/agents - Create a new agent
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
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
    const response = await makeAuthenticatedApiCall('CATALOG', API_ENDPOINTS.CATALOG.STORE_AGENTS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }, { store_id: resolvedParams.storeId }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
