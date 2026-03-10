import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";

function SOSButton({ navigation }) {
  const [isCounting, setIsCounting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const animationValue = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const startCountdown = () => {
    let currentCount = 5;
    setTimeLeft(currentCount);

    timerRef.current = setInterval(() => {
      currentCount -= 1;
      setTimeLeft(currentCount);

      if (currentCount <= 0) {
        clearInterval(timerRef.current);
        setIsCounting(false);
        animationValue.setValue(0);
        navigation.navigate("SosDetails");
      }
    }, 1000);
  };

  const handlePressIn = () => {
    setIsCounting(true);
    startCountdown();

    Animated.timing(animationValue, {
      toValue: 1,
      duration: 5000, // Sync animation with the 5s timer
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsCounting(false);
    setTimeLeft(5);
    animationValue.setValue(0);
    animationValue.stopAnimation();
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.button,
            {
              transform: [
                {
                  scale: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            },
          ]}
        >
          {!isCounting ? (
            <Text style={styles.buttonText}>Hold 5s</Text>
          ) : (
            <Text style={styles.countdownText}>{timeLeft}</Text>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  countdownText: {
    fontSize: 24,
    color: "white",
  },
  sosGif: {
    width: 100,
    height: 100,
  },
});

export default SOSButton;
