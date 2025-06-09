# API Documentation

The Radium AI Deployment Platform provides a comprehensive REST API for managing deployments, models, fine-tuning jobs, and more.

## Base URL

```
https://api.radiumchat.com/v1
```

For development:
```
http://localhost:3000/api/deploy
```

## Authentication

All API requests require authentication using API keys. Include your API key in the Authorization header:

```bash
Authorization: Bearer sk-your-api-key
```

## Response Format

All API responses follow a consistent format:

```json
{
  "data": {...},      // Response data
  "message": "...",   // Optional success message
  "error": "...",     // Error message (on errors)
  "pagination": {     // Pagination info (for list endpoints)
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses include details:

```json
{
  "error": "Model not found",
  "code": "MODEL_NOT_FOUND",
  "details": {...}
}
```

## Rate Limiting

API requests are rate limited based on your account tier:

- **Tier 1**: 1,000 requests/minute
- **Tier 2**: 5,000 requests/minute
- **Tier 3**: 10,000 requests/minute
- **Enterprise**: Custom limits

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Endpoints

### [Deployments](./deployments.md)
- `GET /deployments` - List deployments
- `POST /deployments` - Create deployment
- `GET /deployments/{id}` - Get deployment details
- `PUT /deployments/{id}` - Update deployment
- `DELETE /deployments/{id}` - Delete deployment

### [Models](./models.md)
- `GET /models` - List available models
- `GET /models/{id}` - Get model details

### [API Keys](./api-keys.md)
- `GET /api-keys` - List API keys
- `POST /api-keys` - Create API key
- `PUT /api-keys/{id}` - Update API key
- `DELETE /api-keys/{id}` - Revoke API key

### [Fine-tuning](./fine-tuning.md)
- `GET /fine-tuning` - List fine-tuning jobs
- `POST /fine-tuning` - Create fine-tuning job
- `GET /fine-tuning/{id}` - Get job details
- `POST /fine-tuning/{id}/cancel` - Cancel job

### [Datasets](./datasets.md)
- `GET /datasets` - List datasets
- `POST /datasets` - Create dataset
- `GET /datasets/{id}` - Get dataset details
- `DELETE /datasets/{id}` - Delete dataset

### [Analytics](./analytics.md)
- `GET /analytics/usage` - Get usage metrics
- `GET /analytics/costs` - Get cost analytics
- `GET /analytics/performance` - Get performance metrics

### [Billing](./billing.md)
- `GET /billing` - Get billing information
- `POST /billing/payment-methods` - Add payment method
- `GET /billing/invoices` - List invoices

## SDKs

Official SDKs are available for popular programming languages:

- **Python**: `pip install radium-ai`
- **JavaScript/Node.js**: `npm install @radium-ai/sdk`
- **Go**: `go get github.com/radium-ai/go-sdk`

## Examples

### Deploy a Model

```bash
curl -X POST https://api.radiumchat.com/v1/deployments \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "deepseek-r1-0528",
    "name": "my-deployment",
    "configuration": {
      "acceleratorType": "H100",
      "acceleratorCount": 1,
      "autoScaling": true,
      "minReplicas": 1,
      "maxReplicas": 3
    }
  }'
```

### Make an Inference Request

```bash
curl -X POST https://api.radiumchat.com/v1/models/your-deployment-id/completions \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "max_tokens": 100,
    "temperature": 0.7
  }'
```

### Get Usage Analytics

```bash
curl -X GET "https://api.radiumchat.com/v1/analytics/usage?timeframe=24h" \
  -H "Authorization: Bearer sk-your-api-key"
```

## Webhooks

Configure webhooks to receive real-time notifications about deployment status changes, fine-tuning completion, and billing events.

See [Webhooks Documentation](./webhooks.md) for setup instructions.

## OpenAPI Specification

Download our complete OpenAPI 3.0 specification:

- [OpenAPI JSON](./openapi.json)
- [OpenAPI YAML](./openapi.yaml)

## Changelog

See [API Changelog](./changelog.md) for version history and breaking changes.