import React,{useContext, useEffect,useState} from "react";
import { View, StyleSheet,Text, Platform } from "react-native";
import Context from "../ContextAPI";

let MapView, Heatmap;
if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Heatmap = Maps.Heatmap;
}

const HeatmapExample = () => {
  const context=useContext(Context);
  const initialRegion = {
    latitude: 20.5937, 
    longitude: 78.9629, 
    latitudeDelta: 20, 
    longitudeDelta: 20,
  };
const [heatmapData, setheatmapData] = useState([]);
useEffect(() => {
  async function dataset(){
    const response=await context.getPoints();
    setheatmapData(response);
  }
  dataset();
}, [])
console.log(heatmapData);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Heatmap is not supported on Web. Please use the mobile app.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {heatmapData.length===0 ? <Text>No certain Emergency right now!</Text>:<MapView style={styles.map} initialRegion={initialRegion}>
        <Heatmap
          points={heatmapData}
          radius={40}
          opacity={1}
          gradient={{
            colors: ["green", "yellow", "red"],
            startPoints: [0.01, 0.3, 1],
          }}
        />
      </MapView>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default HeatmapExample;
