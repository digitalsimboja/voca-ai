import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/config/api';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('voca_auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const response = await fetch(buildApiUrl('AGENT', '/v1/agent/agents'), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: result.message || 'Failed to fetch agents' }, { status: response.status });
    }

    const agents = Array.isArray(result.data) ? result.data : Array.isArray(result.data?.agents) ? result.data.agents : [];

    return NextResponse.json({ status: 'success', message: result.message || 'Agents retrieved', data: agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
