import BottomNav from "./BottomNav";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetches the user from the auth state
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    console.log("user", user);
  };

  // Checks if the user is logged into the session
  const checkUserLoggedIn = async () => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        console.log("Auth state changed:", session);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  };

  useEffect(() => {
    fetchUser();
    checkUserLoggedIn();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
      {user && <BottomNav />}
    </div>
  );
};

export default Layout;
