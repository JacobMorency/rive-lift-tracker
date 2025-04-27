import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExerciseDetails = ({ exercise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState([]);

  const fetchExerciseName = async () => {
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

  const fetchSets = async () => {
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

  useEffect(() => {
    fetchExerciseName();
    fetchSets();
  }, [exercise.exercise_id]);

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between border-t py-2">
          <span className="font-medium">
            {exerciseName} - {sets.length}{" "}
            {sets.length != 1 ? <span>Sets</span> : <span>Set</span>}
          </span>
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <CollapsibleContent>
          <ul className="list-disc list-inside px-8 py-2">
            {sets.map((set) => (
              <li key={set.id}>
                Set {set.set_number}: {set.reps}{" "}
                {set.reps === 1 ? "rep" : "reps"} at {set.weight}lbs
                {set.partial_reps > 0 && (
                  <span>
                    {" "}
                    + {set.partial_reps}{" "}
                    {set.partial_reps === 1 ? "partial" : "partials"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExerciseDetails;
