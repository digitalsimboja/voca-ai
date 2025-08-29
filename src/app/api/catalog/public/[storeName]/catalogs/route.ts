import { NextRequest, NextResponse } from 'next/server';
import { makePublicApiCall, createErrorResponse } from '@/lib/api';

// GET /api/catalog/public/[storeName]/catalogs - Get public catalogs for a store
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeName: string }> }
) {
  try {
    const resolvedParams = await params;
    const response = await makePublicApiCall('CATALOG', `/public/${resolvedParams.storeName}/catalogs`, {
      method: 'GET',
    });

    if (response.status === 'error') {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get public catalogs error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch catalogs'),
      { status: 500 }
    );
  }
}
