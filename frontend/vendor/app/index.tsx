import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useVendorLogin } from "@/hooks/useVendorLogin";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VendorLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginVendor, loading, error } =
    useVendorLogin();

  const handleLogin = async () => {
    if (!email || !password) return;
    await loginVendor({ email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Vendor Login</Text>
      <Text style={styles.subHeading}>
        Sign in to manage your events
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
