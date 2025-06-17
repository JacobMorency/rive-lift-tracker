import { SafeAreaView } from "react-native-safe-area-context";
import AddWorkoutForm from "../../components/addworkoutform";
import { View, Text } from "react-native";

const AddWorkoutPage = () => {
  return (
    <SafeAreaView>
      <View>
        <Text className="text-primary-content text-3xl font-bold my-4">
          Add Workout
        </Text>
      </View>
      <AddWorkoutForm workoutId={"1234"} />
    </SafeAreaView>
  );
};

export default AddWorkoutPage;
