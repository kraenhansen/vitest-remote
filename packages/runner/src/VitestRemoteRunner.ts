import { VitestRunner, VitestRunnerConfig, VitestRunnerImportSource, processError } from "@vitest/runner";
import c from "picocolors";

import { VitestRemoteServer } from "vitest-remote-server";

function log(...parts: string[]) {
  const message = [c.dim("🕹️ "), ...parts].join(" ");
  process.stdout.write(message + "\n");
}

export class VitestRemoteRunner implements VitestRunner {
  // TODO: Pass config to the server from end-users
  private server = new VitestRemoteServer({ port: 1337 });

  constructor(public config: VitestRunnerConfig) {}

  async onBeforeCollect() {
    const wss = await this.server.start();
    log(c.inverse(c.bold(" WAITING ")), "Waiting for vitest-remote client to connect", c.dim(`(listening on ${this.server.url})`));
    wss.on("connection", (socket) => {
      log(c.green(c.inverse(c.bold(" READY "))), "Client connected");
      socket.once("close", () => {
        const err = new Error("Client disconnected before tests were done");
        processError(err);
      });
    });
    await this.server.client;
    // TODO: Boot up a sub-process to run
  }

  async importFile(filepath: string, source: VitestRunnerImportSource) {
    console.log("calling importFile", filepath);
    const client = await this.server.client;
    return client.importFile(filepath, source);
  }
}
