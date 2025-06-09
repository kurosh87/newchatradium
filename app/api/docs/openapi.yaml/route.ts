import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// GET /api/docs/openapi.yaml - Serve OpenAPI specification
export async function GET(request: NextRequest) {
  try {
    // Read the OpenAPI spec from docs folder
    const filePath = join(process.cwd(), 'docs', 'api', 'openapi.yaml');
    const openApiSpec = readFileSync(filePath, 'utf8');
    
    return new NextResponse(openApiSpec, {
      headers: {
        'Content-Type': 'application/x-yaml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'OpenAPI specification not found' },
      { status: 404 }
    );
  }
}