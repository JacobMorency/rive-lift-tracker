import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExerciseDetails = ({ exercise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");

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

  useEffect(() => {
    fetchExerciseName();
  }, [exercise.exercise_id]);

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between border-t py-2">
          <span className="font-medium">{exerciseName}</span>
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <CollapsibleContent>
          <ul className="list-disc list-inside px-8 py-2">
            <li>test 1</li>
            <li>test 2</li>
            <li>test 3</li>
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExerciseDetails;
