import { VitestRunner } from "@vitest/runner";
import { ViteNodeRunner } from "vite-node/client";

import { VitestRemoteRunnerConfig } from "vitest-remote-client/common";

// TODO: Fill in more
(globalThis as any).__vitest_worker__ = {
  config: {},
  environment: {
    name: "remote"
  }
};

export class VitestRemoteNodeRunner implements VitestRunner {
  private viteRunner = new ViteNodeRunner({
    root: "/",
    fetchModule: (id) => {
      return this.config.client.server.fetchModule(id);
    },
    resolveId: (id, importer) => {
      return this.config.client.server.resolveId(id, importer);
    }
    // TODO: Consider reusing this on other platforms, by extending runModule
  });

  constructor(public config: VitestRemoteRunnerConfig) {}

  async importFile(filepath: string) {
    await this.viteRunner.executeFile(filepath);
  }
}
