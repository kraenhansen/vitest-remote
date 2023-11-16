import { VitestRunner } from "@vitest/runner";

/**
 * Type modifier that transforms an object type's methods to return Promises.
 * Takes an object type `T` as input, and produces a type with the same
 * member functions and arguments, but where all functions' return
 * types are wrapped in a Promise.
 *
 * @typeparam T - Original object type with methods to be transformed.
 *
 * @example
 * ```typescript
 * type OriginalType = {
 *   getResult: () => number,
 *   getMessage: (id: string) => string,
 * };
 *
 * type AsyncType = Asyncify<OriginalType>;
 *
 * // Now, both methods in AsyncType return a Promise:
 * // - getResult: () => Promise<number>
 * // - getMessage: (id: string) => Promise<string>
 * ```
 *
 * This type works by using mapped types and conditional types in TypeScript.
 * For each property K in type T, it checks if that property is a function type (T[K] extends (...args: infer A) => infer R).
 * If it is, it transforms that function type to return a Promise<R> instead, where R is the return type of the original function.
 * If it's not a function, it's left as-is.
 */
type Asyncify<T extends object> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T[K];
}

export type ClientActions = Asyncify<Required<Omit<VitestRunner, "config">>>;
