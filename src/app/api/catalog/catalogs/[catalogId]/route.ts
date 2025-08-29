import { NextRequest, NextResponse } from 'next/server';
import { 
  makeAuthenticatedApiCall, 
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api';

// GET /api/catalog/catalogs/[catalogId] - Get a catalog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catalogId: string }> }
) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 'NO_TOKEN'),
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const response = await makeAuthenticatedApiCall(
      'CATALOG', 
      `/catalogs/${resolvedParams.catalogId}`, 
      token,
      {
        method: 'GET'
      }
    );

    if (response.status === 'error') {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get catalog error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to get catalog'),
      { status: 500 }
    );
  }
}

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
        createErrorResponse('Authentication required', 'NO_TOKEN'),
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const response = await makeAuthenticatedApiCall(
      'CATALOG', 
      `/catalogs/${resolvedParams.catalogId}`, 
      token,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    );

    if (response.status === 'error') {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update catalog error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to update catalog'),
      { status: 500 }
    );
  }
}
