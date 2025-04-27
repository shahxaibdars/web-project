import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*', 'coverage/**/*.*'],
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      codeCoverageTask(on, config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
}); 