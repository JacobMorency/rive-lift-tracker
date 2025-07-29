import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { ExercisesInWorkout, Exercise } from "@/types/workout";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import { useAuth } from "@/app/context/authcontext";
import ExerciseSelectorButton from "@/app/components/workoutform/exerciseselectorbutton";

type ExerciseSelectorProps = {
  exerciseName: string;
  setExerciseName: (name: string) => void;
  setExerciseId: (id: number) => void;
  isSetUpdating: boolean;
  isSetsEmpty: boolean;
  exercisesInWorkout: ExercisesInWorkout[];
};

type ExerciseOption = {
  id: number;
  name: string;
  category: string;
}[];

const ExerciseSelector = ({
  exerciseName,
  setExerciseName,
  setExerciseId,
  isSetUpdating,
  isSetsEmpty,
  exercisesInWorkout,
}: ExerciseSelectorProps) => {
  const [exerciseOptions, setExerciseOptionsState] = useState<ExerciseOption>(
    []
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [favoriteExercises, setFavoriteExercises] = useState<ExerciseOption>(
    []
  );
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState<Set<number>>(
    new Set()
  );

  const { user } = useAuth();

  // Get completed exercise IDs for filtering
  const completedExerciseIds = new Set(exercisesInWorkout.map((ex) => ex.id));

  // Filter out completed exercises from the exercise list
  const filterCompletedExercises = (
    exercises: ExerciseOption
  ): ExerciseOption => {
    return exercises.filter(
      (exercise) => !completedExerciseIds.has(exercise.id)
    );
  };

  // TODO: Potentially filter out exercisesInWorkout from the list instead of disabling

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
        .range(0, 30); // Limit to 30 results

      if (error) {
        console.error("Error fetching exercises:", error.message);
        return;
      }

      setExerciseOptionsState(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Debounce the search input to avoid too many requests
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
  const filteredExercises = filterCompletedExercises(
    exerciseOptions.filter((ex) =>
      ex.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  // Filter recent exercises to remove completed ones
  const getRecentExercises = (): Exercise[] => {
    const recentExercises = JSON.parse(
      localStorage.getItem("recentExercises") || "[]"
    );
    return filterCompletedExercises(recentExercises);
  };

  // Filter favorite exercises to remove completed ones
  const filteredFavoriteExercises = filterCompletedExercises(favoriteExercises);

  // Handle the select
  const handleSelect = (exercise: Exercise): void => {
    setExerciseName(exercise.name);
    setExerciseId(exercise.id);
  };

  // Add to recent exercises in local storage
  const addToRecent = async (exercise: Exercise): Promise<void> => {
    const recentExercises = getRecentExercises();
    // Check if the exercise is already in recent exercises
    const isAlreadyRecent = recentExercises.some((ex) => ex.id === exercise.id);
    if (isAlreadyRecent) {
      const updatedRecentExercises = recentExercises.filter(
        (ex) => ex.id !== exercise.id
      );
      updatedRecentExercises.unshift(exercise);
      // Limit to 5 recent exercises
      if (updatedRecentExercises.length > 5) {
        updatedRecentExercises.pop();
      }
      localStorage.setItem(
        "recentExercises",
        JSON.stringify(updatedRecentExercises)
      );
    } else {
      recentExercises.unshift(exercise);
      // Limit to 10 recent exercises
      if (recentExercises.length > 5) {
        recentExercises.pop();
      }
      localStorage.setItem("recentExercises", JSON.stringify(recentExercises));
    }
  };

  useEffect(() => {
    const getFavoriteExercises = async () => {
      if (!user) return;

      try {
        const { data: favs, error: favError } = await supabase
          .from("favorite_exercises")
          .select("exercise_id")
          .eq("user_id", user.id);

        if (favError) {
          console.error(
            "Error fetching favorite exercise IDs:",
            favError.message
          );
          return;
        }

        const ids = favs.map((f) => f.exercise_id);
        setFavoriteExerciseIds(new Set(ids));

        if (ids.length > 0) {
          const { data: exercises, error: exError } = await supabase
            .from("exercise_library")
            .select("*")
            .in("id", ids);

          if (exError) {
            console.error("Error fetching exercises:", exError.message);
            return;
          }

          setFavoriteExercises(exercises);
        } else {
          setFavoriteExercises([]);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    getFavoriteExercises();
  }, [user]);

  // Toggle favorite exercise
  const toggleFavorite = async (exercise: Exercise): Promise<void> => {
    if (!user) return;

    try {
      const isAlreadyFavorite = favoriteExerciseIds.has(exercise.id);

      if (isAlreadyFavorite) {
        const { error } = await supabase
          .from("favorite_exercises")
          .delete()
          .match({ user_id: user.id, exercise_id: exercise.id });

        if (!error) {
          const updated = new Set(favoriteExerciseIds);
          updated.delete(exercise.id);
          setFavoriteExerciseIds(updated);
          setFavoriteExercises((prev) =>
            prev.filter((ex) => ex.id !== exercise.id)
          );
        }
      } else {
        const { error } = await supabase
          .from("favorite_exercises")
          .insert({ user_id: user.id, exercise_id: exercise.id });

        if (!error) {
          const updated = new Set(favoriteExerciseIds);
          updated.add(exercise.id);
          setFavoriteExerciseIds(updated);

          // Ensure the full exercise details are added
          const fullExercise =
            exerciseOptions.find((ex) => ex.id === exercise.id) ||
            favoriteExercises.find((ex) => ex.id === exercise.id);

          if (fullExercise) {
            setFavoriteExercises((prev) => [...prev, fullExercise]);
          }
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="w-full">
      <button
        tabIndex={0}
        type="button"
        onClick={() => {
          if (!isSetsEmpty) {
            toast.error(
              "Finish or remove current sets before selecting a new exercise."
            );
            return;
          }

          (
            document.getElementById("exercise_modal") as HTMLDialogElement
          )?.showModal();
        }}
        className={`bg-primary btn w-full ${
          isSetUpdating ? "btn-disabled" : ""
        }`}
        disabled={isSetUpdating}
      >
        {exerciseName || "Select an Exercise"}
        <Dumbbell size={16} className="absolute right-10" />
      </button>

      <dialog id="exercise_modal" className="modal">
        <div className="modal-box h-screen rounded-none w-full flex flex-col px-4">
          <div className="flex justify-center">
            <h3 className="font-bold text-center mb-3">Select an Exercise</h3>
            <button
              type="button"
              className="btn btn-square btn-ghost absolute left-1 top-4"
              onClick={() => {
                (
                  document.getElementById("exercise_modal") as HTMLDialogElement
                )?.close();
              }}
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          <div>
            <div>
              <input
                type="text"
                placeholder="Search exercises"
                className="input input-bordered w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="divider">Filters</div>
            <label className="label">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                form="none"
              />
              <span className="label-text">Show Favorites Only</span>
            </label>
            <div className="flex justify-center my-3">
              <div className="filter">
                <input
                  className="btn btn-square btn-primary"
                  type="reset"
                  value="×"
                  onClick={() => setSelectedFilter("")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Chest"
                  onClick={() => setSelectedFilter("Chest")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Back"
                  onClick={() => setSelectedFilter("Back")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Legs"
                  onClick={() => setSelectedFilter("Legs")}
                />
                <input
                  className="btn btn-primary"
                  type="radio"
                  name="musclegroup"
                  aria-label="Arms"
                  onClick={() => setSelectedFilter("Arms")}
                />
              </div>
            </div>
            <div className="divider"></div>
            {!isSetUpdating && (
              <div
                className="overflow-y-auto rounded"
                style={{ maxHeight: "calc(100vh - 300px)" }}
              >
                <ul tabIndex={0}>
                  {isSetsEmpty && (
                    <div>
                      {!showFavoritesOnly ? (
                        <div>
                          {getRecentExercises().length > 0 && (
                            <div className="mb-3">
                              <h4>
                                <span className="text-lg font-semibold">
                                  Recent
                                </span>
                                {getRecentExercises().map((exercise) => (
                                  <li key={exercise.id}>
                                    <ExerciseSelectorButton
                                      exercise={exercise}
                                      handleSelect={handleSelect}
                                      addToRecent={addToRecent}
                                      isFavorite={favoriteExerciseIds.has(
                                        exercise.id
                                      )}
                                      onToggleFavorite={toggleFavorite}
                                    />
                                  </li>
                                ))}
                              </h4>
                            </div>
                          )}
                          <div>
                            <h4>
                              <span className="text-lg font-semibold">
                                {selectedFilter === "Arms"
                                  ? "Arm"
                                  : selectedFilter}{" "}
                                Exercises
                              </span>
                            </h4>
                            {filteredExercises.map((exercise) => (
                              <li key={exercise.id}>
                                <ExerciseSelectorButton
                                  exercise={exercise}
                                  handleSelect={handleSelect}
                                  addToRecent={addToRecent}
                                  isFavorite={favoriteExerciseIds.has(
                                    exercise.id
                                  )}
                                  onToggleFavorite={toggleFavorite}
                                />
                              </li>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4>
                            <span className="text-lg font-semibold">
                              {selectedFilter
                                ? `Favorite ${
                                    selectedFilter === "Arms"
                                      ? "Arm"
                                      : selectedFilter
                                  } Exercises`
                                : "Favorite Exercises"}
                            </span>
                          </h4>
                          <>
                            {filteredFavoriteExercises.length > 0 ? (
                              <>
                                {filteredFavoriteExercises
                                  .filter((ex) => {
                                    const matchesSearch = ex.name
                                      .toLowerCase()
                                      .includes(searchValue.toLowerCase());
                                    const matchesFilter =
                                      selectedFilter === ""
                                        ? true
                                        : selectedFilter === "Arms"
                                        ? [
                                            "Biceps",
                                            "Triceps",
                                            "Shoulders",
                                          ].includes(ex.category)
                                        : ex.category === selectedFilter;
                                    return matchesSearch && matchesFilter;
                                  })
                                  .map((exercise) => (
                                    <li key={exercise.id}>
                                      <ExerciseSelectorButton
                                        exercise={exercise}
                                        handleSelect={handleSelect}
                                        addToRecent={addToRecent}
                                        isFavorite={favoriteExerciseIds.has(
                                          exercise.id
                                        )}
                                        onToggleFavorite={toggleFavorite}
                                      />
                                    </li>
                                  ))}
                              </>
                            ) : (
                              <p className="text-center text-gray-500 mt-2">
                                No favorite exercises found.
                              </p>
                            )}
                          </>
                        </div>
                      )}
                    </div>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ExerciseSelector;
