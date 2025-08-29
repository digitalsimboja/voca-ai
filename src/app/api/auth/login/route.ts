import { NextRequest, NextResponse } from 'next/server';
import { 
  makePublicApiCall,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        createErrorResponse('Email and password are required'),
        { status: 400 }
      );
    }

    // Use makePublicApiCall since login doesn't require authentication
    const authResponse = await makePublicApiCall('AUTH', '/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (authResponse.status === 'success' && authResponse.data) {
      const dataObj = authResponse.data as Record<string, unknown>;
      const token = typeof dataObj.token === 'string' ? dataObj.token : undefined;
      const backendUser = (dataObj.user as Record<string, unknown>) || dataObj;

      const response = NextResponse.json(
        createSuccessResponse({
          userId: (backendUser.user_id as string) ?? (backendUser.userId as string) ?? (backendUser.id as string) ?? '',
          email: (backendUser.email as string) ?? '',
          username: (backendUser.username as string) ?? '',
          firstName: (backendUser.first_name as string) ?? (backendUser.firstName as string) ?? '',
          lastName: (backendUser.last_name as string) ?? (backendUser.lastName as string) ?? '',
          businessType: (backendUser.business_type as 'banking'|'retail') ?? (backendUser.businessType as 'banking'|'retail') ?? 'retail',
          role: (backendUser.role as string) ?? 'user',
          isVerified: (backendUser.is_verified as boolean) ?? (backendUser.isVerified as boolean) ?? false,
        }, authResponse.message || 'Login successful')
      );

      if (token) {
        response.cookies.set('voca_auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 86400,
          path: '/',
        });
      }

      return response;
    } else {
      return NextResponse.json(
        createErrorResponse(authResponse.message || 'Login failed'),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
