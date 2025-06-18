import { NullableNumber } from "../../types/workout";
import { View, Text, TouchableOpacity } from "react-native";

export type AddSetButtonProps = {
  isSetUpdating: boolean;
  handleAddSet: () => void;
  handleSaveUpdatedSet: () => void;
  cancelUpdateSet: () => void;
  updateSetIndex: NullableNumber;
};

const AddSetButtons = ({
  isSetUpdating,
  handleAddSet,
  handleSaveUpdatedSet,
  cancelUpdateSet,
  updateSetIndex,
}: AddSetButtonProps) => {
  return (
    <View className="w-full">
      {!isSetUpdating && (
        <TouchableOpacity
          className="w-full bg-primary py-3 rounded items-center"
          onPress={handleAddSet}
        >
          <Text className="text-white font-semibold">Add Set</Text>
        </TouchableOpacity>
      )}
      {isSetUpdating && (
        <View className="flex flex-col space-y-2">
          <TouchableOpacity
            className="w-full bg-primary py-3 rounded items-center"
            onPress={handleSaveUpdatedSet}
          >
            <Text className="text-white font-semibold">
              {updateSetIndex !== null
                ? `Update Set ${updateSetIndex + 1}`
                : "Update Set"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full bg-red-500 py-3 rounded items-center"
            onPress={cancelUpdateSet}
          >
            <Text className="text-white font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddSetButtons;
