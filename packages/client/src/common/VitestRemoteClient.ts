import { VitestRunner, VitestRunnerConfig } from "@vitest/runner";

import { VitestRemoteRunnerConstructor } from "./types.js";
import { ServerActions } from "vitest-remote-protocol";

export type VitestRemoteClientConfig = {
  url: string;
};

export type ClientConnection = {
  server: ServerActions;
  close(): void;
};

const DEFAULT_RUNNER_CONFIG: VitestRunnerConfig = {
  hookTimeout: 5000,
  maxConcurrency: 1,
  root: "Vitest Remote",
  setupFiles: [],
  name: "Vitest Remote Runner",
  passWithNoTests: false,
  sequence: {
    shuffle: undefined,
    concurrent: undefined,
    seed: 0,
    hooks: "stack",
    setupFiles: "list"
  },
  testTimeout: 0,
  retry: 0
};

export class VitestRemoteClient {

  static createRpc: (url: string, runner: VitestRunner) => Promise<ClientConnection>;
  static Runner: VitestRemoteRunnerConstructor;

  private connection: ClientConnection | null = null;
  private runner: VitestRunner | null = null;

  constructor(private config: VitestRemoteClientConfig) {}

  async connect() {
    this.runner = new VitestRemoteClient.Runner({ ...DEFAULT_RUNNER_CONFIG, client: this });
    this.connection = await VitestRemoteClient.createRpc(this.config.url, this.runner);
  }

  get server() {
    if (this.connection) {
      return this.connection.server;
    } else {
      throw new Error("Not connected");
    }
  }
}
