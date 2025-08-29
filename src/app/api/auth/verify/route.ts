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
        createErrorResponse('No token provided', 'NO_TOKEN'),
        { status: 401 }
      );
    }

    // Call the auth service to verify token using the new api-utils
    const response = await makeAuthenticatedApiCall(
      'AUTH',
      '/verify',
      token,
      {
        method: 'POST',
        body: JSON.stringify({ token })
      }
    );

    if (response.status === 'error') {
      return NextResponse.json(
        createErrorResponse('Invalid or expired token', 'INVALID_TOKEN'),
        { status: 401 }
      );
    }

    const backendUser = (response.data as Record<string, unknown>)?.user || response.data || {};

    return NextResponse.json(
      createSuccessResponse({
        user: {
          userId: (backendUser as Record<string, unknown>).user_id ?? (backendUser as Record<string, unknown>).userId ?? (backendUser as Record<string, unknown>).id ?? '',
          email: (backendUser as Record<string, unknown>).email ?? '',
          username: (backendUser as Record<string, unknown>).username ?? '',
          firstName: (backendUser as Record<string, unknown>).first_name ?? (backendUser as Record<string, unknown>).firstName ?? '',
          lastName: (backendUser as Record<string, unknown>).last_name ?? (backendUser as Record<string, unknown>).lastName ?? '',
          businessType: (backendUser as Record<string, unknown>).business_type ?? (backendUser as Record<string, unknown>).businessType ?? 'retail',
          role: (backendUser as Record<string, unknown>).role ?? 'user',
          isVerified: (backendUser as Record<string, unknown>).is_verified ?? (backendUser as Record<string, unknown>).isVerified ?? false,
        }
      }, 'Token is valid')
    );

  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
