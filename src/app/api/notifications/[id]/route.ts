import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('NOTIFICATION', `/${id}`, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch notification'),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('NOTIFICATION', `/${id}`, token, {
      method: 'PUT'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      createErrorResponse('Failed to mark notification as read'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('NOTIFICATION', `/${id}`, token, {
      method: 'DELETE'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      createErrorResponse('Failed to delete notification'),
      { status: 500 }
    );
  }
}
