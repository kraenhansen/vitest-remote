import { IParsedObjectRequest, IParsedObjectSuccess, IParsedObjectError, IParsedObjectNotification, IParsedObjectInvalid, JsonRpc } from "jsonrpc-lite";

export * from "jsonrpc-lite";

export type RPCRequest = IParsedObjectRequest;
export type RPCResponse = IParsedObjectSuccess | IParsedObjectError | IParsedObjectNotification | IParsedObjectInvalid;

export type RPCError = {
  code: number;
  message: string;
  data?: unknown;
};

export type RPCResponseHandler = (response: RPCResponse) => void;
export type RPCRequestHandler = (request: RPCRequest) => unknown;
export type RPCSender = (message: JsonRpc) => void;
export type RPCTransport = (onResponse: RPCResponseHandler, onRequest?: RPCRequestHandler) => RPCSender;
