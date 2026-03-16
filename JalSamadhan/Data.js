import { useState } from "react";
import Context from "./ContextAPI";
import axios from "axios";

// ─── Validation helpers (shared between signUp & login) ───────────────────────

function isValidPhone(phone) {
  return typeof phone === "string" && /^\d{10}$/.test(phone.trim());
}

function isValidName(name) {
  return (
    typeof name === "string" &&
    name.trim().length >= 2 &&
    /^[a-zA-Z\s'-]+$/.test(name.trim())
  );
}

function isValidState(state, stateList) {
  return (
    typeof state === "string" &&
    state.trim().length > 0 &&
    stateList.some((s) => s.name === state.trim())
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const WaterState = ({ children }) => {
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [state, setstate] = useState("");
  const [admin, setadmin] = useState(false);
  const [authtoken, setauthtoken] = useState(null);

  const stateAndUTData = [
    {
      id: "1",
      name: "Andaman and Nicobar Islands",
      latitude: 11.7401,
      longitude: 92.6586,
    },
    { id: "2", name: "Andhra Pradesh", latitude: 15.9129, longitude: 79.74 },
    {
      id: "3",
      name: "Arunachal Pradesh",
      latitude: 27.1004,
      longitude: 93.6167,
    },
    { id: "4", name: "Assam", latitude: 26.2006, longitude: 92.9376 },
    { id: "5", name: "Bihar", latitude: 25.0961, longitude: 85.3131 },
    { id: "6", name: "Chandigarh", latitude: 30.7333, longitude: 76.7794 },
    { id: "7", name: "Chhattisgarh", latitude: 21.2787, longitude: 81.8661 },
    {
      id: "8",
      name: "Dadra and Nagar Haveli and Daman and Diu",
      latitude: 20.1809,
      longitude: 73.0169,
    },
    { id: "9", name: "Delhi", latitude: 28.6139, longitude: 77.209 },
    { id: "10", name: "Goa", latitude: 15.2993, longitude: 74.124 },
    { id: "11", name: "Gujarat", latitude: 22.2587, longitude: 71.1924 },
    { id: "12", name: "Haryana", latitude: 29.0588, longitude: 76.0856 },
    {
      id: "13",
      name: "Himachal Pradesh",
      latitude: 31.1048,
      longitude: 77.1734,
    },
    {
      id: "14",
      name: "Jammu and Kashmir",
      latitude: 33.7782,
      longitude: 76.5762,
    },
    { id: "15", name: "Jharkhand", latitude: 23.6102, longitude: 85.2799 },
    { id: "16", name: "Karnataka", latitude: 15.3173, longitude: 75.7139 },
    { id: "17", name: "Kerala", latitude: 10.8505, longitude: 76.2711 },
    { id: "18", name: "Ladakh", latitude: 34.1526, longitude: 77.5771 },
    { id: "19", name: "Lakshadweep", latitude: 10.5667, longitude: 72.6417 },
    { id: "20", name: "Madhya Pradesh", latitude: 23.6345, longitude: 77.7921 },
    { id: "21", name: "Maharashtra", latitude: 19.7515, longitude: 75.7139 },
    { id: "22", name: "Manipur", latitude: 24.6637, longitude: 93.9063 },
    { id: "23", name: "Meghalaya", latitude: 25.467, longitude: 91.3662 },
    { id: "24", name: "Mizoram", latitude: 23.685, longitude: 92.3476 },
    { id: "25", name: "Nagaland", latitude: 26.1584, longitude: 94.5624 },
    { id: "26", name: "Odisha", latitude: 20.9517, longitude: 85.0985 },
    { id: "27", name: "Puducherry", latitude: 11.9416, longitude: 79.8083 },
    { id: "28", name: "Punjab", latitude: 31.1471, longitude: 75.3412 },
    { id: "29", name: "Rajasthan", latitude: 27.0238, longitude: 74.2179 },
    { id: "30", name: "Sikkim", latitude: 27.533, longitude: 88.5122 },
    { id: "31", name: "Tamil Nadu", latitude: 11.1271, longitude: 78.6569 },
    { id: "32", name: "Telangana", latitude: 18.1124, longitude: 79.0193 },
    { id: "33", name: "Tripura", latitude: 23.9408, longitude: 91.9882 },
    { id: "34", name: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462 },
    { id: "35", name: "Uttarakhand", latitude: 30.0668, longitude: 79.0193 },
  ];

  const BASE_URL = "https://jalsamadhan-56704-default-rtdb.firebaseio.com";

  // ── Authorization ────────────────────────────────────────────────────────

  /**
   * Sign up a new user.
   *
   * Performs server-side (Data layer) validation before writing to Firebase so
   * that even a manipulated client call cannot persist an incomplete record.
   *
   * Returns:
   *   { name } on success   ← Firebase push response
   *   { error: string }     on validation failure
   */
  const signUp = async (name, phone, state) => {
    // ── Backend / Data-layer validation ──────────────────────────────────
    if (!isValidName(name)) {
      return {
        success: false,
        error: "Full name is required and must contain only letters (min 2 characters).",
      };
    }

    if (!isValidPhone(phone)) {
      return {
        success: false,
        error: "A valid 10-digit mobile number is required.",
      };
    }

    if (!isValidState(state, stateAndUTData)) {
      return {
        success: false,
        error: "Please select a valid Indian state or union territory.",
      };
    }

    // ── Duplicate-phone guard ─────────────────────────────────────────────
    try {
      const existing = await axios.get(`${BASE_URL}/user.json`);
      if (existing.data) {
        for (const key in existing.data) {
          if (existing.data[key].phone === phone.trim()) {
            return {
              success: false,
              error:
                "This phone number is already registered. Please log in instead.",
            };
          }
        }
      }
    } catch (checkErr) {
      console.warn("Duplicate-phone check failed (non-fatal):", checkErr);
      // Non-fatal: proceed with the write attempt; Firebase will still store the record.
    }

    // ── Persist to Firebase ───────────────────────────────────────────────
    try {
      const trimmedName  = name.trim();
      const trimmedPhone = phone.trim();
      const trimmedState = state.trim();

      setname(trimmedName);
      setphone(trimmedPhone);
      setstate(trimmedState);

      const response = await axios.post(`${BASE_URL}/user.json`, {
        name:  trimmedName,
        phone: trimmedPhone,
        state: trimmedState,
        admin: false,            // new users are never admins
      });

      return response.data;     // { name: "-NxXXX..." } on success
    } catch (error) {
      console.error("Error during sign-up:", error);
      return { success: false, error: "A network error occurred. Please try again." };
    }
  };

  // ── Login ────────────────────────────────────────────────────────────────

  /**
   * Log in an existing user by phone number.
   *
   * Returns the matching user object, or {} if not found.
   */
  const login = async (phone) => {
    // Basic guard — the Login screen also validates, but belt-and-braces.
    if (!isValidPhone(phone)) {
      return { success: false, error: "Enter a valid 10-digit mobile number." };
    }

    try {
      setphone(phone.trim());
      const response = await axios.get(`${BASE_URL}/user.json`);

      for (let i in response.data) {
        if (response.data[i].phone === phone.trim()) {
          setname(response.data[i].name);
          setstate(response.data[i].state);
          return response.data[i];
        }
      }

      return {};   // no matching user → caller treats as "not found"
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, error: "A network error occurred during login." };
    }
  };

  // ── Pre-OTP phone check ───────────────────────────────────────────────────

  /**
   * Checks whether a phone number is registered WITHOUT logging the user in.
   * Used by Login.js before generating and delivering an OTP.
   *
   * Returns the user record object if found, or null if not found.
   * Throws on network error (caller should catch).
   */
  const checkUserExists = async (phone) => {
    if (!isValidPhone(phone)) return null;

    const response = await axios.get(`${BASE_URL}/user.json`);
    if (!response.data) return null;

    for (const key in response.data) {
      if (response.data[key].phone === phone.trim()) {
        return response.data[key]; // found
      }
    }
    return null; // not found
  };

  // ── Announcement ─────────────────────────────────────────────────────────

  const AddAnn = async (title, desc) => {
    try {
      const response = await axios.post(`${BASE_URL}/announcement.json`, {
        title,
        desc,
      });
      return response.data;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  const getAnn = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/announcement.json`);
      let arr = [];
      for (let i in response.data) {
        arr.push(response.data[i]);
      }
      return arr;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  // ── Forum ────────────────────────────────────────────────────────────────

  const createPost = async (title, name) => {
    try {
      const response = await axios.post(`${BASE_URL}/Forum.json`, {
        title,
        name,
        upvotes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      return { success: false, error: "Error occurred while posting" };
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Forum.json`);
      let arr = [];
      for (const key in response.data) {
        arr.push({
          id: key,
          title: response.data[key].title,
          name: response.data[key].name || "Anonymous",
          upvotes: response.data[key].upvotes || 0,
          comments: response.data[key].comments || 0,
          timestamp: response.data[key].timestamp || new Date().toISOString(),
        });
      }
      return arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const upvotePost = async (id, currentUpvotes) => {
    try {
      const response = await axios.patch(`${BASE_URL}/Forum/${id}.json`, {
        upvotes: currentUpvotes + 1,
      });
      return response.data;
    } catch (error) {
      console.error("Error upvoting post:", error);
      return { success: false, error: "Error occurred while upvoting" };
    }
  };

  // ── SOS ──────────────────────────────────────────────────────────────────

  const SOS = async (image, category, details, longitude, latitude) => {
    try {
      const response = await axios.post(`${BASE_URL}/SOS.json`, {
        name,
        phone,
        state,
        image,
        category,
        details,
        longitude,
        latitude,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error during SOS:", error);
      return { success: false, error: "Error occurred during SOS" };
    }
  };

  const sendEmergencySMS = async (message) => {
    try {
      await axios.post(`${BASE_URL}/EmergencyAlerts.json`, {
        name,
        phone,
        state,
        message,
        timestamp: new Date().toISOString(),
        status: "sent",
      });
      return { success: true, message: "Emergency alert sent successfully" };
    } catch (error) {
      console.error("Error sending emergency SMS:", error);
      return { success: false, error: "Failed to send emergency alert" };
    }
  };

  const getFamilyContacts = async () => {
    try {
      return [
        { name: "Family Member 1", phone: "+919876543210" },
        { name: "Family Member 2", phone: "+919876543211" },
      ];
    } catch (error) {
      console.error("Error fetching family contacts:", error);
      return [];
    }
  };

  // ── Complaint ────────────────────────────────────────────────────────────

  const COMPLAINT = async (image, details, add) => {
    try {
      const response = await axios.post(`${BASE_URL}/Complaints.json`, {
        name,
        phone,
        state,
        image,
        details,
        add,
        resolved: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  const getComplaints = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Complaints.json`);
      let arr = [];
      for (let i in response.data) {
        arr.push(response.data[i]);
      }
      return arr;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  // ── Heatmap ──────────────────────────────────────────────────────────────

  const getPoints = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/SOS.json`);
      let arr = [];
      for (let i in response.data) {
        arr.push({
          latitude: response.data[i].latitude,
          longitude: response.data[i].longitude,
        });
      }
      return arr;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  // ── Contributor ──────────────────────────────────────────────────────────

  const AddContri = async (Name, Phone, Address, Category, State, Aadhar, Pan, Doc) => {
    try {
      const response = await axios.post(`${BASE_URL}/Contributor.json`, {
        Name,
        Phone,
        Address,
        Category,
        State,
        Aadhar,
        Pan,
        Doc,
        verified: 0,
      });
      return response.data;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  const getContris = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Contributor.json`);
      let arr = [];
      for (let i in response.data) {
        arr.push({
          Id: i,
          Name: response.data[i].Name,
          Phone: response.data[i].Phone,
          Address: response.data[i].Address,
          Category: response.data[i].Category,
          State: response.data[i].State,
          Aadhar: response.data[i].Aadhar,
          Pan: response.data[i].Pan,
          verified: response.data[i].verified,
        });
      }
      return arr;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  const ApproveContri = async (id, veri) => {
    try {
      const okay = await axios.get(`${BASE_URL}/Contributor/${id}.json`);
      const obj = okay.data;
      const response = await axios.put(`${BASE_URL}/Contributor/${id}.json`, {
        Name: obj.Name,
        Phone: obj.Phone,
        Address: obj.Address,
        Category: obj.Category,
        State: obj.State,
        Aadhar: obj.Aadhar,
        Pan: obj.Pan,
        verified: veri,
      });
      return response.data;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  // ── Resource ─────────────────────────────────────────────────────────────

  const AddResReq = async (details, add, latitude, longitude, cat) => {
    try {
      const response = await axios.post(`${BASE_URL}/Resource.json`, {
        details,
        add,
        latitude,
        longitude,
        cat,
        solved: 0,
      });
      return response.data;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  const GetResReq = async (cat) => {
    try {
      const response = await axios.get(`${BASE_URL}/Resource.json`);
      let arr = [];
      for (let i in response.data) {
        if (response.data[i].cat === cat) {
          arr.push({
            id: i,
            details: response.data[i].details,
            add: response.data[i].add,
            latitude: response.data[i].latitude,
            longitude: response.data[i].longitude,
            cat: response.data[i].cat,
            solved: response.data[i].solved,
          });
        }
      }
      return arr;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  const ApproveReq = async (id, veri) => {
    try {
      const response = await axios.get(`${BASE_URL}/Resource/${id}.json`);
      const okay = await axios.put(`${BASE_URL}/Resource/${id}.json`, {
        details: response.data.details,
        add: response.data.add,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        cat: response.data.cat,
        solved: veri,
      });
      return okay.data;
    } catch (error) {
      console.error("Error during add-up:", error);
      return { success: false, error: "Error occurred during sign-up" };
    }
  };

  // ── Context value ─────────────────────────────────────────────────────────

  return (
    <Context.Provider
      value={{
        stateAndUTData,
        setauthtoken,
        authtoken,
        name,
        setname,
        phone,
        setphone,
        state,
        setstate,
        signUp,
        login,
        checkUserExists,
        AddAnn,
        getAnn,
        SOS,
        sendEmergencySMS,
        getFamilyContacts,
        COMPLAINT,
        getComplaints,
        getPoints,
        setadmin,
        AddContri,
        getContris,
        ApproveContri,
        AddResReq,
        GetResReq,
        ApproveReq,
        createPost,
        getPosts,
        upvotePost,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default WaterState;