export * from "vitest-remote-client/common";
export * from  "./rpc.js";

import { VitestRemoteClient } from "vitest-remote-client/common";
import { VitestRemoteNodeRunner } from "./VitestRemoteNodeRunner.js";

VitestRemoteClient.Runner = VitestRemoteNodeRunner;
