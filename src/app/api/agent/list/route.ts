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

    const response = await makeAuthenticatedApiCall('AGENT', '/agents', token, {
      method: 'GET'
    });

    // Extract agents from the nested structure if they exist
    if (response.status === 'success' && response.data && typeof response.data === 'object' && 'agents' in response.data) {
      return NextResponse.json({
        ...response,
        data: response.data.agents
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch agents'),
      { status: 500 }
    );
  }
}
