import type { PropsWithChildren } from "react";
import { View, type ViewStyle } from "react-native";

const cardStyle: ViewStyle = {
  borderRadius: 24,
  backgroundColor: "white",
  padding: 24,
  shadowColor: "#0f172a",
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 3,
};

export function MobileCard({ children }: PropsWithChildren) {
  return <View style={cardStyle}>{children}</View>;
}
