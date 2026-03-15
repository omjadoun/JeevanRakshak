import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../logo.png";
import Context from "../ContextAPI";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { COLORS, SIZES, FONTS, SHADOWS } from "../constants/Theme";

const { width } = Dimensions.get('window');

function Home({ navigation }) {
  const context = useContext(Context);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await context.getAnn();
        setAnnouncements(response || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to JalSamadhan</Text>
          <Text style={styles.subtitle}>Your Water Resource Management Solution</Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Card variant="elevated" style={styles.actionCard}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate("Complaint")}
              >
                <Ionicons name="document-text" size={24} color={COLORS.primary} />
                <Text style={styles.actionText}>File Complaint</Text>
              </TouchableOpacity>
            </Card>
            
            <Card variant="elevated" style={styles.actionCard}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate("Resource")}
              >
                <Ionicons name="water" size={24} color={COLORS.secondary} />
                <Text style={styles.actionText}>Request Resource</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>

        <View style={styles.announcementsSection}>
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
          {Array.isArray(announcements) && announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <Card 
                key={announcement.title || index} 
                style={styles.announcementCard}
                onPress={() => navigation.navigate("Announcement", {
                  title: announcement.title,
                  description: announcement.desc,
                })}
              >
                <View style={styles.announcementHeader}>
                  <Ionicons name="megaphone" size={20} color={COLORS.primary} />
                  <Text style={styles.announcementTitle}>{announcement.title}</Text>
                </View>
                <Text style={styles.announcementDate} numberOfLines={2}>
                  {announcement.desc}
                </Text>
              </Card>
            ))
          ) : (
            <Card variant="outlined" style={styles.noAnnouncementsCard}>
              <View style={styles.noAnnouncementsContent}>
                <Ionicons name="information-circle" size={40} color={COLORS.textSecondary} />
                <Text style={styles.noAnnouncementsText}>No announcements available</Text>
                <Text style={styles.noAnnouncementsSubtext}>Check back later for updates</Text>
              </View>
            </Card>
          )}
        </View>
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
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 16,
  },
  welcomeText: {
    ...FONTS.h2,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: SIZES.radius,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  actionText: {
    ...FONTS.body2,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  announcementsSection: {
    marginBottom: 20,
  },
  announcementCard: {
    marginBottom: 12,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementTitle: {
    ...FONTS.body1,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  announcementDate: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  noAnnouncementsCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noAnnouncementsContent: {
    alignItems: 'center',
  },
  noAnnouncementsText: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  noAnnouncementsSubtext: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default Home;
