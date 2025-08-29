import { NextRequest, NextResponse } from 'next/server';
import { makePublicApiCall, createErrorResponse } from '@/lib/api';

// GET /api/catalog/public/catalogs/[catalogId] - Get a public catalog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ catalogId: string }> }
) {
  try {
    const resolvedParams = await params;
    const response = await makePublicApiCall('CATALOG', `/public/catalogs/${resolvedParams.catalogId}`, {
      method: 'GET',
    });

    if (response.status === 'error') {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get public catalog error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch catalog'),
      { status: 500 }
    );
  }
}
