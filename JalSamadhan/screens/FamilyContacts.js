import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

function FamilyContacts({ navigation }) {
  const context = useContext(Context);
  const [familyContacts, setFamilyContacts] = useState([
    { name: "", phone: "" },
    { name: "", phone: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const addContactField = () => {
    if (familyContacts.length < 5) {
      setFamilyContacts([...familyContacts, { name: "", phone: "" }]);
    } else {
      Alert.alert("Limit Reached", "You can add up to 5 family contacts");
    }
  };

  const removeContactField = (index) => {
    const newContacts = familyContacts.filter((_, i) => i !== index);
    setFamilyContacts(newContacts);
  };

  const updateContact = (index, field, value) => {
    const newContacts = [...familyContacts];
    newContacts[index][field] = value;
    setFamilyContacts(newContacts);
  };

  const validateContacts = () => {
    for (let contact of familyContacts) {
      if (contact.name.trim() && !contact.phone.trim()) {
        Alert.alert("Validation Error", "Please provide phone number for all named contacts");
        return false;
      }
      if (contact.phone.trim() && !contact.name.trim()) {
        Alert.alert("Validation Error", "Please provide name for all contacts with phone numbers");
        return false;
      }
      if (contact.phone.trim() && contact.phone.trim().length !== 10) {
        Alert.alert("Validation Error", "Please enter valid 10-digit phone numbers");
        return false;
      }
    }
    return true;
  };

  const saveContacts = async () => {
    if (!validateContacts()) return;

    setLoading(true);
    try {
      // Save to backend (you would implement this)
      const validContacts = familyContacts.filter(
        contact => contact.name.trim() && contact.phone.trim()
      );
      
      // For now, just show success
      Alert.alert(
        "Success",
        `Saved ${validContacts.length} family contact(s) for emergency alerts`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save family contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Contacts</Text>
          <Text style={styles.subtitle}>
            Add family members who will receive emergency alerts
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Why Add Family Contacts?</Text>
          </View>
          <Text style={styles.infoText}>
            • When you trigger an SOS alert, your family contacts will be immediately notified
          </Text>
          <Text style={styles.infoText}>
            • They will receive your location and emergency details
          </Text>
          <Text style={styles.infoText}>
            • This helps ensure your loved ones are aware of your emergency situation
          </Text>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Family Contact Details</Text>
          
          {familyContacts.map((contact, index) => (
            <Card key={index} variant="outlined" style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <Text style={styles.contactNumber}>Contact {index + 1}</Text>
                {familyContacts.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeContactField(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="remove-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </View>
              
              <Input
                placeholder="Contact Name"
                value={contact.name}
                onChangeText={(value) => updateContact(index, 'name', value)}
                leftIcon={<Ionicons name="person" size={20} color={COLORS.textSecondary} />}
              />
              
              <Input
                placeholder="Phone Number"
                value={contact.phone}
                onChangeText={(value) => updateContact(index, 'phone', value)}
                keyboardType="numeric"
                maxLength={10}
                leftIcon={<Ionicons name="phone-portrait" size={20} color={COLORS.textSecondary} />}
              />
            </Card>
          ))}

          {familyContacts.length < 5 && (
            <Button
              title="Add Another Contact"
              onPress={addContactField}
              variant="outline"
              icon={<Ionicons name="add-circle" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />}
            />
          )}
        </Card>

        <View style={styles.submitSection}>
          <Button
            title="Save Emergency Contacts"
            onPress={saveContacts}
            loading={loading}
            size="large"
            icon={<Ionicons name="save" size={20} color="white" style={{ marginRight: 8 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

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
  infoCard: {
    margin: SIZES.padding,
    padding: SIZES.padding,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  infoTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: SIZES.base,
  },
  infoText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
    lineHeight: 18,
  },
  formCard: {
    margin: SIZES.padding,
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  contactCard: {
    marginBottom: SIZES.margin,
    padding: SIZES.padding,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  contactNumber: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600',
  },
  removeButton: {
    padding: SIZES.base / 2,
  },
  submitSection: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
});

export default FamilyContacts;
