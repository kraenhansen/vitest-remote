import { Test, VitestRunner, VitestRunnerConfig, File, Task } from "@vitest/runner";

import { MetroRequireContext } from "./types.js";

export type VitestReactNativeRunnerHooks = {
  setTestCount(count: number): void;
  setCurrentTest(test: Test): void;
};

export type VitestReactNativeRunnerConfig = VitestRunnerConfig & {
  hooks: VitestReactNativeRunnerHooks;
  requireContext: MetroRequireContext;
};

export class VitestReactNativeRunner implements VitestRunner {
  constructor(public config: VitestReactNativeRunnerConfig) {}

  async onBeforeCollect() {
    console.log("onBeforeCollect called");
  }

  onCollected(files: File[]) {
    console.log("onCollected called", files);
    const testCount = this.collectTestCount(files.flatMap(file => file.tasks));
    console.log("testCount", testCount);
    this.config.hooks.setTestCount(testCount);
  }

  onBeforeRunTest(test: Test) {
    console.log("onBeforeRunTest called");
    this.config.hooks.setCurrentTest(test);
  }

  importFile(filepath: string) {
    console.log("importFile called", {filepath}, this.config.requireContext.keys());
    if (!this.config.requireContext.keys().includes(filepath)) {
      throw new Error(`The require.context didn't match a file being imported: ${filepath}`);
    }
    return this.config.requireContext(filepath);
  }

  private collectTestCount(tasks: Task[]): number {
    return tasks.reduce((sum: number, task: Task) => {
      if (task.type === "test") {
        return sum + 1;
      } else if (task.type === "suite") {
        return sum + this.collectTestCount(task.tasks);
      } else {
        return sum;
      }
    }, 0);
  }
}