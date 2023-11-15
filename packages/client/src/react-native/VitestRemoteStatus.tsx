import React from "react";
import { Text } from "react-native";

import { useVitestRemote } from "./VitestRemoteContext.js";

export function VitestRemoteStatus() {
  const { currentTest, testCount } = useVitestRemote();
  return (
    <>
      <Text>{currentTest ? currentTest.name : "No test"}</Text>
      <Text>{testCount} tests collected</Text>
    </>
  );
}
