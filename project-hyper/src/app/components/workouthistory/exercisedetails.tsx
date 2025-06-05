"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Set } from "@/types/workout";

type ExerciseDetailsProps = {
  exerciseName: string;
  sets: Set[];
};

const ExerciseDetails = ({ exerciseName, sets }: ExerciseDetailsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
              {set.partialReps != null && set.partialReps > 0 && (
                <span>
                  {" "}
                  + {set.partialReps}{" "}
                  {set.partialReps === 1 ? "partial" : "partials"}
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
