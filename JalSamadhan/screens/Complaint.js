import React, { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from "../component/ImagePicker";
import Context from "../ContextAPI";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

const Complaint = ({ navigation }) => {
  const context = useContext(Context);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Validation Error", "Please provide a description of the issue");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Validation Error", "Please provide your address");
      return;
    }

    setLoading(true);
    try {
      await context.COMPLAINT(photo, description, address);
      Alert.alert("Success", "Your complaint has been submitted successfully");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>File a Complaint</Text>
          <Text style={styles.subtitle}>Report water-related issues in your area</Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
              {" "}Issue Details
            </Text>
            
            <Input
              label="Description"
              placeholder="Describe the water issue in detail"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              leftIcon={<Ionicons name="create" size={20} color={COLORS.textSecondary} />}
            />

            <Input
              label="Location"
              placeholder="Enter the complete address"
              value={address}
              onChangeText={setAddress}
              leftIcon={<Ionicons name="location" size={20} color={COLORS.textSecondary} />}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="camera" size={20} color={COLORS.primary} />
              {" "}Evidence Photo
            </Text>
            
            <Card variant="outlined" style={styles.imageUploadCard}>
              <ImagePicker setimg={setPhoto} />
              {photo && (
                <View style={styles.imagePreviewContainer}>
                  <Text style={styles.imagePreviewText}>Photo selected</Text>
                </View>
              )}
            </Card>
          </View>

          <View style={styles.submitSection}>
            <Button
              title="Submit Complaint"
              onPress={handleSubmit}
              loading={loading}
              size="large"
              icon={<Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />}
            />
            
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="large"
              style={styles.cancelButton}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    margin: SIZES.padding,
    padding: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.margin * 1.5,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.margin,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUploadCard: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  imagePreviewContainer: {
    marginTop: SIZES.margin,
    padding: SIZES.base,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    width: '100%',
    alignItems: 'center',
  },
  imagePreviewText: {
    ...FONTS.body2,
    color: COLORS.success,
    fontWeight: '600',
  },
  submitSection: {
    gap: SIZES.base,
  },
  cancelButton: {
    marginTop: SIZES.base,
  },
});

export default Complaint;
