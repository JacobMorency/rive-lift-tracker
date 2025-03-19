import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ExerciseSelector = ({
  exerciseName,
  setExerciseName,
  setExerciseOptions,
}) => {
  const [exerciseOptions, setExerciseOptionsState] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Get the list of exercises from the database
  const fetchExercises = async () => {
    const { data, error } = await supabase.from("exercise_library").select("*");
    if (error) {
      console.error("Error fetching exercises:", error.message);
      return;
    }
    setExerciseOptions(data);
  };

  // TODO: Implement search functionality

  // TODO: Handle the select

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="my-3">
      <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
        <PopoverTrigger asChild>
          <Button role="combobox" className="w-full relative">
            {exerciseName || "Select an Exercise"}
            <ChevronsUpDown size={16} className="absolute right-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search for an exercise" />
            <CommandList>
              <CommandGroup>
                {exerciseOptions.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    onClick={() => {
                      setExerciseName(exercise.name);
                      setOpenDropdown(false);
                    }}
                  >
                    {exercise.name}
                  </CommandItem>
                ))}
                {exerciseOptions.length === 0 && (
                  <CommandEmpty>No exercises found</CommandEmpty>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExerciseSelector;
