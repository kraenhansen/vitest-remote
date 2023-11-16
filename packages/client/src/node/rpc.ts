import { WebSocket } from "ws";
import { PromiseHandle } from "promise-handle";
import { VitestRunner } from "@vitest/runner";

import { VitestRemoteClient, ClientConnection } from "vitest-remote-client/common";
import * as rpc from "vitest-remote-protocol";

// TODO: Consider reusing the `createTransport` from the server package
export function createTransport(socket: WebSocket): rpc.RPCTransport {
  return (onResponse, onRequest) => {
    function send(object: rpc.JsonRpc) {
      const serialized = object.serialize();
      socket.send(serialized);
    }

    function handleRpc(payload: rpc.IParsedObject) {
      if (payload.type === "request") {
        if (onRequest) {
          onRequest(payload);
        } else {
          throw new Error("This RPC transport doesn't expect requests");
        }
      } else {
        onResponse(payload);
      }
    }

    socket.on("message", (data) => {
      try {
        const parsed = rpc.parse(data.toString());
        if (Array.isArray(parsed)) {
          for (const payload of parsed) {
            handleRpc(payload);
          }
        } else {
          handleRpc(parsed);
        }
      } catch (err) {
        send(rpc.error(null, rpc.JsonRpcError.parseError(err)));
      }
    });

    return send;
  };
}

VitestRemoteClient.createRpc = async function createRpc(url: string, runner: VitestRunner): Promise<ClientConnection> {
  const socket = new WebSocket(url);
  const opened = new PromiseHandle();
  socket.once("open", opened.resolve);
  socket.once("error", opened.reject);

  const transport = createTransport(socket);
  const server = rpc.hydrateTransport<rpc.ServerActions, VitestRunner>(transport, runner);
  
  await opened;

  return {
    server,
    close(code?: number, reason?: string) {
      socket.close(code, reason);
    }
  };
};
