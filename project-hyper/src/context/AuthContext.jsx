import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Ensure loading state

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      // Retrieve session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
      }

      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }

      setLoading(false);
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("first_name, last_name, email")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
    } else {
      setUserData(data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
