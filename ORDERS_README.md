# Product Catalog & Shareable Order System

This document describes the product catalog and shareable order functionality implemented in the Voca AI application.

## Overview

The system allows retail vendors to create product catalogs and generate shareable links for social media. When customers click the link, they can view products, select packages, and place orders directly through a customer-friendly interface.

## Features

### 1. Product Catalog Creation (`/orders/create`)
- **Vendor Information Form**: Collect vendor details (business name, vendor name, email, phone, social media handle)
- **Product Items**: Add up to 3 products with descriptions and images
- **Pricing Tiers**: Configure bulk pricing with discounts (e.g., 1 pack: ₦17,000, 3 packs: ₦45,000, 5 packs: ₦100,000 with free delivery)
- **Image Upload**: Upload product images for each item
- **AI Agent Integration**: Link catalogs to AI agents for automated order processing
- **Shareable Link Generation**: Generate unique URLs for social media sharing

### 2. Order Listing (`/orders`)
- **Order Overview**: View all orders with status, customer info, and totals
- **Search & Filter**: Filter orders by status and search by customer name/email/order ID
- **Statistics**: Display total orders, revenue, average order value, and pending orders
- **Quick Actions**: View order details, edit orders, and manage order status

### 3. Customer Order Page (`/order/[catalogId]`)
- **Product Display**: Beautiful product catalog with images and descriptions
- **Pricing Tiers**: Interactive package selection with bulk discounts
- **Customer Information Form**: Simple form for customer details (name, phone, address)
- **Shopping Cart**: Real-time cart management with order summary
- **Order Confirmation**: Success page with order details

### 4. Order Details (`/orders/[id]`)
- **Order Timeline**: Visual status tracking (pending → processing → shipped → delivered)
- **Customer Information**: Complete customer details and delivery address
- **Order Items**: Detailed view of ordered products with quantities and pricing
- **AI Agent Integration**: Information about the AI agent handling the order

## AI Agent Integration

### CreateRetailAgentModal Integration
- Orders can be linked to AI agents created through the CreateRetailAgentModal
- Agent ID is automatically generated based on agent profile name
- AI agents handle:
  - Order tracking and updates
  - Customer communication
  - Delivery status notifications
  - Payment processing

### Agent Capabilities
- **Order Management**: Track orders and provide real-time updates
- **Customer Service**: Handle customer inquiries and support
- **Social Media Integration**: Manage social media presence and engagement
- **Payment Processing**: Handle payment gateways and transactions
- **Delivery Management**: Coordinate with delivery partners

## Pricing Structure

The system supports flexible pricing tiers for bulk orders:

```
Example: Herbal Tea Pack
- 1 Pack: ₦17,000
- 3 Packs: ₦45,000 (12% discount)
- 5 Packs: ₦100,000 (18% discount + free delivery)
```

## File Structure

```
src/app/orders/
├── page.tsx                    # Orders listing page
├── create/
│   └── page.tsx               # Product catalog creation form
└── [id]/
    └── page.tsx               # Order details page

src/app/order/
└── [catalogId]/
    └── page.tsx               # Customer-facing order page
```

## Usage Flow

### For Vendors:
1. **Create Product Catalog**: Navigate to `/orders/create` or click "Create Order" from customers/orders page
2. **Fill Vendor Info**: Enter business details and social media handle
3. **Add Products**: Add up to 3 products with images, descriptions, and pricing tiers
4. **Create AI Agent**: Use the "Create Agent" button to set up an AI agent for order processing
5. **Generate Shareable Link**: Create a unique URL for social media sharing
6. **Share Link**: Copy and share the link on social media platforms

### For Customers:
1. **Click Shareable Link**: Access the product catalog via the shared link
2. **Browse Products**: View product images, descriptions, and pricing options
3. **Select Packages**: Choose from available pricing tiers (1 pack, 3 packs, 5 packs)
4. **Enter Information**: Provide name, phone number, and delivery address
5. **Place Order**: Submit order and receive confirmation

## Navigation

The Orders section is accessible through:
- Sidebar navigation: "Orders" menu item
- Customers page: "Create Order" button
- Direct URL: `/orders`

## Technical Implementation

- **React/Next.js**: Built with React hooks and Next.js routing
- **TypeScript**: Full type safety for order data structures
- **Tailwind CSS**: Responsive design with Tailwind utility classes
- **Component Reuse**: Leverages existing UI components (Card, Badge, etc.)
- **Modal Integration**: Seamless integration with CreateRetailAgentModal

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live order status updates
- **Payment Integration**: Direct payment processing within the order flow
- **Inventory Management**: Real-time inventory tracking and alerts
- **Analytics Dashboard**: Advanced order analytics and reporting
- **Multi-language Support**: Internationalization for global markets
- **Mobile App**: Native mobile application for order management
