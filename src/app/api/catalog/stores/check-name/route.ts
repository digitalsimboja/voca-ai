import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const storeName = searchParams.get('store_name');

    if (!storeName) {
      return NextResponse.json(
        createErrorResponse('Store name is required'),
        { status: 400 }
      );
    }

    const response = await makeAuthenticatedApiCall('CATALOG', `/stores/check-name?store_name=${encodeURIComponent(storeName)}`, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Check store name error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to check store name'),
      { status: 500 }
    );
  }
}


