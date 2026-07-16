const REQUIRED_ENV_VARS = [
  "PORT",
  "DATABASE_URL",
  "SUPABASE_PROJECT_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:");
    missing.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }
};