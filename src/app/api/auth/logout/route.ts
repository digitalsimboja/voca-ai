import { NextRequest, NextResponse } from 'next/server';
import { 
  makeAuthenticatedApiCall,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('No active session found'),
        { status: 401 }
      );
    }

    // Call the auth service to logout using the new api-utils
    const response = await makeAuthenticatedApiCall('AUTH', '/logout', token, {
      method: 'POST',
      body: JSON.stringify({ token })
    });

    // Create response
    const nextResponse = NextResponse.json(
      createSuccessResponse(null, 'Logout successful')
    );

    // Clear the auth cookie
    nextResponse.cookies.set('voca_auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    // Clear any additional cookies if needed
    nextResponse.cookies.set('voca_user_data', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return nextResponse;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
