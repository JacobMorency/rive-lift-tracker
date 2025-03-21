import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartNewWorkout = async () => {
    let workoutId = await createNewWorkout();
    navigate(`/add-workout/${workoutId}`);
  };

  const createNewWorkout = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .insert([{ user_id: user.id, date: new Date() }])
      .select("id", "user_id", "date")
      .single();

    if (error) {
      console.error("Error creating new workout:", error.message);
      return null;
    }
    console.log(data);
    return data?.id;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={handleStartNewWorkout}>Start New Workout</Button>
    </div>
  );
};

export default WorkoutsPage;
