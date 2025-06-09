'use client';

import { GetStartedLayout } from './base-layout';
import { 
  Brain, 
  Settings, 
  Rocket, 
  TestTube,
  Zap,
  Shield,
  Globe,
  DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeploymentsGetStarted() {
  const router = useRouter();

  const steps = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Choose Your Model",
      description: "Select from our catalog of cutting-edge AI models including GPT, Claude, Llama, and more.",
      badge: "1000+ models"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Configure Resources",
      description: "Set up GPU requirements, scaling rules, and performance optimizations for your use case.",
      badge: "Auto-scaling"
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Deploy Instantly",
      description: "Launch your model with a single click. We handle the infrastructure, monitoring, and scaling.",
      badge: "< 2 minutes"
    },
    {
      icon: <TestTube className="h-5 w-5" />,
      title: "Test & Integrate",
      description: "Use our playground to test your deployment, then integrate with our REST API or SDKs.",
      badge: "REST API"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Lightning Fast",
      description: "Deploy in under 2 minutes with automatic optimization and global edge distribution for minimal latency."
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant infrastructure with end-to-end encryption, private VPCs, and audit logging."
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Global Scale",
      description: "Auto-scale from zero to millions of requests across 15+ regions with 99.9% uptime SLA."
    }
  ];

  const handleStartDeployment = () => {
    router.push('/deploy/new');
  };

  return (
    <GetStartedLayout
      title="Deploy Your First AI Model"
      description="Get your AI model running in production in minutes"
      hero={{
        badge: "🚀 Deploy in < 2 minutes",
        title: "Deploy Your First AI Model",
        subtitle: "Transform any AI model into a production-ready API with automatic scaling, monitoring, and global distribution.",
        backgroundGradient: "bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10"
      }}
      steps={steps}
      primaryAction={{
        text: "Deploy Your First Model",
        href: "/deploy/new",
        onClick: handleStartDeployment
      }}
      secondaryActions={[
        {
          text: "Browse Models",
          href: "/deploy/models"
        },
        {
          text: "View Documentation",
          href: "/api/docs",
          external: true
        }
      ]}
      benefits={benefits}
    />
  );
}