import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import supabase from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

const ProfileCard = () => {
  const { userData } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      setIsLoggingOut(false);
      return;
    }
    router.push("/");
  };

  return (
    <View>
      <View className="bg-base-300 rounded-lg p-4 shadow-md space-y-3">
        <Text className="text-xl font-bold text-primary-content text-left">
          {userData?.first_name} {userData?.last_name}
        </Text>
        <Text className="text-primary-content text-left">
          {userData?.email}
        </Text>

        {isLoggingOut ? (
          <View className="items-center">
            <Text className="text-primary-content mt-2">Logging out...</Text>
          </View>
        ) : (
          <View className="items-end">
            <Pressable
              onPress={handleLogout}
              className="bg-primary px-4 py-2 rounded mt-4"
            >
              <Text className="text-primary-content font-bold">Logout</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileCard;
