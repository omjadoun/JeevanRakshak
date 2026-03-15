import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

const { width, height } = Dimensions.get('window');

function SOSButton({ navigation }) {
  const [isCounting, setIsCounting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  // Skip animations on web to avoid compatibility issues
  const startPulse = () => {
    if (Platform.OS === 'web') return;
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    if (Platform.OS === 'web') return;
    
    pulseAnimation.stopAnimation();
    pulseAnimation.setValue(1);
  };

  const startCountdown = () => {
    let currentCount = 5;
    setTimeLeft(currentCount);

    timerRef.current = setInterval(() => {
      currentCount -= 1;
      setTimeLeft(currentCount);

      if (currentCount <= 0) {
        clearInterval(timerRef.current);
        setIsCounting(false);
        progressAnimation.setValue(0);
        stopPulse();
        navigation.navigate("SosDetails");
      }
    }, 1000);
  };

  const handlePressIn = () => {
    setIsCounting(true);
    startCountdown();
    startPulse();

    if (Platform.OS !== 'web') {
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsCounting(false);
    setTimeLeft(5);
    progressAnimation.setValue(0);
    if (Platform.OS !== 'web') {
      progressAnimation.stopAnimation();
    }
    stopPulse();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopPulse();
    };
  }, []);

  const progressWidth = Platform.OS === 'web' 
    ? isCounting ? '50%' : '0%'
    : progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.error} />
      
      <View style={styles.header}>
        <Ionicons name="warning" size={60} color={COLORS.surface} />
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          {isCounting 
            ? `Keep holding... ${timeLeft}s` 
            : "Hold for 5 seconds to send emergency alert"
          }
        </Text>
      </View>

      <View style={styles.sosContainer}>
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View>
            <Animated.View
              style={[
                styles.sosButton,
                Platform.OS !== 'web' && {
                  transform: [{ scale: pulseAnimation }],
                  backgroundColor: isCounting ? COLORS.error : '#FF6B6B',
                },
                Platform.OS === 'web' && {
                  backgroundColor: isCounting ? COLORS.error : '#FF6B6B',
                }
              ]}
            >
              {!isCounting ? (
                <View style={styles.sosContent}>
                  <Ionicons name="alert" size={80} color={COLORS.surface} />
                  <Text style={styles.sosText}>HOLD</Text>
                </View>
              ) : (
                <View style={styles.countdownContent}>
                  <Text style={styles.countdownNumber}>{timeLeft}</Text>
                  <Text style={styles.countdownLabel}>SENDING...</Text>
                </View>
              )}
            </Animated.View>
            
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.footer}>
        <Text style={styles.warningText}>
          This will send an emergency alert to your contacts and nearby authorities
        </Text>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>Location will be shared</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>Emergency contacts will be notified</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingBottom: height * 0.05,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.error,
    marginTop: SIZES.margin,
    fontWeight: 'bold',
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.padding * 2,
  },
  sosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  sosContent: {
    alignItems: 'center',
  },
  sosText: {
    ...FONTS.h2,
    color: COLORS.surface,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  countdownContent: {
    alignItems: 'center',
  },
  countdownNumber: {
    ...FONTS.h1,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  countdownLabel: {
    ...FONTS.body2,
    color: COLORS.surface,
    marginTop: SIZES.base / 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    marginTop: SIZES.margin,
    overflow: 'hidden',
  },
  footer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
    paddingBottom: height * 0.1,
  },
  warningText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.margin,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  infoText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
});

export default SOSButton;
