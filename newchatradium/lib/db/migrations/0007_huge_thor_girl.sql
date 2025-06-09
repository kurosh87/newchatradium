CREATE TABLE IF NOT EXISTS "ApiKeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"keyHash" varchar(255) NOT NULL,
	"keyPrefix" varchar(20) NOT NULL,
	"lastUsedAt" timestamp,
	"totalUsage" integer DEFAULT 0,
	"status" varchar DEFAULT 'active',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "BillingAccounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"paymentMethodId" varchar(255),
	"spendingLimit" numeric(10, 2) DEFAULT '50.00',
	"currentSpend" numeric(10, 2) DEFAULT '0',
	"billingTier" varchar(20) DEFAULT 'tier1',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Datasets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"filePath" varchar(255),
	"format" varchar NOT NULL,
	"sizeBytes" bigint,
	"exampleCount" integer,
	"status" varchar DEFAULT 'processing',
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"modelId" varchar(255) NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"endpointUrl" varchar(255),
	"configuration" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastActiveAt" timestamp,
	"totalRequests" integer DEFAULT 0,
	"totalCost" numeric(10, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FineTuningJobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"baseModel" varchar(255) NOT NULL,
	"datasetId" uuid NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0,
	"estimatedCompletion" timestamp,
	"cost" numeric(10, 2) DEFAULT '0',
	"configuration" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Models" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"category" varchar(100),
	"description" text,
	"inputPrice" numeric(6, 3),
	"outputPrice" numeric(6, 3),
	"contextLength" varchar(20),
	"capabilities" json,
	"performance" json,
	"gpuRequirements" json,
	"featured" boolean DEFAULT false,
	"active" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Quotas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"quotaId" varchar(255) NOT NULL,
	"value" integer DEFAULT 0,
	"maxValue" integer NOT NULL,
	"region" varchar(50),
	"resourceType" varchar(50),
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UsageMetrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deploymentId" uuid,
	"apiKeyId" uuid,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"requestCount" integer DEFAULT 0,
	"tokenCount" integer DEFAULT 0,
	"inputTokens" integer DEFAULT 0,
	"outputTokens" integer DEFAULT 0,
	"cost" numeric(8, 4) DEFAULT '0',
	"latencyMs" integer,
	"status" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ApiKeys" ADD CONSTRAINT "ApiKeys_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "BillingAccounts" ADD CONSTRAINT "BillingAccounts_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Datasets" ADD CONSTRAINT "Datasets_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Deployments" ADD CONSTRAINT "Deployments_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Deployments" ADD CONSTRAINT "Deployments_modelId_Models_id_fk" FOREIGN KEY ("modelId") REFERENCES "public"."Models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FineTuningJobs" ADD CONSTRAINT "FineTuningJobs_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FineTuningJobs" ADD CONSTRAINT "FineTuningJobs_datasetId_Datasets_id_fk" FOREIGN KEY ("datasetId") REFERENCES "public"."Datasets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Quotas" ADD CONSTRAINT "Quotas_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UsageMetrics" ADD CONSTRAINT "UsageMetrics_deploymentId_Deployments_id_fk" FOREIGN KEY ("deploymentId") REFERENCES "public"."Deployments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UsageMetrics" ADD CONSTRAINT "UsageMetrics_apiKeyId_ApiKeys_id_fk" FOREIGN KEY ("apiKeyId") REFERENCES "public"."ApiKeys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
