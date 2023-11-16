import { WebSocket } from "ws";
import * as rpc from "vitest-remote-protocol";

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
