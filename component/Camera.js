import { View, Text } from "react-native";
import React, { useEffect, useRef } from "react";
//NOT FULLY MADE TILL NOW
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
const [type, setType] = useState(CameraType.back);
const [hasCameraPermission, setHasCameraPermission] = useState(null);
const CameraRef = useRef(null);
useEffect(() => {
  (async () => {
    MediaLibrary.requestPermissionsAsync();
    const CameraStatus = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(CameraStatus.status === "granted");
  })();
}, []);
const Camera = () => {
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={CameraRef}></Camera>
    </View>
  );
};

export default Camera;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
