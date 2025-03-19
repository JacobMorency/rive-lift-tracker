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
import { Input } from "@/components/ui/input";
import { ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const ExerciseSelector = ({ exerciseName, setExerciseName }) => {
  const [exerciseOptions, setExerciseOptionsState] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Get the list of exercises from the database
  const fetchExercises = async () => {
    const { data, error } = await supabase.from("exercise_library").select("*");
    if (error) {
      console.error("Error fetching exercises:", error.message);
      return;
    }
    setExerciseOptionsState(data);
  };

  // TODO: Implement search functionality

  // TODO: Handle the select
  const handleSelect = (exercise) => {
    setExerciseName(exercise.name);
    setOpenDropdown(false);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="my-3">
      <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            className="w-full relative"
            onClick={fetchExercises}
          >
            {exerciseName || "Select an Exercise"}
            <ChevronsUpDown size={16} className="absolute right-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search for an exercise" />
            <CommandList>
              <CommandEmpty>No exercise found.</CommandEmpty>
              <CommandGroup>
                {exerciseOptions.map((exercise) => (
                  <CommandItem
                    key={exercise.id}
                    value={exercise.name}
                    onSelect={() => handleSelect(exercise)}
                  >
                    {exercise.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExerciseSelector;
