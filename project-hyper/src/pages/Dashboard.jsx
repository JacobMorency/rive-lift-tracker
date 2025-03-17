import { Button } from "@/components/ui/button";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      return;
    }
    navigate("/");
    console.log("Logged out successfully");
  };
  return (
    <div>
      <h1 className="text-center">Dashboard</h1>
      <div className="flex justify-center mt-4">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
