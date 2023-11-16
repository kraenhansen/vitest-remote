import { WebSocket, WebSocketServer } from "ws";
import { PromiseHandle } from "promise-handle";
import { ClientActions, ServerActions, hydrateTransport } from "vitest-remote-protocol";
import { ViteNodeServer } from "vite-node/server";
import { createServer, ViteDevServer } from "vite";

import { createTransport } from "./RPCWebSocketTransport.js";

export type VitestRemoteServerConfig = {
  host?: string;
  port?: number;
};

export class VitestRemoteServer {
  /**
   * Get the currently connected client.
   */
  public client: PromiseHandle<ClientActions> = new PromiseHandle();
  
  private server: WebSocketServer | null = null;
  private socket: WebSocket | null = null;
  private vite: ViteDevServer | null = null;
  private viteNode: ViteNodeServer | null = null;

  private actions: ServerActions = {
    fetchModule: (id, transformMode) => {
      if (this.viteNode) {
        return this.viteNode.fetchModule(id, transformMode);
      } else {
        throw new Error("fetchModule called before vite-node was started");
      }
    },
    resolveId: (id, importer, transformMode)  => {
      if (this.viteNode) {
        return this.viteNode.resolveId(id, importer, transformMode);
      } else {
        throw new Error("resolveId called before vite-node was started");
      }
    },
  };

  constructor(private config: VitestRemoteServerConfig = { port: 0 }) {}

  async start() {
    this.vite = await createServer({
      optimizeDeps: {
        // It's recommended to disable deps optimization
        disabled: true,
      },
    });
    this.viteNode = new ViteNodeServer(this.vite);

    const listening = new PromiseHandle<void>();
    this.server = new WebSocketServer({
      host: this.config.host,
      port: this.config.port,
      verifyClient: () => {
        // Ensures only a single client is connected at a time
        if (this.socket) {
          return false;
        } else {
          return true;
        }
      }
    }, listening.resolve);
    // Store new connections as the active socket
    this.server.on("connection", (socket) => {
      this.socket = socket;
      socket.once("close", () => {
        // Reset the promise handle, to make room for the next client
        this.client = new PromiseHandle();
        this.socket = null;
      });
      const transport = createTransport(socket);
      const client = hydrateTransport<ClientActions, ServerActions>(transport, this.actions);
      this.client.resolve(client);
    });
    // The server has started when it's listening
    await listening;
    return this.server;
  }

  get url() {
    if (this.server) {
      const address = this.server.address();
      if (typeof address === "string") {
        return address;
      } else if (address.family === "IPv6") {
        return `ws://[${address.address}]:${address.port}`;
      } else if (address.family === "IPv4") {
        return `ws://${address.address}:${address.port}`;
      } else {
        throw new Error(`Unexpected family ${address.family}`);
      }
    }
  }
}
