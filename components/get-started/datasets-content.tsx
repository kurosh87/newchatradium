'use client';

import { GetStartedLayout } from './base-layout';
import { 
  Upload, 
  CheckCircle, 
  Brain, 
  Rocket,
  FileText,
  Zap,
  Target,
  Shield
} from 'lucide-react';

interface DatasetsGetStartedProps {
  onUploadDataset: () => void;
}

export function DatasetsGetStarted({ onUploadDataset }: DatasetsGetStartedProps) {
  const steps = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Prepare Your Data",
      description: "Format your training data as JSONL, CSV, or text files following our schema guidelines.",
      badge: "Multiple formats"
    },
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Upload Dataset",
      description: "Securely upload your training data with automatic validation and preprocessing.",
      badge: "Auto-validation"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Validate Format",
      description: "Our system automatically checks data quality, format compliance, and suggests optimizations.",
      badge: "Quality checks"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Start Fine-tuning",
      description: "Use your dataset to create custom models tailored to your specific use case and domain.",
      badge: "Custom models"
    }
  ];

  const benefits = [
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Domain Expertise",
      description: "Train models on your specific data to achieve higher accuracy for your unique use cases and business requirements."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Improved Performance",
      description: "Fine-tuned models typically show 20-40% improvement in task-specific performance compared to base models."
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Data Privacy",
      description: "Your training data is encrypted at rest and in transit, with options for private VPC deployment and data residency."
    }
  ];

  return (
    <GetStartedLayout
      title="Upload Your First Dataset"
      description="Prepare training data for custom model fine-tuning"
      hero={{
        badge: "📊 Custom Training Data",
        title: "Upload Your First Dataset",
        subtitle: "Transform your domain-specific data into powerful fine-tuned models that understand your business context and deliver superior results.",
        backgroundGradient: "bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10"
      }}
      steps={steps}
      primaryAction={{
        text: "Upload Dataset",
        href: "#",
        onClick: onUploadDataset
      }}
      secondaryActions={[
        {
          text: "Data Format Guide",
          href: "/api/docs#datasets",
          external: true
        },
        {
          text: "Fine-tuning Examples",
          href: "/deploy/fine-tuning",
        }
      ]}
      benefits={benefits}
    />
  );
}