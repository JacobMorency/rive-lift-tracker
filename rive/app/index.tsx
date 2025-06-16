import { Text, View } from "react-native";
import { Button } from "tamagui";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#FFF",
        }}
      >
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
