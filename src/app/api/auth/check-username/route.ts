import { NextRequest, NextResponse } from 'next/server';
import { 
  makePublicApiCall,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const { username } = body;
    
    if (!username) {
      return NextResponse.json(
        createErrorResponse('Username is required'),
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{4,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        createErrorResponse('Username must be 4-20 characters long and contain only letters, numbers, underscores, and hyphens'),
        { status: 400 }
      );
    }

    // Call the auth service to check username availability using the new api-utils
    const authResponse = await makePublicApiCall('AUTH', '/check-username', {
      method: 'POST',
      body: JSON.stringify({ username: username.toLowerCase().trim() })
    });

    if (authResponse.status === 'error') {
      return NextResponse.json(
        createErrorResponse(authResponse.message || 'Username check failed'),
        { status: 400 }
      );
    }

    const authData = authResponse.data as Record<string, unknown>;

    return NextResponse.json(
      createSuccessResponse({
        username: authData.username as string,
        available: authData.available as boolean
      }, 'Username availability checked')
    );

  } catch (error) {
    console.error('Check username error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
