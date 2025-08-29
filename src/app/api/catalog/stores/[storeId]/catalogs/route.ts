import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { storeId } = resolvedParams;

    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('CATALOG', `/stores/${storeId}/catalogs`, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get store catalogs error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch store catalogs'),
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { storeId } = resolvedParams;

    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await makeAuthenticatedApiCall('CATALOG', `/stores/${storeId}/catalogs`, token, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Create store catalog error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to create store catalog'),
      { status: 500 }
    );
  }
}
