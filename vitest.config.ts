import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'clarinet',
    globals: true,
    testTimeout: 30000,
    environmentOptions: {
      clarinet: {
        manifestPath: resolve(__dirname, 'Clarinet.toml'),
        coverage: false,
        costs: false,
      },
    },
  },
});
