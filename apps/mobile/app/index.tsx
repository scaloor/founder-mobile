import { StyleSheet, Text, View } from "react-native";
import { MobileCard } from "@founder-mobile/ui";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MobileCard>
        <Text style={styles.eyebrow}>Founder Mobile</Text>
        <Text style={styles.title}>Expo app placeholder</Text>
        <Text style={styles.body}>
          Shared design primitives are wired. Add product flows once the template
          is cloned into a real project.
        </Text>
      </MobileCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#f8fafc" },
  eyebrow: { color: "#2563eb", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  title: { marginTop: 8, fontSize: 28, fontWeight: "800", color: "#111827" },
  body: { marginTop: 12, color: "#475569", lineHeight: 22 },
});
