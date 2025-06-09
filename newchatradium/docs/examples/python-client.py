#!/usr/bin/env python3
"""
Radium AI Python SDK Example

This example demonstrates how to use the Radium AI platform to:
1. List available models
2. Deploy a model
3. Make inference requests
4. Monitor usage analytics
5. Manage API keys

Installation:
pip install requests python-dotenv

Setup:
1. Get your API key from https://radiumchat.com/deploy/api-keys
2. Set your API key in environment variable: RADIUM_API_KEY
"""

import os
import time
import requests
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RadiumClient:
    """Simple Python client for Radium AI API"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.radiumchat.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })
    
    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        
        if response.status_code >= 400:
            try:
                error_data = response.json()
                raise Exception(f"API Error: {error_data.get('error', response.text)}")
            except:
                raise Exception(f"HTTP {response.status_code}: {response.text}")
        
        return response.json()
    
    # Models API
    def list_models(self, category: str = None, provider: str = None, featured: bool = None) -> List[Dict]:
        """List available models"""
        params = {}
        if category:
            params['category'] = category
        if provider:
            params['provider'] = provider
        if featured is not None:
            params['featured'] = str(featured).lower()
        
        response = self._request("GET", "/models", params=params)
        return response.get('data', [])
    
    def get_model(self, model_id: str) -> Dict:
        """Get model details"""
        response = self._request("GET", f"/models/{model_id}")
        return response.get('data', {})
    
    # Deployments API
    def list_deployments(self, status: str = None) -> List[Dict]:
        """List deployments"""
        params = {}
        if status:
            params['status'] = status
        
        response = self._request("GET", "/deployments", params=params)
        return response.get('data', [])
    
    def create_deployment(self, model_id: str, name: str, configuration: Dict = None) -> Dict:
        """Create a new deployment"""
        data = {
            "modelId": model_id,
            "name": name
        }
        if configuration:
            data["configuration"] = configuration
        
        response = self._request("POST", "/deployments", json=data)
        return response.get('data', {})
    
    def get_deployment(self, deployment_id: str) -> Dict:
        """Get deployment details"""
        response = self._request("GET", f"/deployments/{deployment_id}")
        return response.get('data', {})
    
    def delete_deployment(self, deployment_id: str) -> bool:
        """Delete a deployment"""
        self._request("DELETE", f"/deployments/{deployment_id}")
        return True
    
    # Inference API (would be implemented as a separate endpoint)
    def inference(self, deployment_id: str, prompt: str, max_tokens: int = 100, temperature: float = 0.7) -> Dict:
        """Make an inference request (mock implementation)"""
        # This would typically be a separate endpoint for inference
        # For demo purposes, we'll simulate the response
        return {
            "id": f"cmpl-{int(time.time())}",
            "object": "text_completion",
            "created": int(time.time()),
            "model": deployment_id,
            "choices": [
                {
                    "text": f"This is a mock response to: {prompt}",
                    "index": 0,
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": len(prompt.split()),
                "completion_tokens": max_tokens,
                "total_tokens": len(prompt.split()) + max_tokens
            }
        }
    
    # API Keys
    def list_api_keys(self) -> List[Dict]:
        """List API keys"""
        response = self._request("GET", "/api-keys")
        return response.get('data', [])
    
    def create_api_key(self, name: str) -> Dict:
        """Create a new API key"""
        data = {"name": name}
        response = self._request("POST", "/api-keys", json=data)
        return response.get('data', {})
    
    # Analytics
    def get_analytics(self, timeframe: str = "24h", metric: str = "requests") -> Dict:
        """Get usage analytics"""
        params = {
            "timeframe": timeframe,
            "metric": metric
        }
        response = self._request("GET", "/analytics", params=params)
        return response.get('data', {})

def main():
    """Example usage of the Radium AI client"""
    
    # Initialize client
    api_key = os.getenv("RADIUM_API_KEY")
    if not api_key:
        print("Error: Please set RADIUM_API_KEY environment variable")
        return
    
    client = RadiumClient(api_key)
    
    try:
        # 1. List available models
        print("📚 Listing available models...")
        models = client.list_models(featured=True)
        print(f"Found {len(models)} featured models:")
        for model in models[:3]:  # Show first 3
            print(f"  - {model['name']} by {model['provider']}")
            print(f"    Price: {model['inputPrice']}/1M input, {model['outputPrice']}/1M output")
            print(f"    Capabilities: {', '.join(model.get('capabilities', []))}")
            print()
        
        if not models:
            print("No models found. Check your API key and try again.")
            return
        
        # 2. Deploy a model
        print("🚀 Creating a deployment...")
        selected_model = models[0]  # Use first model
        deployment_name = f"test-deployment-{int(time.time())}"
        
        deployment = client.create_deployment(
            model_id=selected_model['id'],
            name=deployment_name,
            configuration={
                "acceleratorType": "H100",
                "acceleratorCount": 1,
                "autoScaling": True,
                "minReplicas": 1,
                "maxReplicas": 3
            }
        )
        
        print(f"✅ Deployment created: {deployment['name']}")
        print(f"   Status: {deployment['status']}")
        print(f"   ID: {deployment['id']}")
        print()
        
        # 3. Wait for deployment to be active (in real scenario)
        print("⏳ Waiting for deployment to be active...")
        deployment_id = deployment['id']
        
        # In a real scenario, you'd poll until status is 'active'
        # For demo, we'll just show current status
        current_deployment = client.get_deployment(deployment_id)
        print(f"   Current status: {current_deployment['status']}")
        print()
        
        # 4. Make an inference request (mock)
        print("🧠 Making inference request...")
        response = client.inference(
            deployment_id=deployment_id,
            prompt="Explain quantum computing in simple terms",
            max_tokens=150,
            temperature=0.7
        )
        
        print("Response:")
        print(f"  {response['choices'][0]['text']}")
        print(f"  Tokens used: {response['usage']['total_tokens']}")
        print()
        
        # 5. Check analytics
        print("📊 Getting usage analytics...")
        analytics = client.get_analytics(timeframe="24h")
        summary = analytics.get('summary', {})
        
        print("24-hour summary:")
        print(f"  Total requests: {summary.get('totalRequests', 'N/A')}")
        print(f"  Success rate: {100 - float(summary.get('errorRate', '0%').rstrip('%')):.1f}%")
        print(f"  Total cost: {summary.get('totalCost', 'N/A')}")
        print(f"  Avg latency: {summary.get('avgLatency', 'N/A')}")
        print()
        
        # 6. List API keys
        print("🔑 Checking API keys...")
        api_keys = client.list_api_keys()
        print(f"You have {len(api_keys)} API key(s):")
        for key in api_keys:
            print(f"  - {key['name']}: {key['keyMasked']}")
            print(f"    Created: {key.get('createdFormatted', 'Unknown')}")
            print(f"    Usage: {key.get('usageFormatted', '0')} requests")
        print()
        
        # 7. Cleanup (delete deployment)
        print("🗑️  Cleaning up...")
        client.delete_deployment(deployment_id)
        print(f"✅ Deployment {deployment_name} deleted")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()