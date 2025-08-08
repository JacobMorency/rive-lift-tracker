"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import supabase from "@/app/lib/supabaseClient";
import { AuthContextType } from "@/types/workout";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [userData, setUserData] = useState<AuthContextType["userData"]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) console.error("Error fetching session:", error.message);
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      }

      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, email")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        // Check if user is confirmed before trying to create profile
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && user.email_confirmed_at) {
          await createUserProfile(user);
        }
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  const createUserProfile = async (user: any): Promise<void> => {
    try {
      // Only create profile if user has confirmed their email
      if (!user.email_confirmed_at) {
        console.log("User email not confirmed yet, skipping profile creation");
        return;
      }

      // Check if user profile already exists
      const { data: existingProfile } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        // Profile already exists, just fetch it
        await fetchUserData(user.id);
        return;
      }

      // Create new user profile
      const { error } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
      });

      if (error) {
        console.error("Error creating user profile:", error.message);
        // If it's a duplicate key error, the profile might have been created by another process
        if (error.code === "23505") {
          // Unique violation
          await fetchUserData(user.id);
        }
      } else {
        // Fetch the newly created profile
        await fetchUserData(user.id);
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
