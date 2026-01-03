import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import api from "@/services/api";
import { useVendorAuth } from "@/context/VendorAuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

type Event = {
  _id: string;
  status: string;
  userId: {
    name?: string;
  };
  arrival?: {
    image: string;
    location: {
      lat: number;
      lon: number;
    };
  };
  setup?: {
    pre?: { image: string };
    post?: { image: string };
  };
};

export default function VendorEventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { token } = useVendorAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [otp, setOtp] = useState("");
  const [arrivalImage, setArrivalImage] = useState<string | null>(null);
  const [preImage, setPreImage] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/vendor/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvent(res.data.event);
    } catch {
      Alert.alert("Error", "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setter(res.assets[0].uri);
    }
  };

  const markArrival = async () => {
    try {
      setLoading(true);
      if (!arrivalImage) {
        Alert.alert("Image required", "Please upload arrival image");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to mark arrival"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("latitude", String(location.coords.latitude));
      formData.append("longitude", String(location.coords.longitude));
      formData.append("image", {
        uri: arrivalImage,
        name: "arrival.jpg",
        type: "image/jpeg",
      } as any);

      await api.post("/vendor/event/arrived", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Arrival marked successfully");
      fetchEvent();
    } catch (error) {
      console.error("Arrival error:", error);
      Alert.alert("Error", "Failed to mark arrival");
    } finally {
      setLoading(false);
    }
  };

  const verifyArrivalOtp = async () => {
    try {
      setLoading(true);
      await api.post(
        "/vendor/otp/arrival/verify",
        { eventId, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtp("");
      fetchEvent();
    } catch (error) {
      console.error("Arrival OTP Error:", error);
      Alert.alert("Error", "Failed to verify otp");
    } finally {
      setLoading(false);
    }
  };

  const uploadSetup = async () => {
    try {
      setLoading(true);
      if (!preImage || !postImage) {
        Alert.alert("Both images required");
        return;
      }

      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("pre", {
        uri: preImage,
        name: "pre.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("post", {
        uri: postImage,
        name: "post.jpg",
        type: "image/jpeg",
      } as any);

      await api.post("/vendor/event/setup-completed", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchEvent();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCompletionOtp = async () => {
    try {
      setLoading(true);
      await api.post(
        "/vendor/otp/completion/verify",
        { eventId, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtp("");
      fetchEvent();
    } catch (error) {
      console.error("Completion OTP Error:", error);
      Alert.alert("Error", "Failed to verify otp");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !event) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Event</Text>
        <Text>Status: {event.status}</Text>

        {event.status === "CREATED" && (
          <>
            <TouchableOpacity onPress={() => pickImage(setArrivalImage)}>
              <Text style={styles.link}>Pick Arrival Image</Text>
            </TouchableOpacity>

            {arrivalImage && (
              <Image source={{ uri: arrivalImage }} style={styles.image} />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={markArrival}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Marking Arrival" : "Mark Arrival"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {event.status === "VENDOR_ARRIVED" && (
          <>
            <TextInput
              placeholder="Enter Arrival OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={verifyArrivalOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying" : "Verify Arrival OTP"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {event.status === "STARTED" && (
          <>
            <TouchableOpacity onPress={() => pickImage(setPreImage)}>
              <Text style={styles.link}>Pick Pre Setup Image</Text>
            </TouchableOpacity>
            {preImage && (
              <Image source={{ uri: preImage }} style={styles.image} />
            )}

            <TouchableOpacity onPress={() => pickImage(setPostImage)}>
              <Text style={styles.link}>Pick Post Setup Image</Text>
            </TouchableOpacity>
            {postImage && (
              <Image source={{ uri: postImage }} style={styles.image} />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={uploadSetup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Uploading" : "Upload Setup"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {event.status === "SETUP_COMPLETED" && (
          <>
            <TextInput
              placeholder="Enter Completion OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={verifyCompletionOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying" : "Verify Completion OTP"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {event.status === "COMPLETED" && (
          <Text style={{ marginTop: 20, color: "green" }}>
            Event Completed Successfully ✅
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  link: { color: "blue", marginTop: 16 },
  image: { width: "100%", height: 200, borderRadius: 10, marginTop: 8 },
});
