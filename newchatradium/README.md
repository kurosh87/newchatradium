<a href="https://radium.cloud/">
  <img alt="Next.js 15 and App Router-ready AI chatbot and deployment platform." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Radium Chat</h1>
</a>

<p align="center">
    Radium Chat is a powerful AI chatbot application with integrated model deployment capabilities, built with Next.js and modern web technologies.
</p>

<p align="center">
  <a href="https://radium.cloud/docs"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- **AI Chat Interface**
  - Advanced conversational AI with multiple model support
  - Real-time streaming responses
  - Chat history and session management
  - Multimodal input support (text and images)
- **Model Deployment Platform**
  - Deploy and manage AI models with ease
  - Real-time deployment monitoring and analytics
  - API key management and usage tracking
  - Cost monitoring and billing dashboard
- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- Modern AI Integration
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports xAI (default), OpenAI, Anthropic, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
  - Custom rainbow button animations with MagicUI
- Data Persistence
  - Serverless Postgres for saving chat history and user data
  - Efficient file storage for documents and artifacts
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Model Providers

Radium Chat supports multiple AI model providers through our unified interface. The platform ships with [xAI](https://x.ai) `grok-2-1212` as the default chat model, and supports:

- **xAI** - Grok models for reasoning and conversation
- **OpenAI** - GPT models including GPT-4 and GPT-3.5
- **Anthropic** - Claude models for advanced reasoning
- **Google** - Gemini models for multimodal capabilities
- **Custom Models** - Deploy your own fine-tuned models

You can easily switch between providers or deploy custom models through the Radium Cloud deployment platform.

## Deploy Your Own

You can deploy your own version of Radium Chat to various platforms:

### Deploy to Radium Cloud (Recommended)
Experience the full power of Radium Chat with our integrated deployment platform:
- **Automatic scaling** and load balancing
- **Built-in monitoring** and analytics
- **Integrated model deployment** capabilities
- **One-click setup** with pre-configured environments

### Other Deployment Options
Radium Chat is built with modern web standards and can be deployed to:
- **Vercel** - For frontend hosting with serverless functions
- **Railway** - For full-stack deployment with databases
- **Netlify** - For static site generation and edge functions
- **Docker** - For containerized deployments

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Radium Chat. A `.env` file is all that is necessary for local development.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kurosh87/newchatradium.git
   cd newchatradium
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

Your Radium Chat application should now be running on [localhost:3000](http://localhost:3000).

### Features Available Locally
- **Chat Interface** - Full conversational AI capabilities
- **Deployment Platform** - Mock deployment interface for testing
- **Model Management** - Simulated model deployment and monitoring
- **Analytics Dashboard** - Mock usage and billing data
