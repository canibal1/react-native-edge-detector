import { NativeModules, Platform, DeviceEventEmitter } from 'react-native';

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
  saveTo: string,
  scanTitle: string,
  cropTitle: string,
  cropBlackWhiteTitle: string,
  cropResetTitle: string
): Promise<boolean> {
  if (Platform.OS === 'ios') {
    try {
      // Create a promise to wrap the event listener
      const scanSuccessPromise = new Promise<boolean>((resolve) => {
        const eventListener = (event: any) => {
          console.log('Scan success:', event.data);
          // Remove the event listener once it's triggered
          DeviceEventEmitter.removeAllListeners();
          resolve(event.data); // Resolve the promise with the event data
        };

        // Add the event listener
        DeviceEventEmitter.addListener('onScanSuccess', eventListener);
      });

      // Trigger the native method
      await EdgeDetector.openEdgeDetector(
        saveTo,
        scanTitle,
        cropTitle,
        cropBlackWhiteTitle,
        cropResetTitle
      );

      // Wait for the promise to be resolved
      const result = await scanSuccessPromise;

      return result; // Return the result obtained from the event
    } catch (error) {
      console.error('Error opening Edge Detector on iOS:', error);
      return false;
    }
  } else if (Platform.OS === 'android') {
    // Android-specific code
    try {
      const eventData = await EdgeDetector.openEdgeDetector(
        saveTo,
        scanTitle,
        cropTitle,
        cropBlackWhiteTitle,
        cropResetTitle
      );
      return eventData; // Assuming eventData is a boolean indicating success
    } catch (error) {
      console.error('Error opening Edge Detector on Android:', error);
      return false;
    }
  } else {
    console.error('Unsupported platform');
    return false;
  }
}
