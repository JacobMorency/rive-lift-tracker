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
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      return;
    }
    navigate("/");
  };
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{user.first}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
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
