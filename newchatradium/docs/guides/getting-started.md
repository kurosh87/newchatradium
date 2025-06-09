# Getting Started Guide

Welcome to the Radium AI Deployment Platform! This guide will walk you through setting up your account, deploying your first model, and making your first API call.

## Prerequisites

- A Radium AI account (sign up at [app.radium.ai](https://app.radium.ai))
- A valid payment method for billing
- Basic knowledge of REST APIs

## Step 1: Account Setup

### 1.1 Create Your Account

1. Visit [app.radium.ai](https://app.radium.ai) and click "Sign Up"
2. Enter your email and password
3. Verify your email address
4. Complete your profile information

### 1.2 Add Payment Method

1. Navigate to **Billing** in the sidebar
2. Click **Add Payment Method**
3. Enter your credit card information
4. Confirm the payment method

> **Note**: Adding a payment method unlocks Tier 1 spending limits ($50/month). You start with $5 in free credits.

## Step 2: Explore the Model Library

### 2.1 Browse Available Models

1. Go to **Model Library** in the sidebar
2. Browse models by:
   - **Category**: Text generation, Code generation, etc.
   - **Provider**: DeepSeek, Meta, Alibaba, etc.
   - **Capabilities**: LLM, Vision, Fine-tunable, etc.

### 2.2 Popular Models

| Model | Use Case | Context | GPU |
|-------|----------|---------|-----|
| **DeepSeek R1** | Advanced reasoning, code generation | 64K | H100 |
| **Qwen3 30B** | Fast general-purpose chat | 32K | H100 |
| **Llama 4 Maverick** | Instruction following, vision | 1M | A100 |

### 2.3 Model Details

Click on any model to see:
- Detailed description and capabilities
- Pricing (input/output tokens)
- Performance metrics (latency, throughput)
- GPU requirements
- Benchmarks and examples

## Step 3: Deploy Your First Model

### 3.1 Start a New Deployment

1. Click **New Deployment** from the dashboard or deployments page
2. Or click **Deploy** on any model card

### 3.2 Configure Your Deployment

**Step 1: Select Model**
- Choose your model (e.g., DeepSeek R1)
- Review pricing and requirements

**Step 2: Performance Settings**
- **Accelerator Type**: GPU type (auto-selected)
- **Accelerator Count**: Number of GPUs
- **Speculative Decoding**: Enable for faster inference (optional)

**Step 3: Scaling Configuration**
- **Auto-scaling**: Automatically scale based on demand
- **Min Replicas**: Minimum number of instances (1 recommended)
- **Max Replicas**: Maximum instances for scaling (3 recommended)

**Step 4: Metadata**
- **Deployment Name**: Give your deployment a memorable name
- **Description**: Optional description for your reference

### 3.3 Deploy

1. Review your configuration and estimated costs
2. Click **Deploy Model**
3. Monitor deployment progress (usually 2-5 minutes)

Your deployment will go through these stages:
- **Pending**: Queued for deployment
- **Deploying**: Provisioning GPU resources and loading model
- **Active**: Ready to accept requests

## Step 4: Generate an API Key

### 4.1 Create API Key

1. Navigate to **API Keys** in the sidebar
2. Click **New API Key**
3. Enter a descriptive name (e.g., "Production Key")
4. Click **Create**

### 4.2 Secure Your API Key

⚠️ **Important**: The full API key is only shown once. Copy and save it securely.

```
sk-prod-abc123def456...
```

Best practices:
- Store in environment variables, not in code
- Use different keys for development and production
- Rotate keys regularly
- Monitor usage in the dashboard

## Step 5: Make Your First API Call

### 5.1 Get Your Endpoint

1. Go to **Deployments** and find your active deployment
2. Copy the endpoint URL (e.g., `https://api.radium.ai/v1/models/your-deployment-id`)

### 5.2 Test with cURL

```bash
curl -X POST "https://api.radium.ai/v1/models/your-deployment-id/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello! Can you help me understand quantum computing?",
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

### 5.3 Expected Response

```json
{
  "id": "cmpl-abc123",
  "object": "text_completion",
  "created": 1640995200,
  "model": "deepseek-r1-0528",
  "choices": [
    {
      "text": "Quantum computing is a revolutionary approach to computation that leverages quantum mechanical phenomena...",
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 185,
    "total_tokens": 200
  }
}
```

## Step 6: Monitor and Scale

### 6.1 Dashboard Overview

Your dashboard shows:
- **Recent deployments** and their status
- **Usage metrics** for the last 24 hours
- **Cost tracking** and spending alerts
- **Quick actions** for common tasks

### 6.2 Analytics

Monitor your deployment performance:
- **Request volume** and success rates
- **Latency** and throughput metrics
- **Token usage** and costs
- **Error rates** and troubleshooting

### 6.3 Scaling

Your deployment automatically scales based on:
- **Request volume**: More requests = more replicas
- **Latency targets**: Maintains consistent response times
- **Resource limits**: Respects your min/max replica settings

## Next Steps

### Fine-tune a Model

1. **Upload a dataset** in JSONL format
2. **Create a fine-tuning job** with your base model
3. **Monitor training progress** in real-time
4. **Deploy your custom model** when training completes

See [Fine-tuning Guide](./fine-tuning.md) for detailed instructions.

### Integrate with Your Application

- Use our [Python SDK](../examples/python-client.py) for Python applications
- Try our [JavaScript SDK](../examples/javascript-client.js) for web applications
- See [API Examples](../examples/) for more integration patterns

### Production Deployment

- Set up **monitoring and alerting** for your deployments
- Configure **webhooks** for real-time status updates
- Implement **proper error handling** and retry logic
- Use **environment variables** for API keys and endpoints

## Support

Need help? We're here to assist:

- **Documentation**: [docs.radium.ai](https://docs.radium.ai)
- **Support Email**: support@radium.ai
- **Status Page**: [status.radium.ai](https://status.radium.ai)
- **Community**: Join our Discord community

## Troubleshooting

### Common Issues

**Deployment fails to start**
- Check your account spending limits
- Verify payment method is valid
- Ensure sufficient quota for GPU resources

**API calls return 401 Unauthorized**
- Verify your API key is correct
- Check if the key has been revoked
- Ensure proper Authorization header format

**High latency or timeouts**
- Check deployment status and health
- Consider increasing replica count
- Review request patterns and batching

**Unexpected costs**
- Monitor token usage in analytics
- Set spending alerts and limits
- Review pricing for your selected models

---

Congratulations! You've successfully deployed your first AI model on Radium. Start building amazing AI-powered applications! 🚀