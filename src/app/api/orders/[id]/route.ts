import { NextRequest, NextResponse } from 'next/server';
import { makeAuthenticatedApiCall, createErrorResponse } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('ORDER', `/${id}`, token, {
      method: 'GET'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch order'),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await makeAuthenticatedApiCall('ORDER', `/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(body)
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to update order'),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const token = request.cookies.get('voca_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        createErrorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const response = await makeAuthenticatedApiCall('ORDER', `/${id}`, token, {
      method: 'DELETE'
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to delete order'),
      { status: 500 }
    );
  }
}
