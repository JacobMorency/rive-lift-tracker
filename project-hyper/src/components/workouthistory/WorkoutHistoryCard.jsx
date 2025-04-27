import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

import ExerciseDetails from "./ExerciseDetails";
import CardActionButtons from "./CardActionButtons";

import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";

const WorkoutHistoryCard = ({ workout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);

  const fetchWorkoutInfo = async () => {
    const { data, error } = await supabase
      .from("workout_exercises")
      .select("*")
      .eq("workout_id", workout.id);

    if (error) {
      console.error("Error fetching workout data:", error.message);
    } else {
      setWorkoutData(data);
    }
  };

  useEffect(() => {
    fetchWorkoutInfo();
  }, []);

  return (
    <div className="">
      <Card className="px-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-xl">
              {workout.date} - # exercises
            </span>
            <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          {isOpen && (
            <div>
              {isOpen && workoutData && workoutData.length > 0 && (
                <div>
                  {workoutData.map((exercise) => (
                    <ExerciseDetails key={exercise.id} exercise={exercise} />
                  ))}
                </div>
              )}
            </div>
          )}
        </Collapsible>
      </Card>
    </div>
  );
};

export default WorkoutHistoryCard;
