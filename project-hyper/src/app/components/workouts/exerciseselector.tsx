"use client";

import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { Exercise } from "@/types/workout";
import debounce from "lodash/debounce";

type ExerciseSelectorProps = {
  onExerciseSelect: (exercises: Exercise[]) => void;
  initialSelectedExercises?: Exercise[];
  title?: string;
  confirmText?: string;
};

type ExerciseOption = {
  id: number;
  name: string;
  category: string;
};

const ExerciseSelector = ({
  onExerciseSelect,
  initialSelectedExercises = [],
  title = "Select Exercises",
  confirmText = "Done",
}: ExerciseSelectorProps) => {
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(
    initialSelectedExercises
  );

  const fetchExercises = async (
    searchTerm: string,
    filter: string
  ): Promise<void> => {
    try {
      let query = supabase
        .from("exercise_library")
        .select("*")
        .order("name", { ascending: true });

      if (filter === "Arms") {
        query = query.in("category", ["Biceps", "Triceps", "Shoulders"]);
      } else if (filter) {
        query = query.eq("category", filter);
      }

      const { data, error } = await query
        .ilike("name", `%${searchTerm}%`)
        .range(0, 50);

      if (error) {
        console.error("Error fetching exercises:", error.message);
        return;
      }

      setExerciseOptions(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Debounce the search input
  const debouncedFetch = debounce((term: string, filter: string) => {
    fetchExercises(term, filter);
  }, 300);

  useEffect(() => {
    debouncedFetch(searchValue, selectedFilter);
  }, [searchValue, selectedFilter, debouncedFetch]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // Filter exercises based on search input
  const filteredExercises = exerciseOptions.filter((ex) =>
    ex.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle exercise selection
  const handleExerciseToggle = (exercise: Exercise): void => {
    const isAlreadySelected = selectedExercises.some(
      (ex) => ex.id === exercise.id
    );

    if (!isAlreadySelected) {
      setSelectedExercises((prev) => [...prev, exercise]);
    } else {
      setSelectedExercises((prev) =>
        prev.filter((ex) => ex.id !== exercise.id)
      );
    }
  };

  // Handle confirm selection
  const handleConfirm = () => {
    onExerciseSelect(selectedExercises);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Action Button */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={handleConfirm} className="btn btn-primary btn-sm">
            {confirmText} ({selectedExercises.length})
          </button>
        </div>
        <p className="text-sm text-base-content/70">
          {selectedExercises.length} exercise
          {selectedExercises.length !== 1 ? "s" : ""} selected
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search exercises..."
            className="input input-bordered w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex justify-center">
          <div className="filter">
            <input
              className="btn filter-reset btn-primary"
              type="radio"
              name="exercise-categories"
              aria-label="All"
              checked={selectedFilter === ""}
              onChange={() => setSelectedFilter("")}
            />
            {["Chest", "Back", "Legs", "Arms"].map((filter) => (
              <input
                key={filter}
                className="btn btn-primary"
                type="radio"
                name="exercise-categories"
                aria-label={filter}
                checked={selectedFilter === filter}
                onChange={() => setSelectedFilter(filter)}
              />
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            {selectedFilter || "All"} Exercises ({filteredExercises.length})
          </h4>

          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <p>No exercises found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExercises.map((exercise) => {
                const isSelected = selectedExercises.some(
                  (ex) => ex.id === exercise.id
                );

                return (
                  <div key={exercise.id} className="flex items-center gap-2">
                    <button
                      className={`btn btn-circle btn-xs ${
                        isSelected ? "btn-success" : "text-primary bg-base-300"
                      }`}
                      onClick={() => handleExerciseToggle(exercise)}
                    >
                      {isSelected ? (
                        <Check size={12} strokeWidth={4} />
                      ) : (
                        <Plus size={12} strokeWidth={4} />
                      )}
                    </button>
                    <button
                      key={exercise.id}
                      className={`btn btn-ghost flex-1 py-4 text-left ${
                        isSelected ? "" : ""
                      }`}
                      onClick={() => handleExerciseToggle(exercise)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 text-left">
                          <div className="text-sm">{exercise.name}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
