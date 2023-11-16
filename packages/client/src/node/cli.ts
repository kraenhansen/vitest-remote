import { cac } from "cac";
import { VitestRemoteClient } from "vitest-remote-client/common";

import "./index.js";

const cli = cac("vitest-remote");

cli
  .command('[url]', 'Connect to server')
  .allowUnknownOptions()
  .action(connect)


export type ConnectOptions = {
  url?: string;
};

async function connect(url = "ws://localhost:1337") {
  console.log(`Connecting vitest-remote-client to`, url);
  const client = new VitestRemoteClient({ url });
  await client.connect();
}

export function run(argv = process.argv) {
  cli.parse(argv);
}
