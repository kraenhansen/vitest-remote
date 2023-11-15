import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    runner: "vitest-remote-runner",
  },
});
