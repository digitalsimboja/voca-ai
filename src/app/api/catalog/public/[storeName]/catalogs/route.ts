import { NextRequest, NextResponse } from 'next/server';
import { makePublicApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/catalog/public/[storeName]/catalogs - Get public catalogs for a store
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeName: string }> }
) {
  try {
    const resolvedParams = await params;
    const response = await makePublicApiCall('CATALOG', `/public/${resolvedParams.storeName}/catalogs`, {
      method: 'GET',
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get public catalogs error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch catalogs' },
      { status: 500 }
    );
  }
}
