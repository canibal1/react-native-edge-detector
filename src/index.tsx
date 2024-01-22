import { NativeModules, Platform, DeviceEventEmitter } from 'react-native';
import RNFS from 'react-native-fs';

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

export async function openEdgeDetector(
 
  scanTitle: string,
  cropTitle: string,
  cropBlackWhiteTitle: string,
  cropResetTitle: string
): Promise<string|undefined> {
  if (Platform.OS === 'ios') {
    try {
      // Create a promise to wrap the event listener
      const scanSuccessPromise = new Promise<string>((resolve) => {
        const eventListener = (event: any) => {
          // Remove the event listener once it's triggered
          DeviceEventEmitter.removeAllListeners();
          resolve(event.data); // Resolve the promise with the event data
        };

        // Add the event listener
        DeviceEventEmitter.addListener('onScanSuccess', eventListener);
      });

      // Trigger the native method
      await EdgeDetector.openEdgeDetector();

      // Wait for the promise to be resolved
      const result = await scanSuccessPromise;

      return result; // Return the result obtained from the event
    } catch (error) {
      console.error('Error opening Edge Detector on iOS:', error);
      return undefined;
    }
  } else if (Platform.OS === 'android') {
    // Android-specific code
    try {

    const dest = `${RNFS.TemporaryDirectoryPath}/` + "file-to-e23o3pe" + Date.now().toString() + ".jpeg";
      const eventData = await EdgeDetector.openEdgeDetector(
        dest,
        scanTitle,
        cropTitle,
        cropBlackWhiteTitle,
        cropResetTitle
      );

      if (eventData == true) {

        const data = await RNFS.readFile(dest, 'base64')

        return data;
      }

    } catch (error) {
      console.error('Error opening Edge Detector on Android:', error);
      return undefined;
    }
  } else {
    console.error('Unsupported platform');
    return undefined;
  }
  return undefined;
}
