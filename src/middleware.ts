import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl, API_ENDPOINTS, getAuthHeaders } from '@/config/api'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/conversations',
  '/customers',
  '/analytics',
  '/integrations',
  '/settings',
  '/billing'
]

// Define auth routes (should redirect if already authenticated)
const authRoutes = [
  '/login',
  '/signup'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get token from cookies
  const token = request.cookies.get('voca_auth_token')?.value
  
  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If accessing auth route with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      // Verify token with auth service
      const authResponse = await fetch(buildApiUrl('AUTH', API_ENDPOINTS.AUTH.VERIFY), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      })
      
      if (authResponse.ok) {
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // If verification fails, continue to auth page
      console.error('Token verification failed:', error)
    }
  }
  
  // For protected routes with token, verify it
  if (isProtectedRoute && token) {
    try {
      const authResponse = await fetch(buildApiUrl('AUTH', API_ENDPOINTS.AUTH.VERIFY), {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      })
      
      if (!authResponse.ok) {
        // Token is invalid, redirect to login
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // If verification fails, redirect to login
      console.error('Token verification failed:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
