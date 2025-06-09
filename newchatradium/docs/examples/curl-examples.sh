#!/bin/bash

# Radium AI API Examples using cURL
# 
# Setup:
# 1. Get your API key from https://radiumchat.com/deploy/api-keys
# 2. Set your API key: export RADIUM_API_KEY="sk-your-api-key"
# 3. Run examples: bash curl-examples.sh

set -e

# Configuration
API_BASE_URL="https://api.radiumchat.com/v1"
# For local development, use: API_BASE_URL="http://localhost:3000/api/deploy"

# Check if API key is set
if [ -z "$RADIUM_API_KEY" ]; then
    echo "❌ Error: Please set RADIUM_API_KEY environment variable"
    echo "   export RADIUM_API_KEY=\"sk-your-api-key\""
    exit 1
fi

echo "🚀 Radium AI API Examples"
echo "=========================="
echo ""

# Function to make API requests with proper headers
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X "$method" "${API_BASE_URL}${endpoint}" \
            -H "Authorization: Bearer $RADIUM_API_KEY" \
            -H "Content-Type: application/json" \
            -d "$data"
    else
        curl -s -X "$method" "${API_BASE_URL}${endpoint}" \
            -H "Authorization: Bearer $RADIUM_API_KEY"
    fi
}

# Pretty print JSON responses
pretty_json() {
    if command -v jq &> /dev/null; then
        jq '.'
    else
        python -m json.tool 2>/dev/null || cat
    fi
}

echo "📚 1. List Available Models"
echo "----------------------------"
echo "Fetching featured models..."
api_request "GET" "/models?featured=true&limit=3" | pretty_json
echo ""

echo "🔍 2. Get Model Details"
echo "----------------------"
echo "Getting details for DeepSeek R1..."
api_request "GET" "/models/deepseek-r1-0528" | pretty_json
echo ""

echo "📋 3. List Current Deployments"
echo "------------------------------"
echo "Fetching your deployments..."
DEPLOYMENTS_RESPONSE=$(api_request "GET" "/deployments")
echo "$DEPLOYMENTS_RESPONSE" | pretty_json

# Extract first deployment ID for later use
DEPLOYMENT_ID=$(echo "$DEPLOYMENTS_RESPONSE" | python -c "
import json, sys
try:
    data = json.load(sys.stdin)
    deployments = data.get('data', [])
    if deployments:
        print(deployments[0]['id'])
    else:
        print('')
except:
    print('')
" 2>/dev/null)

echo ""

echo "🚀 4. Create New Deployment"
echo "---------------------------"
echo "Creating a test deployment..."
DEPLOYMENT_DATA='{
  "modelId": "deepseek-r1-0528",
  "name": "test-deployment-'$(date +%s)'",
  "configuration": {
    "acceleratorType": "H100",
    "acceleratorCount": 1,
    "autoScaling": true,
    "minReplicas": 1,
    "maxReplicas": 3
  }
}'

CREATE_RESPONSE=$(api_request "POST" "/deployments" "$DEPLOYMENT_DATA")
echo "$CREATE_RESPONSE" | pretty_json

# Extract new deployment ID
NEW_DEPLOYMENT_ID=$(echo "$CREATE_RESPONSE" | python -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get('data', {}).get('id', ''))
except:
    print('')
" 2>/dev/null)

echo ""

if [ -n "$NEW_DEPLOYMENT_ID" ]; then
    echo "📊 5. Get Deployment Details"
    echo "----------------------------"
    echo "Fetching details for deployment: $NEW_DEPLOYMENT_ID"
    api_request "GET" "/deployments/$NEW_DEPLOYMENT_ID" | pretty_json
    echo ""
fi

echo "🔑 6. List API Keys"
echo "------------------"
echo "Fetching your API keys..."
api_request "GET" "/api-keys" | pretty_json
echo ""

echo "🆕 7. Create New API Key"
echo "-----------------------"
echo "Creating a test API key..."
API_KEY_DATA='{
  "name": "Test API Key - '$(date +%Y%m%d)'"
}'

api_request "POST" "/api-keys" "$API_KEY_DATA" | pretty_json
echo ""

echo "📈 8. Get Usage Analytics"
echo "------------------------"
echo "Fetching 24-hour analytics..."
api_request "GET" "/analytics?timeframe=24h" | pretty_json
echo ""

echo "💳 9. Get Billing Information"
echo "-----------------------------"
echo "Fetching billing details..."
api_request "GET" "/billing" | pretty_json
echo ""

echo "🏷️ 10. Get Quotas"
echo "------------------"
echo "Fetching resource quotas..."
api_request "GET" "/quotas" | pretty_json
echo ""

# Cleanup: Delete the test deployment if created
if [ -n "$NEW_DEPLOYMENT_ID" ]; then
    echo "🗑️  11. Cleanup - Delete Test Deployment"
    echo "----------------------------------------"
    echo "Deleting test deployment: $NEW_DEPLOYMENT_ID"
    api_request "DELETE" "/deployments/$NEW_DEPLOYMENT_ID" | pretty_json
    echo ""
fi

echo "✅ Examples completed!"
echo ""
echo "📚 Additional Examples:"
echo "----------------------"
echo ""

echo "# Filter models by provider"
echo "curl -H \"Authorization: Bearer \$RADIUM_API_KEY\" \\"
echo "     \"${API_BASE_URL}/models?provider=Meta\""
echo ""

echo "# Get analytics for different timeframes"
echo "curl -H \"Authorization: Bearer \$RADIUM_API_KEY\" \\"
echo "     \"${API_BASE_URL}/analytics?timeframe=7d&metric=tokens\""
echo ""

echo "# Update deployment configuration"
echo "curl -X PUT -H \"Authorization: Bearer \$RADIUM_API_KEY\" \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"configuration\": {\"maxReplicas\": 5}}' \\"
echo "     \"${API_BASE_URL}/deployments/YOUR_DEPLOYMENT_ID\""
echo ""

echo "# Search models"
echo "curl -H \"Authorization: Bearer \$RADIUM_API_KEY\" \\"
echo "     \"${API_BASE_URL}/models?search=llama&limit=5\""
echo ""

echo "🔧 Error Handling Examples:"
echo "---------------------------"
echo ""

echo "# Invalid API key (401 error)"
echo "curl -H \"Authorization: Bearer invalid-key\" \\"
echo "     \"${API_BASE_URL}/deployments\""
echo ""

echo "# Non-existent resource (404 error)"
echo "curl -H \"Authorization: Bearer \$RADIUM_API_KEY\" \\"
echo "     \"${API_BASE_URL}/deployments/non-existent-id\""
echo ""

echo "# Invalid request body (400 error)"
echo "curl -X POST -H \"Authorization: Bearer \$RADIUM_API_KEY\" \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"invalid\": \"data\"}' \\"
echo "     \"${API_BASE_URL}/deployments\""
echo ""

echo "📖 For more examples and detailed documentation:"
echo "   https://docs.radiumchat.com/api"
echo ""
echo "🛠️  Interactive API Explorer:"
echo "   https://api.radiumchat.com/docs"