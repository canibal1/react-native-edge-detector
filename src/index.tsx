import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-edge-detector' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const EdgeDetector = NativeModules.EdgeDetector
  ? NativeModules.EdgeDetector
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export async function openEdgeDetector(saveTo: string,
  scanTitle: string,
  cropTitle: string,
  cropBlackWhiteTitle: string,
  cropResetTitle: string): Promise<boolean> {
  return Platform.OS === "ios" ?
   await EdgeDetector.openEdgeDetector(saveTo)
    : await EdgeDetector.openEdgeDetector(
      saveTo,
      scanTitle,
      cropTitle,
      cropBlackWhiteTitle,
      cropResetTitle);
}
