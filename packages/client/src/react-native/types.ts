/**
 * Returned from `require.context` provided by Metro.
 */
export type MetroRequireContext = {
  (name: string): unknown;
  keys(): string[];
};
