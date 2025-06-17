import {
  Text,
  View,
  Image,
  TextInput,
  SafeAreaView,
  TextInputProps,
  Pressable,
} from "react-native";
import { useState } from "react";
import supabase from "../../lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailEmpty, setEmailEmpty] = useState<boolean>(false);
  const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false);
  const [isPasswordActive, setIsPasswordActive] = useState<boolean>(false);

  const router = useRouter();

  const handleLoginSuccess = (
    user: User | null,
    session: Session | null
  ): void => {
    if (user && session) {
      router.push("/home");
    }
    // TODO: Handle case where login fails or user is null
  };

  const handleLogin = async (): Promise<void> => {
    setEmailEmpty(false);
    setPasswordEmpty(false);
    setErrorMessage("");

    let hasError = false;

    if (!email) {
      setEmailEmpty(true);
      hasError = true;
    }

    if (!password) {
      setPasswordEmpty(true);
      hasError = true;
    }

    // Stops the form from being submitted if a field is blank
    if (hasError) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      handleLoginSuccess(data.user, data.session);
    } catch (error) {
      setErrorMessage("Login failed. Invalid email or password.");
      if (process.env.NODE_ENV === "development") {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 justify-center items-center">
      <View className="w-full max-w-md space-y-5 px-4">
        <Text className="text-center text-2xl font-bold text-primary-content mb-4">
          Sign In
        </Text>

        <View className="items-center">
          <View className="bg-primary rounded-full h-20 w-20 justify-center items-center">
            <Text className="text-4xl">{isPasswordActive ? "🙈" : "💪"}</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-primary-content mb-1">Email</Text>
          <TextInput
            className="border border-primary-content text-primary-content rounded-md p-3 w-full"
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <View>
          <Text className="text-primary-content mb-1">Password</Text>
          <TextInput
            className="border border-primary-content text-primary-content rounded-md p-3 w-full mb-4"
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text);
              setIsPasswordActive(true);
            }}
            value={password}
            onBlur={() => setIsPasswordActive(false)}
          />
          <Text className="text-right mb-4 text-primary">Forgot Password?</Text>
        </View>

        <Pressable
          className="bg-primary rounded-md py-3 mb-4"
          onPress={handleLogin}
        >
          <Text className="text-center text-white font-medium">Login</Text>
        </Pressable>

        <View className="flex-row items-center justify-center mb-4">
          <View className="flex-1 border-t border-gray-700" />
          <Text className="text-center text-primary-content px-3">OR</Text>
          <View className="flex-1 border-t border-gray-700" />
        </View>

        <Pressable className="border border-white rounded-md py-3 mb-4">
          <Text className="text-center text-primary-content font-bold">
            Sign in with Google
          </Text>
        </Pressable>

        <Pressable className="border border-white rounded-md py-3 mb-4">
          <Text className="text-center text-primary-content font-bold">
            Sign in with Apple
          </Text>
        </Pressable>

        <View>
          <Text className="text-secondary text-center">
            Google and Apple sign-in are coming soon!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
