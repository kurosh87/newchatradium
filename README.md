<a href="https://radium.cloud/">
  <img alt="Next.js 15 and App Router-ready AI chatbot and deployment platform." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Radium Cloud Platform</h1>
</a>

<p align="center">
    A comprehensive AI platform for deploying, managing, and scaling machine learning models with an integrated chat interface. Built for developers who need enterprise-grade ML infrastructure with modern web technologies.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#platform-capabilities"><strong>Platform</strong></a> ·
  <a href="#mock-services"><strong>Mock Services</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy</strong></a> ·
  <a href="#running-locally"><strong>Local Setup</strong></a>
</p>
<br/>

## Features

### 🚀 ML Model Deployment Platform
- **One-Click Deployments** - Deploy models with automatic scaling and load balancing
- **Multi-Framework Support** - TensorFlow, PyTorch, HuggingFace, and custom models
- **API Gateway** - Secure endpoints with authentication and rate limiting
- **Real-Time Monitoring** - Performance metrics, usage analytics, and health checks
- **Version Management** - A/B testing, rollbacks, and blue-green deployments

### 💬 Integrated Chat Interface
- **Multi-Provider AI** - OpenAI, Anthropic, xAI, Google, and custom models
- **Real-Time Streaming** - Live response generation with WebSocket support
- **Multimodal Support** - Text, image, and file processing capabilities
- **Session Management** - Persistent chat history and context preservation

### 📊 Enterprise Dashboard
- **Analytics & Insights** - Usage patterns, cost analysis, and performance metrics
- **Team Management** - User roles, permissions, and collaboration tools
- **API Key Management** - Secure credential handling and access controls
- **Billing & Quotas** - Usage tracking, cost optimization, and billing integration

### 🛠 Developer Experience
- **Modern Stack** - Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Database Integration** - PostgreSQL with Drizzle ORM for type-safe queries
- **Authentication** - NextAuth.js with multiple provider support
- **Testing Suite** - Playwright E2E tests and comprehensive test coverage

## Platform Capabilities

Radium Cloud provides enterprise-grade infrastructure for ML teams:

### Model Lifecycle Management
- **Training Integration** - Connect with popular ML training platforms
- **Automated CI/CD** - GitHub Actions integration for model deployment pipelines
- **Environment Management** - Development, staging, and production environments
- **Resource Optimization** - Auto-scaling based on demand and cost optimization

### Security & Compliance
- **SOC 2 Ready** - Enterprise security standards and audit trails
- **Data Privacy** - GDPR/CCPA compliant data handling
- **Access Controls** - Fine-grained permissions and role-based access
- **Audit Logging** - Comprehensive activity tracking and compliance reporting

## Mock Services

This repository includes comprehensive mock services for development and testing:

### 🎭 Simulated Cloud Infrastructure
- **Mock Deployment APIs** - Simulate model deployment without actual cloud resources
- **Fake Analytics Data** - Pre-populated metrics and usage statistics for UI testing
- **Test Billing System** - Stripe integration with test keys for payment flow testing
- **Mock Model Registry** - Simulated model versions and metadata management

### 📋 Development Features
- **Sample Datasets** - Pre-loaded test data for quick prototyping
- **Mock User Management** - Simulated team members and permission testing
- **Fake Monitoring Data** - Synthetic performance metrics and alerts
- **Test API Responses** - Realistic mock responses for all platform endpoints

### 🔧 Testing Infrastructure
- **E2E Test Suite** - Comprehensive Playwright tests covering all user flows
- **API Testing** - Mock service validation and contract testing
- **Performance Testing** - Load testing with simulated high-traffic scenarios
- **Integration Tests** - Cross-service communication and data flow validation

## Deploy Your Own

Deploy the Radium Cloud platform to your preferred infrastructure:

### 🚀 Production Deployment Options

#### Vercel (Recommended for Frontend)
```bash
# One-click deployment with automatic CI/CD
vercel --prod
```
- **Auto-scaling** serverless functions
- **Global CDN** with edge optimization
- **Built-in analytics** and performance monitoring
- **Zero-config** deployment with GitHub integration

#### Docker Containerization
```bash
# Build and run with Docker
docker build -t radium-cloud .
docker run -p 3000:3000 radium-cloud
```
- **Consistent environments** across dev/staging/prod
- **Kubernetes** ready for enterprise deployments
- **Multi-stage builds** for optimized production images

#### Self-Hosted Infrastructure
- **AWS/GCP/Azure** - Enterprise cloud deployments
- **Kubernetes** - Container orchestration at scale
- **Railway/Render** - Simplified full-stack hosting
- **DigitalOcean** - Cost-effective cloud hosting

### 🔧 Infrastructure Requirements
- **Node.js 18+** - Runtime environment
- **PostgreSQL** - Primary database for user data and chat history
- **Redis** (Optional) - Session storage and caching
- **Stripe Account** - Payment processing for billing features

## Running Locally

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database (local or cloud)
- API keys for AI providers (OpenAI, Anthropic, etc.)

### Quick Start

1. **Clone and Setup**
   ```bash
   git clone https://github.com/kurosh87/newchatradium.git
   cd newchatradium
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   POSTGRES_URL="postgresql://username:password@localhost:5432/radium"
   
   # AI Providers
   OPENAI_API_KEY="sk-..."
   ANTHROPIC_API_KEY="sk-ant-..."
   XAI_API_KEY="xai-..."
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe (for billing features)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

3. **Database Setup**
   ```bash
   # Run database migrations
   pnpm db:migrate
   
   # (Optional) Seed with sample data
   pnpm db:seed
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

Your Radium Cloud platform will be available at [localhost:3000](http://localhost:3000).

### 🎯 Development Features

#### Mock Services Mode
Perfect for development without external dependencies:
- **Simulated ML deployments** - Test deployment flows without cloud costs
- **Fake analytics data** - Pre-populated dashboards for UI development
- **Mock billing system** - Test payment flows with Stripe test mode
- **Sample datasets** - Ready-to-use data for rapid prototyping

#### Available Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run test suite
pnpm test:e2e     # Run end-to-end tests
pnpm db:studio    # Open database GUI
pnpm lint         # Code linting and formatting
```

#### Development Tools
- **Database Studio** - Visual database management
- **API Documentation** - Interactive OpenAPI docs at `/api/docs`
- **Component Storybook** - UI component development
- **Performance Monitoring** - Built-in analytics and debugging
