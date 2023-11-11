import type { CancelReason, VitestRunner, VitestRunnerConfig, VitestRunnerImportSource, File, Test, TaskResultPack, Suite, TestContext } from "@vitest/runner";

export default class VitestReactNativeRunner implements VitestRunner {
  constructor(public config: VitestRunnerConfig) {
    
  }
  onBeforeCollect?(paths: string[]): unknown {
    throw new Error("Method not implemented.");
  }
  onCollected?(files: File[]): unknown {
    throw new Error("Method not implemented.");
  }
  onCancel?(reason: CancelReason): unknown {
    throw new Error("Method not implemented.");
  }
  onBeforeRunTest?(test: Test<{}>): unknown {
    throw new Error("Method not implemented.");
  }
  onBeforeTryTest?(test: Test<{}>, options: { retry: number; repeats: number; }): unknown {
    throw new Error("Method not implemented.");
  }
  onAfterRunTest?(test: Test<{}>): unknown {
    throw new Error("Method not implemented.");
  }
  onAfterTryTest?(test: Test<{}>, options: { retry: number; repeats: number; }): unknown {
    throw new Error("Method not implemented.");
  }
  onBeforeRunSuite?(suite: Suite): unknown {
    throw new Error("Method not implemented.");
  }
  onAfterRunSuite?(suite: Suite): unknown {
    throw new Error("Method not implemented.");
  }
  runSuite?(suite: Suite): Promise<void> {
    throw new Error("Method not implemented.");
  }
  runTest?(test: Test<{}>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onTaskUpdate?(task: TaskResultPack[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onBeforeRun?(files: File[]): unknown {
    throw new Error("Method not implemented.");
  }
  onAfterRun?(files: File[]): unknown {
    throw new Error("Method not implemented.");
  }
  extendTestContext?(context: TestContext): TestContext {
    throw new Error("Method not implemented.");
  }
  importFile(filepath: string, source: VitestRunnerImportSource): unknown {
    throw new Error("Method not implemented.");
  }

}
