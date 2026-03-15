import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "./constants/Theme";
import Sos from "./screens/Sos";
import Complaint from "./screens/Complaint";
import Forum from "./screens/Forum";
import Home from "./screens/Home";
import Contribute from "./screens/Contribute";
import Adminer from "./screens/Admin";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profiler from "./screens/Profile";
import Announcement from "./screens/Announcement";
import TOS from "./screens/TOS";
import Privacy from "./screens/Privacy";
import StateWise from "./screens/admin_control/StateWise";
import ComplaintPosts from "./screens/admin_control/ComplaintPosts";
import AddAnnouncement from "./screens/admin_control/AddAnnouncement";
import Resource from "./screens/Resource";
import Request_Resource_Cat from "./screens/admin_control/Request_Resource_Cat";
import ResourceRequestsScreen from "./screens/admin_control/ResourceRequestsScreen";
import VerifyContributors from "./screens/admin_control/VerifyContributors";
import SosDetails from "./screens/SosDetails";
import FamilyContacts from "./screens/FamilyContacts";
import Map from "./screens/Map";
import WaterState from "./Data";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerTitleAlign: "center",
  headerTitleStyle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: '600',
  },
  headerStyle: {
    backgroundColor: COLORS.surface,
    elevation: 2,
    shadowOpacity: 0.1,
  },
  headerTintColor: COLORS.primary,
};
const Stacker = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Announcement" component={Announcement} />
      <Stack.Screen name="Complaint" component={Complaint} />
      <Stack.Screen name="Contribute" component={Contribute} />
    </Stack.Navigator>
  );
};
const Emergency = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="mainemergency">
        <Stack.Screen
          name="mainemergency"
          component={Sos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SosDetails"
          component={SosDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};
const NormalUser = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: {
          ...FONTS.caption,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Stacker"
        component={Stacker}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              color={color} 
              size={size} 
            />
          ),
        }}
      />

      <Tab.Screen
        name="HeatMap"
        component={Map}
        options={{
          title: "HeatMap",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "map" : "map-outline"} 
              color={color} 
              size={size} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="SOS"
        component={Emergency}
        options={{
          title: "SOS",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dangerous" color={COLORS.error} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Resource"
        component={Resource}
        options={{
          title: "Request Resource",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "water" : "water-outline"} 
              color={color} 
              size={size} 
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="CommunityForum"
        component={Forum}
        options={{
          title: "Forum",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name={focused ? "forum" : "chat"} 
              color={color} 
              size={size} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const Profile = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="main" 
        component={Profiler} 
        options={{ title: "Profile" }}
      />
      <Stack.Screen 
        name="contribute" 
        component={Contribute} 
        options={{ title: "Contribute" }}
      />
      <Stack.Screen 
        name="FamilyContacts" 
        component={FamilyContacts} 
        options={{ title: "Emergency Contacts" }}
      />
      <Stack.Screen 
        name="tos" 
        component={TOS} 
        options={{ title: "Terms of Service" }}
      />
      <Stack.Screen 
        name="privacy" 
        component={Privacy} 
        options={{ title: "Privacy Policy" }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <WaterState>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={screenOptions}
          >
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                title: "JalSamadhan",
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.surface,
                headerTitleStyle: {
                  ...FONTS.h2,
                  color: COLORS.surface,
                },
              }}
            />
            <Stack.Screen
              name="NormalUser"
              component={NormalUser}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="adminmain" 
              component={Adminer} 
              options={{ title: "Admin Dashboard" }}
            />
            <Stack.Screen 
              name="States" 
              component={StateWise} 
              options={{ title: "State-wise Data" }}
            />
            <Stack.Screen 
              name="ComplaintPosts" 
              component={ComplaintPosts} 
              options={{ title: "Complaint Posts" }}
            />
            <Stack.Screen 
              name="AddAnnouncement" 
              component={AddAnnouncement} 
              options={{ title: "Add Announcement" }}
            />
            <Stack.Screen
              name="Request_Resource_Cat"
              component={Request_Resource_Cat}
              options={{ title: "Resource Requests" }}
            />
            <Stack.Screen
              name="ResourceRequestsScreen"
              component={ResourceRequestsScreen}
              options={{ title: "Resource Requests" }}
            />
            <Stack.Screen 
              name="Signup" 
              component={Signup} 
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen 
              name="Profile" 
              component={Profile} 
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VerifyContributors"
              component={VerifyContributors}
              options={{ title: "Verify Contributors" }}
            />
          </Stack.Navigator>
        </WaterState>
      </NavigationContainer>
    </>
  );
}
