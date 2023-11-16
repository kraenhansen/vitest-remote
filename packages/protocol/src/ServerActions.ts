import type { ViteNodeServer } from "vite-node/server";

export type ServerActions = Pick<ViteNodeServer, "fetchModule" | "resolveId">;
