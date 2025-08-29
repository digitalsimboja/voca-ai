import { NextRequest, NextResponse } from 'next/server';
import { makePublicApiCall, createErrorResponse } from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Use makePublicApiCall to send data to backend service
    const response = await makePublicApiCall(
      'CONTACT',
      '/create',
      {
        method: 'POST',
        body: JSON.stringify(body)
      }
    );

    // Return the backend response
    if (response.status === 'error') {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
