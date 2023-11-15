import { createContext, useContext, useMemo, useState, PropsWithChildren } from "react";
import { Test, VitestRunner, VitestRunnerConfig, startTests as vitestStartTests } from "@vitest/runner";

import { MetroRequireContext } from "./types.js";
import { VitestReactNativeRunner } from "./VitestReactNativeRunner.js";

export type VitestRemoteContext = {
  runner: VitestRunner;
  currentTest: Test | undefined;
  testCount: number;
  startTests: () => void;
};

export type VitestRemoteProviderProps = PropsWithChildren<{
  requireContext: MetroRequireContext;
} & Partial<VitestRunnerConfig>>;

const DEFAULT_RUNNER_CONFIG: VitestRunnerConfig = {
  hookTimeout: 5000,
  maxConcurrency: 1,
  root: "React Native",
  setupFiles: [],
  name: "React Native Runner",
  passWithNoTests: false,
  sequence: {
    shuffle: undefined,
    concurrent: undefined,
    seed: 0,
    hooks: "stack",
    setupFiles: "list"
  },
  testTimeout: 0,
  retry: 0
};

export const VitestRemoteContext = createContext<VitestRemoteContext | null>(null);
export function VitestRemoteProvider({ children, requireContext, ...config }: VitestRemoteProviderProps) {
  const [testCount, setTestCount] = useState(0);
  const [currentTest, setCurrentTest] = useState<Test | undefined>(undefined);

  if (requireContext.keys().length === 0) {
    console.warn("<VitestRemoteContext /> was passed a requireContext matching no files");
  }

  const runner = useMemo(() => {
    return new VitestReactNativeRunner({
      hooks: {setTestCount, setCurrentTest},
      requireContext,
      ...DEFAULT_RUNNER_CONFIG,
      ...config
    });
  }, [setTestCount, setCurrentTest]);

  function startTests() {
    vitestStartTests(["whatever"], runner).then(files => {
      console.log("Done", files.map((file) => file.result));
    }, err => {
      console.error(err.stack);
    });
  }

  return <VitestRemoteContext.Provider children={children} value={{ runner, currentTest, testCount, startTests }} />;
}

export const VitestRemoteConsumer = VitestRemoteContext.Consumer;

export function useVitestRemote(): VitestRemoteContext {
  const context = useContext(VitestRemoteContext);
  if (context === null) {
    throw new Error("Missing a wrapping VitestRemoteProvider");
  }
  return context;
}
