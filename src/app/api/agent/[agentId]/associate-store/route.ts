import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '@/config/api';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const { agentId } = await params;
    const { store_id } = await request.json();
    const token = request.cookies.get('voca_auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    if (!store_id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }
    
    const response = await fetch(buildApiUrl('AGENT', `/v1/agent/agents/${agentId}/associate-store`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ store_id }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: result.message || 'Failed to associate agent with store' }, { status: response.status });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error associating agent with store:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
