import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileCard = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      return;
    }
    navigate("/");

    if (!userData) {
      return <p>Loading...</p>; // TODO: Add loading spinner or skeleton
    }
  };
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {userData.first_name} {userData.last_name}
          </CardTitle>
          <CardDescription>{userData.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} className="bg-red-500">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
