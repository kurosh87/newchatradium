import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// GET /api/docs - Serve Swagger UI for API documentation
export async function GET(request: NextRequest) {
  const swaggerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Radium AI API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin: 0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #1f2937;
        }
        .swagger-ui .topbar .download-url-wrapper .select-label {
            color: #f9fafb;
        }
        .swagger-ui .info .title {
            color: #1f2937;
        }
        .swagger-ui .scheme-container {
            background: #1f2937;
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            // Build a system
            const ui = SwaggerUIBundle({
                url: '/api/docs/openapi.yaml',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                requestInterceptor: (request) => {
                    // Add custom headers or modify requests here
                    return request;
                },
                responseInterceptor: (response) => {
                    // Handle responses here
                    return response;
                },
                onComplete: () => {
                    console.log('Swagger UI loaded');
                },
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                validatorUrl: null, // Disable validator
                docExpansion: 'list',
                operationsSorter: 'alpha',
                tagsSorter: 'alpha',
                filter: true,
                showExtensions: true,
                showCommonExtensions: true
            });

            // Custom styling
            setTimeout(() => {
                // Add custom header
                const topbar = document.querySelector('.topbar');
                if (topbar) {
                    const customHeader = document.createElement('div');
                    customHeader.innerHTML = \`
                        <div style="padding: 10px 20px; background: #1f2937; color: white; text-align: center; font-weight: bold;">
                            <span style="font-size: 18px;">🚀 Radium AI Deployment Platform API</span>
                            <span style="margin-left: 20px; font-size: 14px; opacity: 0.8;">v1.0.0</span>
                        </div>
                    \`;
                    topbar.parentNode.insertBefore(customHeader, topbar);
                }
            }, 100);
        };
    </script>
</body>
</html>`;

  return new NextResponse(swaggerHTML, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}