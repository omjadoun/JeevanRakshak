import React, { useState, useContext } from "react";
import { View, Text, Alert, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS, SIZES, FONTS } from "../constants/Theme";

function Login({ navigation }) {
  const context = useContext(Context);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [loading, setLoading] = useState(false);

  function onPhoneChange(text) {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(digits);
    if (phoneError) setPhoneError(digits.length === 10 ? null : phoneError);
  }

  async function handleLogin() {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setPhoneError(null);
    setLoading(true);

    try {
      const response = await context.login(phoneNumber);

      if (!response || Object.keys(response).length === 0) {
        setPhoneError("No account found for this number. Please sign up first.");
        return;
      }

      if (response.error) {
        Alert.alert("Login Failed", response.error);
        return;
      }

      context.setadmin(response.admin);
      context.setname(response.name);
      context.setstate(response.state);

      if (response.admin) {
        navigation.navigate("adminmain");
      } else {
        navigation.navigate("NormalUser");
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your registered mobile number to log in</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Mobile Number"
          placeholder="Enter 10-digit mobile number"
          value={phoneNumber}
          onChangeText={onPhoneChange}
          onBlur={() => {
            if (phoneNumber && phoneNumber.length !== 10)
              setPhoneError("Phone number must be exactly 10 digits.");
          }}
          error={phoneError}
          keyboardType="numeric"
          maxLength={10}
          leftIcon={
            <Ionicons name="phone-portrait" size={20} color={COLORS.textSecondary} />
          }
        />

        <Button
          title="Log In"
          onPress={handleLogin}
          loading={loading}
          size="large"
          style={styles.loginButton}
          icon={
            <Ionicons
              name="log-in"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
        />

        <View style={styles.signupRow}>
          <Text style={styles.mutedText}>Don't have an account? </Text>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("Signup")}
            variant="ghost"
            size="small"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    alignItems: "center",
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
    textAlign: "center",
    color: COLORS.textSecondary,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  loginButton: {
    marginTop: SIZES.margin * 2,
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SIZES.margin * 2,
  },
  mutedText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
});

export default Login;