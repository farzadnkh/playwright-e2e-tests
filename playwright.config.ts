import * as process from 'node:process';
import { config } from '@/utils/config/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  tsconfig: './tsconfig.json',
  globalSetup: require.resolve('./utils/setups/auth.setup.ts'),
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: config.http.base_url,
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TOKEN ?? ''}`,
      mobile_no: config.http.user_phone_number ?? '',
      'grpc-metadata-device-info': config.http.device_meta_data ?? '',
      'api-key': config.http.api_key ?? '',
      client: 'web',
      'grpc-metadata-version': '20000'
    }
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
