import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardContent from "../../components/dashboard/dashboardcontent";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-base-100 flex-1 px-8">
      <View>
        <Text className="text-primary-content text-3xl font-bold my-4">
          Hiya, User
        </Text>
      </View>

      <View>
        <DashboardContent />
      </View>
    </SafeAreaView>
  );
}
