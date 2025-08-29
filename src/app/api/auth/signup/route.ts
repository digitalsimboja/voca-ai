import { NextRequest, NextResponse } from 'next/server';
import { 
  makePublicApiCall,
  createErrorResponse,
  createSuccessResponse
} from '@/lib/api';
import { validatePasswordStrength } from '@/utils/passwordStrength';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    const { firstName, lastName, username, email, password, companyName, businessType } = body;
    
    if (!firstName || !lastName || !username || !email || !password || !companyName || !businessType) {
      return NextResponse.json(
        createErrorResponse('Missing required fields: firstName, lastName, username, email, password, companyName, and businessType are required'),
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        createErrorResponse('Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens'),
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        createErrorResponse('Invalid email format'),
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordStrength = validatePasswordStrength(password);
    if (!passwordStrength.isValid) {
      return NextResponse.json(
        createErrorResponse(`Password does not meet strength requirements: ${passwordStrength.missingRequirements.join(', ')}`),
        { status: 400 }
      );
    }

    // Validate business type
    const validBusinessTypes = ['banking', 'retail'];
    if (!validBusinessTypes.includes(businessType)) {
      return NextResponse.json(
        createErrorResponse(`Business type must be one of: ${validBusinessTypes.join(', ')}`),
        { status: 400 }
      );
    }

    // Prepare the request payload for the auth service
    const authServicePayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: password,
      company_name: companyName.trim(),
      business_type: businessType,
      marketing_consent: body.agreeToMarketing || false
    };

    // Call the auth service using the new api-utils
    const authResponse = await makePublicApiCall('AUTH', '/signup', {
      method: 'POST',
      body: JSON.stringify(authServicePayload)
    });

    if (authResponse.status === 'error') {
      // Handle specific error cases
      if (authResponse.error_code === 'USER_EXISTS') {
        return NextResponse.json(
          createErrorResponse('User with this email already exists', 'USER_EXISTS'),
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        createErrorResponse(authResponse.message || 'Authentication service error'),
        { status: 400 }
      );
    }

    const authData = authResponse.data as Record<string, unknown>;

    // Store authentication token in secure cookie
    const response = NextResponse.json(
      createSuccessResponse({
        userId: authData.user_id as string,
        email: authData.email as string,
        username: authData.username as string,
        firstName: authData.first_name as string,
        lastName: authData.last_name as string,
        businessType: authData.business_type as 'banking' | 'retail',
        role: authData.role as string,
        isVerified: authData.is_verified as boolean,
        requiresVerification: authData.requires_verification as boolean || false
      }, 'Account created successfully')
    );

    // Set secure HTTP-only cookie with JWT token
    if (authData.token) {
      response.cookies.set('voca_auth_token', authData.token as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      createErrorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
