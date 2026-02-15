import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ANALYTICS_SECRET: z.string().min(32),
  CRON_SECRET: z.string().min(1),
  SUBSCRIBER_SECRET: z.string().min(32),
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  VERCEL_API_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  VERCEL_TEAM_ID: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  ANALYTICS_SETUP_ENABLED: z.string().optional(),
  GITHUB_TOKEN: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Missing required environment variables");
  }
  _env = parsed.data;
  return _env;
}
