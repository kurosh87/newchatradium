'use client';

import { GetStartedLayout } from './base-layout';
import { 
  Key, 
  Shield, 
  TestTube, 
  Code,
  Lock,
  Activity,
  Users,
  Zap
} from 'lucide-react';

interface ApiKeysGetStartedProps {
  onCreateApiKey: () => void;
}

export function ApiKeysGetStarted({ onCreateApiKey }: ApiKeysGetStartedProps) {
  const steps = [
    {
      icon: <Key className="h-5 w-5" />,
      title: "Generate API Key",
      description: "Create a secure API key with customizable permissions and usage limits.",
      badge: "Secure"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Set Permissions",
      description: "Configure fine-grained access controls for specific models, endpoints, or rate limits.",
      badge: "Granular"
    },
    {
      icon: <TestTube className="h-5 w-5" />,
      title: "Test Authentication",
      description: "Verify your API key works with our interactive playground and testing tools.",
      badge: "Playground"
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Integrate & Deploy",
      description: "Use our SDKs and code examples to integrate your API key into your applications.",
      badge: "SDKs"
    }
  ];

  const benefits = [
    {
      icon: <Lock className="h-6 w-6 text-blue-500" />,
      title: "Secure by Default",
      description: "Enterprise-grade security with automatic key rotation, IP whitelisting, and audit trails."
    },
    {
      icon: <Activity className="h-6 w-6 text-green-500" />,
      title: "Usage Monitoring",
      description: "Real-time analytics, usage tracking, and spending alerts to monitor your API consumption."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Team Management",
      description: "Create separate keys for different team members, environments, or applications with role-based access."
    }
  ];

  return (
    <GetStartedLayout
      title="Create Your First API Key"
      description="Secure access to deploy and manage your AI models"
      hero={{
        badge: "🔑 Secure Authentication",
        title: "Create Your First API Key",
        subtitle: "Generate secure API keys with granular permissions to access your deployments and manage your AI infrastructure.",
        backgroundGradient: "bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10"
      }}
      steps={steps}
      primaryAction={{
        text: "Create API Key",
        href: "#",
        onClick: onCreateApiKey
      }}
      secondaryActions={[
        {
          text: "Authentication Guide",
          href: "/api/docs#authentication",
          external: true
        },
        {
          text: "Code Examples",
          href: "/api/docs#examples",
          external: true
        }
      ]}
      benefits={benefits}
    />
  );
}