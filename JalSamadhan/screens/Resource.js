import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as Location from "expo-location";
import Context from "../ContextAPI";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

function Resource({ navigation }) {
  const context = useContext(Context);
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cat, setcat] = useState("");
  const categories = [
    "Water",
    "Food",
    "Shelter",
    "Medical Supplies",
    "Other Categories",
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        long: location.coords.longitude,
        lat: location.coords.latitude,
      });
    })();
  }, []);

  const handleRequestSubmit = async () => {
    if (!cat) {
      Alert.alert("Please select a category");
      return;
    }

    Alert.alert(
      "Warning",
      "This feature should only be used during disaster emergencies. Misuse may result in blacklisting from the app."
    );
    const lat = location ? location.lat : '';
    const long = location ? location.long : '';

    const response = await context.AddResReq(
      details,
      address,
      lat, long,
      cat
    );
    setDetails("");
    setAddress("");
    setcat("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Request Resource</Text>
          <Text style={styles.subtitle}>Request essential resources during emergencies</Text>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            ⚠️ Emergency Use Only
          </Text>
          <Text style={styles.warningSubtext}>
            This feature should only be used during disaster emergencies. Misuse may result in blacklisting from the app.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />

          <Text style={styles.label}>Additional Details:</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter additional details (optional)"
            value={details}
            onChangeText={(text) => setDetails(text)}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {cat || "Select Category"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleRequestSubmit}>
            <Text style={styles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView>
                {categories.map((category, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setcat(category);
                      setModalVisible(!modalVisible);
                    }}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? COLORS.primary : COLORS.surface,
                      },
                      styles.categoryItem,
                    ]}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFEAA7',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
  },
  warningText: {
    ...FONTS.body1,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: 8,
  },
  warningSubtext: {
    ...FONTS.body2,
    color: COLORS.error,
    lineHeight: 20,
  },
  formSection: {
    gap: 16,
  },
  label: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    height: 80,
    textAlignVertical: 'top',
  },
  categoryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  submitButton: {
    backgroundColor: COLORS.success,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryText: {
    ...FONTS.body1,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default Resource;
