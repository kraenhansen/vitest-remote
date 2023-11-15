import { StyleSheet, View } from 'react-native';
import { VitestRemoteProvider, VitestRemoteStatus, VitestRemoteStartButton, MetroRequireContext } from "vitest-remote-client";

type ReactNativeRequire = {
  (id: string): unknown;
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
    mode?: 'sync' | 'lazy'
  ): MetroRequireContext;
};

declare const require: ReactNativeRequire;

export default function App() {

  return (
    <VitestRemoteProvider requireContext={require.context(".", true, /.*test.*/)}>
      <View style={styles.container}>
        <VitestRemoteStatus />
        <VitestRemoteStartButton />
      </View>
    </VitestRemoteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
