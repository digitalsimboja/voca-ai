import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG, API_ENDPOINTS, ApiResponse } from '@/lib/api-utils';

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    // Build query string
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit);
    if (offset) queryParams.append('offset', offset);
    if (status) queryParams.append('status', status);
    if (search) queryParams.append('search', search);
    if (start_date) queryParams.append('start_date', start_date);
    if (end_date) queryParams.append('end_date', end_date);

    const endpoint = `${API_ENDPOINTS.ORDER.ORDERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const url = `${API_CONFIG.ORDER.baseUrl}${API_CONFIG.ORDER.prefix}${endpoint}`;

    // Call backend order service directly
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ApiResponse;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      delivery_address, 
      items, 
      total_amount, 
      store_id, 
      catalog_id, 
      agent_id, 
      notes 
    } = body;

    // Validate required fields
    if (!customer_name || !delivery_address || !items || !total_amount || !store_id) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Get token from cookies (optional for order creation)
    const token = request.cookies.get('voca_auth_token')?.value;

    const url = `${API_CONFIG.ORDER.baseUrl}${API_CONFIG.ORDER.prefix}${API_ENDPOINTS.ORDER.ORDERS}`;

    // Call backend order service directly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        delivery_address,
        items,
        total_amount,
        store_id,
        catalog_id: catalog_id || null,
        agent_id: agent_id || null,
        notes: notes || null
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ApiResponse;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
