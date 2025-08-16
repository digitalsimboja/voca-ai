import { NextRequest, NextResponse } from 'next/server';
import { CatalogApiResponse } from '@/types/catalog';
import { mockDb } from '@/lib/mockDatabase';

// GET /api/catalogs/[id] - Get catalog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const catalogId = id;
    const catalog = mockDb.getCatalogById(catalogId);
    
    if (!catalog) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Catalog not found'
        },
        { status: 404 }
      );
    }
    
    const response: CatalogApiResponse = {
      success: true,
      data: catalog,
      message: 'Catalog retrieved successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to fetch catalog'
      },
      { status: 500 }
    );
  }
}

// PUT /api/catalogs/[id] - Update catalog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const catalogId = id;
    const body = await request.json();
    
    const updatedCatalog = mockDb.updateCatalog(catalogId, body);
    
    if (!updatedCatalog) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Catalog not found'
        },
        { status: 404 }
      );
    }
    
    const response: CatalogApiResponse = {
      success: true,
      data: updatedCatalog,
      message: 'Catalog updated successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating catalog:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to update catalog'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/catalogs/[id] - Delete catalog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const catalogId = id;
    const deletedCatalog = mockDb.deleteCatalog(catalogId);
    
    if (!deletedCatalog) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: 'Catalog not found'
        },
        { status: 404 }
      );
    }
    
    const response: CatalogApiResponse = {
      success: true,
      data: deletedCatalog,
      message: 'Catalog deleted successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting catalog:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Failed to delete catalog'
      },
      { status: 500 }
    );
  }
}
