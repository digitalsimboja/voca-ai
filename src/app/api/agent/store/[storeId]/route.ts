import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // Get the authorization token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend agent service
    const response = await fetch(
      buildApiUrl('AGENT', `/v1/agent/stores/${storeId}/agents`),
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Failed to fetch store agents' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching store agents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
