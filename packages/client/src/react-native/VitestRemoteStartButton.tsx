import React from "react";
import { Button } from "react-native";

import { useVitestRemote } from "./VitestRemoteContext.js";

export function VitestRemoteStartButton() {
  const { startTests } = useVitestRemote();
  return (
    <>
      <Button title="Run tests" onPress={startTests} />
    </>
  );
}
