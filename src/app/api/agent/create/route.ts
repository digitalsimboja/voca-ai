import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const agentData = await request.json();
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('AGENT', '/create', token, {
      method: 'POST',
      body: JSON.stringify(agentData)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      createErrorResponse('Failed to create agent'),
      { status: 500 }
    );
  }
}
