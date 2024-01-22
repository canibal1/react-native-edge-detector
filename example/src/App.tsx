import React, { useState } from 'react';
import { View, Text, Button, Image, SafeAreaView } from 'react-native';
import { openEdgeDetector } from 'react-native-edge-detector';

export default function App() {
  const [frontImage, setFrontImage] = useState<string>();
  const [backImage, setBackImage] = useState<string>();

  const openDetector = async (side: string) => {
    const base64Data = await openEdgeDetector(
      "Scanning",
      "Crop",
      "Black White",
      "Reset"
    );

    if (base64Data) {
      if (side === 'front') {
        setFrontImage(base64Data);
      } else if (side === 'back') {
        setBackImage(base64Data);
      }
    }
  };

  const renderFront = () => (
    <View key={"renderFront"}>
      <Text>Front Text</Text>
      {frontImage && <Image source={{ uri: "data:image/png;base64," + frontImage }} style={{ width: 300, height: 200 }} />}
      <Button title="Front Button" onPress={() => openDetector("front")} />
    </View>
  ); 

  const renderBack = () => (
    <View key={"renderBack"}>
      <Text>Back Text</Text>
      {backImage && <Image source={{ uri: "data:image/png;base64," + backImage }} style={{ width: 300, height: 200 }} />}
      <Button title="Back Button" onPress={() => openDetector("back")} />
    </View>
  );

  return (
    <SafeAreaView>
    <View>
      {[renderFront(), renderBack()]}
    </View>
    </SafeAreaView>
  );
};
