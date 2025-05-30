"use client";

import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Set } from "@/types/workout";

type ExerciseDetailsProps = {
  exercise: WorkoutExercise;
};

type WorkoutExercise = {
  id: number;
  exercise_id: number;
  workout_id: number;
};

const ExerciseDetails = ({ exercise }: ExerciseDetailsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    const fetchExerciseName = async (): Promise<void> => {
      const { data, error } = await supabase
        .from("exercise_library")
        .select("name")
        .eq("id", exercise.exercise_id)
        .single();

      if (error) {
        console.error("Error fetching exercise name:", error.message);
      } else {
        setExerciseName(data.name);
      }
    };

    const fetchSets = async (): Promise<void> => {
      const { data, error } = await supabase
        .from("sets")
        .select("*")
        .eq("workout_exercise_id", exercise.id);

      if (error) {
        console.error("Error fetching sets:", error.message);
      } else {
        setSets(data);
      }
    };
    fetchExerciseName();
    fetchSets();
  }, [exercise.id, exercise.exercise_id]);

  return (
    <div className="border-t border-base-300 py-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {exerciseName} – {sets.length} {sets.length === 1 ? "Set" : "Sets"}
        </span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {isOpen && (
        <ul className="list-disc list-inside px-4 py-2 text-sm space-y-1">
          {sets.map((set) => (
            <li key={set.id}>
              Set {set.set_number}: {set.reps} {set.reps === 1 ? "rep" : "reps"}{" "}
              at {set.weight}lbs
              {set.partial_reps != null && set.partial_reps > 0 && (
                <span>
                  {" "}
                  + {set.partial_reps}{" "}
                  {set.partial_reps === 1 ? "partial" : "partials"}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExerciseDetails;
