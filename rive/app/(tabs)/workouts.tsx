import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutsScreen() {
  return (
    <SafeAreaView className="bg-base-100 flex-1 px-8">
      <View>
        <Text className="text-primary-content text-3xl font-bold my-4">
          Workouts
        </Text>
      </View>

      <View></View>
    </SafeAreaView>
  );
}
