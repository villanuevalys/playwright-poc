const DEFAULT_ENV: Record<string, string> = {
  // Public SauceDemo test accounts used by this framework.
  SAUCE_STANDARD_USERNAME: 'standard_user',
  SAUCE_LOCKED_OUT_USERNAME: 'locked_out_user',
  SAUCE_PERFORMANCE_USERNAME: 'performance_glitch_user',
  SAUCE_PROBLEM_USERNAME: 'problem_user',
  SAUCE_INVALID_USERNAME: 'invalid_user',
  SAUCE_PASSWORD: 'secret_sauce',
  SAUCE_WRONG_PASSWORD: 'wrong_password',
};

export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  const fallback = DEFAULT_ENV[name];

  if (fallback) {
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${name}`);
}
