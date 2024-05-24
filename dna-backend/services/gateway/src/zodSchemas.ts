import z from 'zod';

const NODE_ENV = ['production', 'development'] as const;
const DEFAULT_NODE_ENV: (typeof NODE_ENV)[number] = 'production';

const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_API_PORT = '3000';

const DEFAULT_ADVISOR_PORT = 3001;
const DEFAULT_ADVISOR_VERSION = 1;

export const envSchema = z.object({
  NODE_ENV: z.enum(NODE_ENV).default(DEFAULT_NODE_ENV),
  HOST: z.string().url().or(z.string().ip()).default(DEFAULT_HOST),
  GATEWAY_PORT: z
    .string()
    .default(DEFAULT_API_PORT)
    .transform(port => parseInt(port, 10)),
  ADVISOR_HOST: z.string().url().default(`http://${DEFAULT_HOST}`),
  ADVISOR_PORT: z.number({ coerce: true }).default(DEFAULT_ADVISOR_PORT),
  ADVISOR_VERSION: z
    .number({ coerce: true })
    .positive()
    .int()
    .default(DEFAULT_ADVISOR_VERSION),
});
