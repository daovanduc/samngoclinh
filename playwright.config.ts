import { defineConfig } from '@playwright/test';
import path from 'node:path';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(process.cwd(), '.playwright-browsers');

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4321', browserName: 'chromium' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
