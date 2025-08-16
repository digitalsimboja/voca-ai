import { NextRequest, NextResponse } from 'next/server';
import { CatalogApiResponse, CatalogListApiResponse } from '@/types/catalog';
import { mockDb } from '@/lib/mockDatabase';

// GET /api/catalogs - Get all catalogs
export async function GET() {
  try {
    const catalogs = mockDb.getAllCatalogs();
    const response: CatalogListApiResponse = {
      success: true,
      data: catalogs,
      message: 'Catalogs retrieved successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: 'Failed to fetch catalogs'
      },
      { status: 500 }
    );
  }
}

// POST /api/catalogs - Create new catalog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, description, mainImage, pricingTiers, agentId } = body;
    
    if (!name || !description || !mainImage || !pricingTiers || !agentId) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Missing required fields: name, description, mainImage, pricingTiers, agentId'
        },
        { status: 400 }
      );
    }

    // Create new catalog using the database service
    const newCatalog = mockDb.createCatalog({
      name,
      description,
      mainImage,
      pricingTiers,
      agentId,
      shareableLink: ''
    });
    
    const response: CatalogApiResponse = {
      success: true,
      data: newCatalog,
      message: 'Catalog created successfully'
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating catalog:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to create catalog'
      },
      { status: 500 }
    );
  }
}
