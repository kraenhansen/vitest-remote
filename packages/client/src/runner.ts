import { VitestRunner } from "@vitest/runner";

declare class Runner<R extends VitestRunner = VitestRunner> {
  new(): R;
}

export default Runner;
