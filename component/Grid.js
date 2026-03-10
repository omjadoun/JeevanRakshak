import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
// import { useNavigation } from "@react-navigation/native";
export default function Grid({ title, color,onPress }) {
  //const navigation=useNavigation();
  //this can be used if you want to do the navigation here in a nested component, provides ease of access to all thefiles of the app
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Pressable
        style={{ flex: 1 }}
        android_ripple={{ color: "#ccc" }}
        onPress={onPress}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 4,
    margin: 16,
    borderRadius: 8,
    height: 150,
  },
  inner: {
    alignItems: "center",
    padding: 16,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color:'white'
  },
});