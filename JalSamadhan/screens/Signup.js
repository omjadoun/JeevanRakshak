/**
 * Signup.js  –  User registration with full validation + in-screen success banner
 *
 * After a successful Firebase write the user sees a full-screen success card
 * (green checkmark, name greeting, "Go to Login" button) instead of being
 * silently redirected.  An Alert is also shown as a belt-and-braces fallback.
 */

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import Button from "../components/common/Button";
import Input  from "../components/common/Input";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

// Validation helpers
function validateName(name) {
  if (!name || !name.trim()) return "Full name is required.";
  if (name.trim().length < 2)  return "Name must be at least 2 characters.";
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim()))
    return "Name may only contain letters, spaces, hyphens or apostrophes.";
  return null;
}
function validatePhone(phone) {
  if (!phone || !phone.trim()) return "Phone number is required.";
  if (!/^\d{10}$/.test(phone.trim())) return "Enter a valid 10-digit mobile number.";
  return null;
}
function validateState(state) {
  if (!state || !state.trim()) return "Please select your state / UT.";
  return null;
}

function Signup({ navigation }) {
  const context = useContext(Context);
  const { stateAndUTData } = context;

  const [name,          setName]          = useState("");
  const [phoneNumber,   setPhoneNumber]   = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [modalVisible,  setModalVisible]  = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [signedUp,      setSignedUp]      = useState(false);
  const [errors, setErrors] = useState({ name: null, phone: null, state: null });

  function onNameChange(text) {
    setName(text);
    if (errors.name) setErrors((e) => ({ ...e, name: validateName(text) }));
  }
  function onPhoneChange(text) {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(digits);
    if (errors.phone) setErrors((e) => ({ ...e, phone: validatePhone(digits) }));
  }
  function onStateSelect(stateName) {
    setSelectedState(stateName);
    setModalVisible(false);
    setErrors((e) => ({ ...e, state: null }));
  }
  function validateAll() {
    const next = {
      name:  validateName(name),
      phone: validatePhone(phoneNumber),
      state: validateState(selectedState),
    };
    setErrors(next);
    return !next.name && !next.phone && !next.state;
  }

  async function handleSignup() {
    if (!validateAll()) return;
    setLoading(true);
    try {
      const response = await context.signUp(name.trim(), phoneNumber.trim(), selectedState);
      if (!response || response.error) {
        const msg = response?.error || "We could not create your account. Please try again.";

        // Duplicate phone: show inline error under the phone field
        if (msg.toLowerCase().includes("already registered")) {
          setErrors((e) => ({
            ...e,
            phone: "An account with this number already exists. Please log in instead.",
          }));
        } else {
          Alert.alert("Sign-up Failed", msg);
        }
        return;
      }
      // SUCCESS: show in-screen banner + Alert fallback
      setSignedUp(true);
      Alert.alert(
        "✅ Account Created",
        `Welcome, ${name.trim()}!\n\nYour JalSamadhan account has been created successfully. Please log in to continue.`,
        [{ text: "Go to Login", onPress: () => navigation.navigate("Login") }]
      );
    } catch {
      Alert.alert("Error", "Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // SUCCESS SCREEN
  if (signedUp) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.successCard}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={72} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>Account Created!</Text>
          <Text style={styles.successBody}>
            Welcome to JalSamadhan,{" "}
            <Text style={styles.successName}>{name.trim()}</Text>!{"\n\n"}
            Your account has been created successfully.{"\n"}
            Please log in to access the portal.
          </Text>
          <Button
            title="Go to Login"
            onPress={() => navigation.navigate("Login")}
            size="large"
            style={styles.successBtn}
            icon={<Ionicons name="log-in" size={20} color="white" style={{ marginRight: 8 }} />}
          />
        </View>
      </View>
    );
  }

  // REGISTRATION FORM
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in all fields to register with JalSamadhan</Text>
        </View>

        <Input
          label="Full Name *"
          placeholder="e.g. Arjun Sharma"
          value={name}
          onChangeText={onNameChange}
          onBlur={() => setErrors((e) => ({ ...e, name: validateName(name) }))}
          error={errors.name}
          autoCapitalize="words"
          leftIcon={<Ionicons name="person" size={20} color={COLORS.textSecondary} />}
        />

        <Input
          label="Mobile Number *"
          placeholder="10-digit mobile number"
          value={phoneNumber}
          onChangeText={onPhoneChange}
          onBlur={() => setErrors((e) => ({ ...e, phone: validatePhone(phoneNumber) }))}
          error={errors.phone}
          keyboardType="numeric"
          maxLength={10}
          leftIcon={<Ionicons name="phone-portrait" size={20} color={COLORS.textSecondary} />}
        />

        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>State / UT *</Text>
          <TouchableOpacity
            style={[styles.statePicker, errors.state && styles.statePickerError]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="location" size={20} color={selectedState ? COLORS.text : COLORS.textSecondary} style={styles.stateIcon} />
            <Text style={[styles.stateText, !selectedState && styles.statePlaceholder]}>
              {selectedState || "Select your state / UT"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
        </View>

        <Button
          title="Create Account"
          onPress={handleSignup}
          loading={loading}
          size="large"
          style={styles.submitButton}
          icon={<Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />}
        />

        <View style={styles.loginRow}>
          <Text style={styles.mutedText}>Already have an account? </Text>
          <Button title="Log In" onPress={() => navigation.navigate("Login")} variant="ghost" size="small" />
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State / UT</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={stateAndUTData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => onStateSelect(item.name)}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: COLORS.background },
  scrollContent:    { padding: SIZES.padding, paddingBottom: SIZES.padding * 3 },
  header:           { alignItems: "center", marginTop: SIZES.margin * 2, marginBottom: SIZES.margin * 2 },
  title:            { ...FONTS.h1, color: COLORS.primary, marginBottom: SIZES.base },
  subtitle:         { ...FONTS.body2, textAlign: "center", color: COLORS.textSecondary },
  fieldWrapper:     { marginBottom: SIZES.margin },
  label:            { ...FONTS.body2, marginBottom: SIZES.base / 2, color: COLORS.text, fontWeight: "600" },
  statePicker:      { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radius, padding: SIZES.base * 1.5, backgroundColor: COLORS.surface },
  statePickerError: { borderColor: COLORS.error },
  stateIcon:        { marginRight: SIZES.base },
  stateText:        { flex: 1, fontSize: SIZES.font, color: COLORS.text },
  statePlaceholder: { color: COLORS.textSecondary },
  errorText:        { fontSize: 12, color: COLORS.error, marginTop: SIZES.base / 2 },
  submitButton:     { marginTop: SIZES.margin },
  loginRow:         { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: SIZES.margin * 1.5 },
  mutedText:        { ...FONTS.body2, color: COLORS.textSecondary },
  modalOverlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard:        { backgroundColor: COLORS.surface, borderTopLeftRadius: SIZES.radius * 2, borderTopRightRadius: SIZES.radius * 2, maxHeight: "70%", paddingBottom: SIZES.padding * 2 },
  modalHeader:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: SIZES.padding, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle:       { ...FONTS.h3, color: COLORS.text },
  modalItem:        { padding: SIZES.padding, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalItemText:    { ...FONTS.body1, color: COLORS.text },
  // Success screen
  successContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: "center", padding: SIZES.padding },
  successCard:      { backgroundColor: COLORS.surface, borderRadius: SIZES.radius * 2, padding: SIZES.padding * 2, alignItems: "center", ...SHADOWS.large },
  successIconWrap:  { width: 104, height: 104, borderRadius: 52, backgroundColor: COLORS.success + "18", alignItems: "center", justifyContent: "center", marginBottom: SIZES.margin },
  successTitle:     { ...FONTS.h1, color: COLORS.success, marginBottom: SIZES.base, textAlign: "center" },
  successBody:      { ...FONTS.body1, color: COLORS.textSecondary, textAlign: "center", lineHeight: 24, marginBottom: SIZES.margin * 2 },
  successName:      { fontWeight: "700", color: COLORS.text },
  successBtn:       { width: "100%" },
});

export default Signup;