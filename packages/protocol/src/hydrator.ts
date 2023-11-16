
import { PromiseHandle } from "promise-handle";
import * as rpc from "./json-rpc.js";

function isIndexable(value: unknown): asserts value is Record<string, unknown> {
  if (typeof value !== "object") {
    throw new Error("Isn't an indexable object")
  }
}

export function wrapReceiver<Receiver extends object>(receiver: Receiver): rpc.RPCRequestHandler {
  isIndexable(receiver);
  return ({ payload }) => {
    console.log(`Got request ${JSON.stringify(payload)}`);
    const { method, params = [] } = payload;
    const member = receiver[method];
    if (typeof member === "function") {
      if (Array.isArray(params)) {
        return member.call(receiver, ...params);
      } else {
        throw new Error("Expected params to be an array");
      }
    } else {
      throw new Error(`Expected receiver to have a ${member} method`);
    }
  };
}

function methodNames(thing: { prototype: unknown }) {
  return Object.keys(Object.getOwnPropertyDescriptors(thing.prototype));
}

/**
 * A set of method names that shouldn't be captured as RPC methods
 */
const RESERVED_METHOD_NAMES = new Set([
  ...methodNames(Promise),
  ...methodNames(Object),
]);

export function hydrateTransport<Sender extends object, Receiver extends object>(transport: rpc.RPCTransport, receiver: Receiver): Sender {
  const requests = new Map<string, PromiseHandle<unknown>>();
  const wrappedReceiver = wrapReceiver(receiver);
  const send = transport((response) => {
    const id = response.type !== "notification" && response.type !== "invalid" ? response.payload.id : null;
    if (typeof id === "string") {
      console.log(`Got response (id = ${id})`);
      const handle = requests.get(id);
      requests.delete(id);
      if (handle) {
        if (response.type === "success") {
          handle.resolve(response.payload.result);
        } else if (response.type === "error") {
          handle.reject(new Error(response.payload.error.message));
        } else {
          throw new Error(`Unsupported RPC response (type = ${response.type})`)
        }
      } else {
        throw new Error("Got response for an unexpected id");
      }
    }
  }, async (request) => {
    try {
      // Send back the result
      const result = await wrappedReceiver(request);
      // Not allowed to send undefined as result
      const rpcResult = typeof result === "undefined" ? { $undefined: true } : result;
      send(rpc.success(request.payload.id, rpcResult));
    } catch (err) {
      console.error(`Got error while executing request (id = ${request.payload.id})`, err);
      send(rpc.error(request.payload.id, { message: err instanceof Error ? err.message : `${err}`, code: -32000 }));
    }
  });
  return new Proxy({}, {
    get(target, prop) {
      if (typeof prop === "string" && !RESERVED_METHOD_NAMES.has(prop)) {
        return function(...params: unknown[]) {
          // TODO: Consider using a uuid instead
          const id = Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString();
          const handle = new PromiseHandle();
          requests.set(id, handle);
          const request = rpc.request(id, prop, params);
          console.log(`Sending request (${JSON.stringify(request)})`);
          send(request);
          return handle;
        }
      }
    }
  }) as Sender;
}
