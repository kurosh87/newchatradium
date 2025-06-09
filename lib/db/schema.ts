import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
  decimal,
  bigint,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable('Message_v2', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  'Vote_v2',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'Stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chatId: uuid('chatId').notNull(),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  }),
);

export type Stream = InferSelectModel<typeof stream>;

// Deployment Platform Tables

export const models = pgTable('Models', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 100 }).notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  inputPrice: decimal('inputPrice', { precision: 6, scale: 3 }),
  outputPrice: decimal('outputPrice', { precision: 6, scale: 3 }),
  contextLength: varchar('contextLength', { length: 20 }),
  capabilities: json('capabilities'),
  performance: json('performance'),
  gpuRequirements: json('gpuRequirements'),
  featured: boolean('featured').default(false),
  active: boolean('active').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type Model = InferSelectModel<typeof models>;

export const deployments = pgTable('Deployments', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  modelId: varchar('modelId', { length: 255 })
    .notNull()
    .references(() => models.id),
  status: varchar('status', { 
    enum: ['pending', 'deploying', 'active', 'failed', 'stopped'] 
  }).notNull().default('pending'),
  endpointUrl: varchar('endpointUrl', { length: 255 }),
  configuration: json('configuration'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  lastActiveAt: timestamp('lastActiveAt'),
  totalRequests: integer('totalRequests').default(0),
  totalCost: decimal('totalCost', { precision: 10, scale: 2 }).default('0'),
});

export type Deployment = InferSelectModel<typeof deployments>;

export const apiKeys = pgTable('ApiKeys', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  keyHash: varchar('keyHash', { length: 255 }).notNull(),
  keyPrefix: varchar('keyPrefix', { length: 20 }).notNull(),
  lastUsedAt: timestamp('lastUsedAt'),
  totalUsage: integer('totalUsage').default(0),
  status: varchar('status', { enum: ['active', 'revoked'] }).default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type ApiKey = InferSelectModel<typeof apiKeys>;

export const usageMetrics = pgTable('UsageMetrics', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  deploymentId: uuid('deploymentId')
    .references(() => deployments.id),
  apiKeyId: uuid('apiKeyId')
    .references(() => apiKeys.id),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  requestCount: integer('requestCount').default(0),
  tokenCount: integer('tokenCount').default(0),
  inputTokens: integer('inputTokens').default(0),
  outputTokens: integer('outputTokens').default(0),
  cost: decimal('cost', { precision: 8, scale: 4 }).default('0'),
  latencyMs: integer('latencyMs'),
  status: varchar('status', { enum: ['success', 'error'] }).notNull(),
});

export type UsageMetric = InferSelectModel<typeof usageMetrics>;

export const datasets = pgTable('Datasets', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  filePath: varchar('filePath', { length: 255 }),
  format: varchar('format', { enum: ['JSONL', 'CSV', 'TSV'] }).notNull(),
  sizeBytes: bigint('sizeBytes', { mode: 'number' }),
  exampleCount: integer('exampleCount'),
  status: varchar('status', { enum: ['processing', 'ready', 'error'] }).default('processing'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type Dataset = InferSelectModel<typeof datasets>;

export const fineTuningJobs = pgTable('FineTuningJobs', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  baseModel: varchar('baseModel', { length: 255 }).notNull(),
  datasetId: uuid('datasetId')
    .notNull()
    .references(() => datasets.id),
  status: varchar('status', { 
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] 
  }).notNull().default('pending'),
  progress: integer('progress').default(0),
  estimatedCompletion: timestamp('estimatedCompletion'),
  cost: decimal('cost', { precision: 10, scale: 2 }).default('0'),
  configuration: json('configuration'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  completedAt: timestamp('completedAt'),
});

export type FineTuningJob = InferSelectModel<typeof fineTuningJobs>;

export const billingAccounts = pgTable('BillingAccounts', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  paymentMethodId: varchar('paymentMethodId', { length: 255 }),
  spendingLimit: decimal('spendingLimit', { precision: 10, scale: 2 }).default('50.00'),
  currentSpend: decimal('currentSpend', { precision: 10, scale: 2 }).default('0'),
  billingTier: varchar('billingTier', { length: 20 }).default('tier1'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type BillingAccount = InferSelectModel<typeof billingAccounts>;

export const quotas = pgTable('Quotas', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  quotaId: varchar('quotaId', { length: 255 }).notNull(),
  value: integer('value').default(0),
  maxValue: integer('maxValue').notNull(),
  region: varchar('region', { length: 50 }),
  resourceType: varchar('resourceType', { length: 50 }),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Quota = InferSelectModel<typeof quotas>;
