import { VendorAuthProvider } from "@/context/VendorAuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <VendorAuthProvider>
      <Stack screenOptions={{headerShown: false}}/>
    </VendorAuthProvider>
  );
}
