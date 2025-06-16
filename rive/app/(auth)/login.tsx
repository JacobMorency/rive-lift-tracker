import { Text, View, Image, TextInput } from "react-native";

export default function Login() {
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
        Sign In
      </Text>
      <Image
        source={require("../../assets/images/logo.png")}
        style={{
          width: 75,
          height: 75,
          marginTop: 20,
          borderRadius: 100,
        }}
      />
      <TextInput placeholder="email" />
    </View>
  );
}
