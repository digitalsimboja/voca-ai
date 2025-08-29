import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json(
        createErrorResponse('Store ID is required'),
        { status: 400 }
      );
    }

    const response = await makeAuthenticatedApiCall('CATALOG', `/stores/${storeId}`, token, {
      method: 'PUT',
      body: JSON.stringify(body)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update store error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to update store'),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json(
        createErrorResponse('Store ID is required'),
        { status: 400 }
      );
    }

    const response = await makeAuthenticatedApiCall('CATALOG', `/stores/${storeId}`, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get store error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to get store'),
      { status: 500 }
    );
  }
}
