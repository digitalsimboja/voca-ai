import { NextRequest, NextResponse } from 'next/server';
import { makePublicApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/catalog/public/catalogs/[catalogId] - Get a public catalog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catalogId: string }> }
) {
  try {
    const resolvedParams = await params;
    const response = await makePublicApiCall('CATALOG', `/public/catalogs/${resolvedParams.catalogId}`, {
      method: 'GET',
    }) as ApiResponse;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get public catalog error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
