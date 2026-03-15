import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import * as Location from 'expo-location';
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import EnhancedImagePicker from "../components/common/EnhancedImagePicker";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

function DisasterReport({ navigation }) {
  const context = useContext(Context);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emergencySent, setEmergencySent] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required for emergency services');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        longitude: locationData.coords.longitude,
        latitude: locationData.coords.latitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Required', 'Please select an emergency type');
      return;
    }

    if (!additionalDetails.trim()) {
      Alert.alert('Required', 'Please provide details about the emergency');
      return;
    }

    if (!location) {
      Alert.alert('Required', 'Location is required for emergency services');
      return;
    }

    try {
      setLoading(true);
      
      // Submit SOS report
      await context.SOS(
        image?.uri,
        selectedCategory,
        additionalDetails,
        location.longitude,
        location.latitude
      );
      
      // Send emergency message to family
      await sendEmergencyMessage();
      
    } catch (error) {
      console.error('Error submitting SOS:', error);
      Alert.alert('Error', 'Failed to submit emergency report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmergencyMessage = async () => {
    const message = `🚨 EMERGENCY ALERT 🚨\n\nType: ${selectedCategory}\nDetails: ${additionalDetails}\nLocation: https://maps.google.com/?q=${location.latitude},${location.longitude}\n\nPlease respond immediately!`;
    
    try {
      await context.sendEmergencySMS(message);
      setEmergencySent(true);
      Alert.alert('Emergency Sent', 'Your emergency report has been sent to family contacts and emergency services.');
    } catch (error) {
      console.error('Error sending emergency message:', error);
    }
  };

  const categories = [
    { name: "Flood", icon: "water", color: "#2196F3" },
    { name: "Drought", icon: "sunny", color: "#FF9800" },
    { name: "Cyclone", icon: "thunderstorm", color: "#9C27B0" },
    { name: "Water Contamination", icon: "warning", color: "#F44336" },
    { name: "Infrastructure Failure", icon: "build", color: "#607D8B" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Report</Text>
          <Text style={styles.subtitle}>Report your emergency situation</Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              {" "}Emergency Type
            </Text>
            
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.name && styles.categoryButtonSelected,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={24} 
                    color={selectedCategory === category.name ? category.color : COLORS.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.name && styles.categoryTextSelected,
                    { color: selectedCategory === category.name ? category.color : COLORS.textSecondary }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="camera" size={20} color={COLORS.primary} />
              {" "}Evidence Photo
            </Text>
            <EnhancedImagePicker
              onImageSelected={setImage}
              existingImage={image}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
              {" "}Additional Details
            </Text>
            <Input
              placeholder="Describe the emergency situation..."
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              multiline
              numberOfLines={4}
              style={styles.detailsInput}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              {" "}Location
            </Text>
            {location ? (
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>
                  Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
                <Text style={styles.locationSubtext}>
                  Location automatically detected
                </Text>
              </View>
            ) : (
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>Detecting location...</Text>
              </View>
            )}
          </View>

          <View style={styles.submitSection}>
            <Button
              title="Send Emergency Alert"
              onPress={handleSubmit}
              loading={loading}
              variant="danger"
              size="large"
              icon={<Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.error,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    margin: 16,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    minHeight: 80,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: COLORS.surface,
  },
  detailsInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  locationContainer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationText: {
    ...FONTS.body2,
    color: COLORS.success,
    fontWeight: '600',
  },
  locationSubtext: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  submitSection: {
    marginTop: 8,
  },
});

export default DisasterReport;
