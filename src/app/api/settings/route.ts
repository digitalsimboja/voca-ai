import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/config/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const response = await fetch(buildApiUrl('SETTINGS', '/v1/settings'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: result.message || 'Failed to fetch settings' }, { status: response.status });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json();
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const response = await fetch(buildApiUrl('SETTINGS', '/v1/settings'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settingsData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: result.message || 'Failed to update settings' }, { status: response.status });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
