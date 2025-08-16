import { NextRequest, NextResponse } from 'next/server';
import { OrderSubmission, OrderApiResponse } from '@/types/catalog';
import { mockDb } from '@/lib/mockDatabase';

// POST /api/orders - Submit customer order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { customerOrder, catalogId, agentId, selectedTier } = body;
    
    if (!customerOrder || !catalogId || !agentId || selectedTier === undefined) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Missing required fields: customerOrder, catalogId, agentId, selectedTier'
        },
        { status: 400 }
      );
    }

    // Validate customer order fields
    const { customerName, customerPhone, deliveryAddress, quantity, totalAmount } = customerOrder;
    
    if (!customerName || !customerPhone || !deliveryAddress || !quantity || !totalAmount) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Missing required customer order fields: customerName, customerPhone, deliveryAddress, quantity, totalAmount'
        },
        { status: 400 }
      );
    }

    // Create order submission
    const orderData: OrderSubmission = {
      customerOrder: {
        customerName,
        customerPhone,
        deliveryAddress,
        selectedTier: customerOrder.selectedTier,
        quantity,
        totalAmount
      },
      catalogId,
      agentId,
      orderDate: new Date().toISOString(),
      status: 'pending',
      selectedTier
    };
    
    // Save order using the database service
    mockDb.createOrder(orderData);
    
    // Log the order for debugging (remove in production)
    console.log('Order submitted:', orderData);
    
    const response: OrderApiResponse = {
      success: true,
      data: orderData,
      message: 'Order submitted successfully'
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error submitting order:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to submit order'
      },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get all orders (for admin purposes)
export async function GET() {
  try {
    const orders = mockDb.getAllOrders();
    return NextResponse.json({
      success: true,
      data: orders,
      message: 'Orders retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: 'Failed to fetch orders'
      },
      { status: 500 }
    );
  }
}
