"use client";
import { ChevronDown, ChevronUp } from "lucide-react";

import ExerciseDetails from "@/app/components/workouthistory/exercisedetails";
import CardActionButtons from "@/app/components/workouthistory/cardactionbuttons";

import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";

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
    <div className="mb-3">
      <div className="card bg-base-200 shadow-md">
        <div className="card-body px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-lg font-semibold">
              {workout.date} - {workoutData.length}{" "}
              {workoutData.length > 1 ? "Exercises" : "Exercise"}
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {isOpen && (
            <div className="mt-2 space-y-2">
              {workoutData?.length > 0 &&
                workoutData.map((exercise) => (
                  <ExerciseDetails key={exercise.id} exercise={exercise} />
                ))}

              <div className="flex justify-end pt-2">
                <CardActionButtons />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistoryCard;
