import * as React from 'react';
import { useEffect, useState } from 'react';

import { StyleSheet, View, Text, Button, Image } from 'react-native';
import { openEdgeDetector } from 'react-native-edge-detector';

import RNFS from 'react-native-fs';
export default function App() {

  const [image, setImage] = useState<string>();



  useEffect(() => {
    console.log(image);

  }, [image])
  const openDetector = React.useCallback(async () => {

    const dest = `${RNFS.TemporaryDirectoryPath}/` + "file-to-e23o3pe" + Date.now().toString() + ".jpeg";
    const isSuccess = await openEdgeDetector(
      dest,
      "Scanning",
      "Crop",
      "Black White",
      "Reset")

    //  const base64String = await RNFS.readFile(dest, 'base64'); 
    if (isSuccess == true) { setImage(dest) }
  }, [image, setImage]);

  return (
    <View style={styles.container}>

      <Text>Result: {image}</Text>
      {<Image source={{ uri: 'file://' + image }}

        style={{
          width: "70%", height: "18%", position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -150 }, { translateY: -150 }],
        }} />}
      <Button title='Open Edg e Dete ct or' onPress={async () => await openDetector()}></Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

