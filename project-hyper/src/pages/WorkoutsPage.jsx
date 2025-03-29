import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [workoutId, setWorkoutId] = useState(null);

  useEffect(() => {
    const savedWorkoutId = localStorage.getItem("workoutId");
    if (savedWorkoutId) {
      setWorkoutId(savedWorkoutId);
      setWorkoutInProgress(true);
    }
  }, []);

  const handleStartNewWorkout = async () => {
    let newWorkoutId = await createNewWorkout();
    if (newWorkoutId) {
      setWorkoutId(newWorkoutId);
      localStorage.setItem("workoutId", newWorkoutId);
      setWorkoutInProgress(true);
      navigate(`/add-workout/${workoutId}`);
    }
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
    return data?.id;
  };

  const handleContinueWorkout = () => {
    if (workoutId) {
      navigate(`/add-workout/${workoutId}`);
    }
  };

  return (
    // height is calculated based on the screen size subtracting the bottom navigation height
    <div>
      {workoutInProgress ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
          <Button onClick={handleContinueWorkout}>
            Continue Previous Workout
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
          <Button onClick={handleStartNewWorkout}>Start New Workout</Button>
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
