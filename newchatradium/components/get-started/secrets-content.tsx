'use client';

import { GetStartedLayout } from './base-layout';
import { 
  Lock, 
  Settings, 
  Eye, 
  Rocket,
  Shield,
  Key,
  GitBranch,
  Zap
} from 'lucide-react';

interface SecretsGetStartedProps {
  onCreateSecret: () => void;
}

export function SecretsGetStarted({ onCreateSecret }: SecretsGetStartedProps) {
  const steps = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Add Secret",
      description: "Store API keys, database URLs, and other sensitive configuration securely encrypted.",
      badge: "Encrypted"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Configure Access",
      description: "Set granular permissions for which deployments and team members can access each secret.",
      badge: "Granular"
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Use in Deployments",
      description: "Reference secrets in your model deployments as environment variables without exposing values.",
      badge: "Secure injection"
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Monitor Usage",
      description: "Track secret access patterns and get alerts for unauthorized usage or potential breaches.",
      badge: "Audit trail"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Enterprise Security",
      description: "Military-grade AES-256 encryption with hardware security modules (HSM) and zero-knowledge architecture."
    },
    {
      icon: <GitBranch className="h-6 w-6 text-blue-500" />,
      title: "Environment Isolation",
      description: "Separate secrets for development, staging, and production with automatic environment-specific injection."
    },
    {
      icon: <Key className="h-6 w-6 text-purple-500" />,
      title: "Centralized Management",
      description: "Manage all your secrets in one place with versioning, rotation policies, and team access controls."
    }
  ];

  return (
    <GetStartedLayout
      title="Secure Your Environment Variables"
      description="Store and manage sensitive configuration securely"
      hero={{
        badge: "🔒 Enterprise Security",
        title: "Secure Your Environment Variables",
        subtitle: "Keep API keys, database credentials, and other sensitive data encrypted and safely accessible to your deployments.",
        backgroundGradient: "bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10"
      }}
      steps={steps}
      primaryAction={{
        text: "Add First Secret",
        href: "#",
        onClick: onCreateSecret
      }}
      secondaryActions={[
        {
          text: "Security Guide",
          href: "/api/docs#secrets",
          external: true
        },
        {
          text: "Environment Setup",
          href: "/deploy/settings",
        }
      ]}
      benefits={benefits}
    />
  );
}