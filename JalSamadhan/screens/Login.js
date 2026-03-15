import React, { useState, useContext } from "react";
import { View, Text, Alert, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

function Login({ navigation }) {
  const context = useContext(Context);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await context.login(phoneNumber);
      if (Object.keys(response).length !== 0) {
        context.setadmin(response.admin);
        context.setname(response.name);
        context.setstate(response.state);
        if (response.admin) {
          navigation.navigate('adminmain');
        } else {
          navigation.navigate('NormalUser');
        }
      } else {
        Alert.alert("Invalid", "Use correct credentials or signup!");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login with OTP to continue</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Phone Number"
          placeholder="Enter 10-digit phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          maxLength={10}
          leftIcon={<Ionicons name="phone-portrait" size={20} color={COLORS.textSecondary} />}
        />

        <Button
          title="Send OTP"
          onPress={handleLogin}
          loading={loading}
          size="large"
          style={styles.loginButton}
        />

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Not a user? </Text>
          <Button
            title="Sign up"
            onPress={() => navigation.navigate("Signup")}
            variant="ghost"
            size="small"
          />
        </View>
      </View>
    </View>
  );
}

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    alignItems: 'center',
    marginTop: SIZES.margin * 4,
    marginBottom: SIZES.margin * 3,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: SIZES.margin * 2,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.margin * 2,
  },
  signupText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
});
