import { VitestRunner, VitestRunnerConfig } from "@vitest/runner";

import { VitestRemoteClient } from "./VitestRemoteClient.js";

export type VitestRemoteRunnerConfig = VitestRunnerConfig & {
  client: VitestRemoteClient;
};

export type VitestRemoteRunnerConstructor = {
  new (config: VitestRemoteRunnerConfig): VitestRunner;
}
