import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authResponse = await makeAuthenticatedApiCall('AUTH', API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }) as ApiResponse<unknown>;

    if (authResponse.status === 'success' && authResponse.data && typeof authResponse.data === 'object') {
      const dataObj = authResponse.data as Record<string, unknown>;
      const token = typeof dataObj.token === 'string' ? dataObj.token : undefined;
      const backendUser = (dataObj.user as Record<string, unknown>) || dataObj;

      const response = NextResponse.json({
        status: 'success',
        message: authResponse.message || 'Login successful',
        data: {
          userId: (backendUser.user_id as string) ?? (backendUser.userId as string) ?? (backendUser.id as string) ?? '',
          email: (backendUser.email as string) ?? '',
          username: (backendUser.username as string) ?? '',
          firstName: (backendUser.first_name as string) ?? (backendUser.firstName as string) ?? '',
          lastName: (backendUser.last_name as string) ?? (backendUser.lastName as string) ?? '',
          businessType: (backendUser.business_type as 'banking'|'retail') ?? (backendUser.businessType as 'banking'|'retail') ?? 'retail',
          role: (backendUser.role as string) ?? 'user',
          isVerified: (backendUser.is_verified as boolean) ?? (backendUser.isVerified as boolean) ?? false,
        }
      }, { status: 200 });

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
        { status: 'error', message: authResponse.message || 'Login failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
