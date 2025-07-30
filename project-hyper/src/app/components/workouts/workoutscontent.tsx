"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { Plus, Star, Dumbbell } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import AddWorkoutModal from "./addworkoutmodal";
import WorkoutTemplatesModal from "./workouttemplatesmodal";

const WorkoutsContent = () => {
  const [favoriteExercisesCount, setFavoriteExercisesCount] =
    useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWorkoutTemplatesModalOpen, setIsWorkoutTemplatesModalOpen] =
    useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteExercises = async (): Promise<void> => {
      if (user !== null) {
        const { data, error } = await supabase
          .from("favorite_exercises")
          .select("*", { count: "exact" })
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching favorite exercises:", error.message);
        } else {
          setFavoriteExercisesCount(data.length);
        }
        setLoading(false);
      }
    };

    fetchFavoriteExercises();
  }, [user]);

  const handleAddNewWorkout = () => {
    setIsModalOpen(true);
  };

  const handleFavoriteExercises = () => {
    // TODO: Navigate to favorite exercises page or modal
    console.log("Navigate to favorite exercises");
  };

  const handleWorkoutTemplates = () => {
    setIsWorkoutTemplatesModalOpen(true);
  };

  if (loading) {
    return (
      <div className="pb-24">
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="animate-fade-in-up transition-opacity duration-500 mt-3">
        {/* Add New Workout Card */}
        <div className="px-4 mb-4">
          <div
            className="card card-border bg-primary hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
            onClick={handleAddNewWorkout}
          >
            <div className="card-body">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-content/20 rounded-full p-2">
                    <Plus className="size-6 text-primary-content" />
                  </div>
                  <div>
                    <h3 className="card-title text-primary-content text-lg">
                      Add New Workout
                    </h3>
                    <p className="text-primary-content/80 text-sm">
                      Start tracking your progress
                    </p>
                  </div>
                </div>
                <div className="text-primary-content/60">
                  <Dumbbell className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Templates Card */}
        <div className="px-4 mb-4">
          <div
            className="card card-border bg-base-100 hover:bg-base-200 transition-colors duration-200 cursor-pointer"
            onClick={handleWorkoutTemplates}
          >
            <div className="card-body">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 rounded-full p-2">
                    <Dumbbell className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-base-content text-lg">
                      Workout Templates
                    </h3>
                    <p className="text-base-content/60 text-sm">
                      View and manage your saved workouts
                    </p>
                  </div>
                </div>
                <div className="text-base-content/40">
                  <Dumbbell className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Exercises Card */}
        <div className="px-4">
          <div
            className="card card-border bg-base-100 hover:bg-base-200 transition-colors duration-200 cursor-pointer"
            onClick={handleFavoriteExercises}
          >
            <div className="card-body">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 rounded-full p-2">
                    <Star className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-base-content text-lg">
                      Favorite Exercises
                    </h3>
                    <p className="text-base-content/60 text-sm">
                      {favoriteExercisesCount} saved exercises
                    </p>
                  </div>
                </div>
                <div className="text-base-content/40">
                  <Star className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Workout Modal */}
      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Workout Templates Modal */}
      <WorkoutTemplatesModal
        isOpen={isWorkoutTemplatesModalOpen}
        onClose={() => setIsWorkoutTemplatesModalOpen(false)}
      />
    </div>
  );
};

export default WorkoutsContent;
