import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../ContextAPI";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

function Profile({ navigation }) {
  const context = useContext(Context);
  const user = {
    name: context.name,
    phoneNumber: context.phone,
    state: context.state,
  };

  const handleLogout = () => {
    context.setname('');
    context.setphone('');
    context.setstate('');
    navigation.navigate("Login");
  };

  const menuItems = [
    {
      icon: "people",
      title: "Emergency Contacts",
      subtitle: "Manage family contacts for SOS alerts",
      onPress: () => navigation.navigate("FamilyContacts"),
      color: COLORS.error,
    },
    {
      icon: "handshake",
      title: "Become a Contributor",
      subtitle: "Help your community with water resources",
      onPress: () => navigation.navigate("Contribute"),
      color: COLORS.primary,
    },
    {
      icon: "shield-checkmark",
      title: "Privacy Policy",
      subtitle: "How we protect your data",
      onPress: () => navigation.navigate("privacy"),
      color: COLORS.textSecondary,
    },
    {
      icon: "document-text",
      title: "Terms of Use",
      subtitle: "Terms and conditions",
      onPress: () => navigation.navigate("tos"),
      color: COLORS.textSecondary,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{user.name || "Guest User"}</Text>
          <Text style={styles.userPhone}>{user.phoneNumber || "Not logged in"}</Text>
          {user.state && (
            <Text style={styles.userState}>{user.state}</Text>
          )}
        </View>

        <Card style={styles.userInfoCard}>
          <Text style={styles.cardTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user.name || "Not provided"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="phone-portrait" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user.phoneNumber || "Not provided"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoLabel}>State:</Text>
            <Text style={styles.infoValue}>{user.state || "Not provided"}</Text>
          </View>
        </Card>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings & Options</Text>
          
          {menuItems.map((item, index) => (
            <Card key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuContent}>
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            icon={<Ionicons name="log-out" size={20} color={COLORS.error} style={{ marginRight: 8 }} />}
            textStyle={{ color: COLORS.error }}
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
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  userPhone: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  userState: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  userInfoCard: {
    margin: SIZES.padding,
    padding: SIZES.padding,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  infoLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
    marginRight: SIZES.base,
    flex: 0.5,
  },
  infoValue: {
    ...FONTS.body2,
    color: COLORS.text,
    flex: 1,
  },
  menuSection: {
    paddingHorizontal: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  menuItem: {
    marginBottom: SIZES.base,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    marginLeft: SIZES.margin,
    flex: 1,
  },
  menuTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutSection: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
});

export default Profile;
