import { VitestRunner, VitestRunnerConfig, VitestRunnerImportSource, File, describe, it, getCurrentSuite } from "@vitest/runner";

export default class VitestRemoteRunner implements VitestRunner {
  constructor(public config: VitestRunnerConfig) {}

  async onBeforeCollect(paths: string[]) {
    console.log("onBeforeCollect", {paths});
  }

  async importFile(filepath: string, source: VitestRunnerImportSource) {
    if (source === "setup") {
      throw new Error("Not yet supported");
    }
    console.log("getCurrentSuite before", getCurrentSuite());
    describe("yo", () => {
      console.log("!!");
      it("works", () => {});
    });
    const after = getCurrentSuite();
    console.log("getCurrentSuite after", after);
  }

  async onBeforeRunFiles(files: File[]) {
    console.log("onBeforeRunFiles", files);
  }
}
