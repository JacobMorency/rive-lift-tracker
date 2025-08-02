"use client";

import { useState, useEffect } from "react";
import { Plus, Play, Dumbbell } from "lucide-react";
import AddWorkoutModal from "./addworkoutmodal";
import WorkoutTemplatesModal from "./workouttemplatesmodal";
import WorkoutCard from "./workoutcard";
import { useRouter } from "next/navigation";

const WorkoutsContent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWorkoutTemplatesModalOpen, setIsWorkoutTemplatesModalOpen] =
    useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAddNewWorkout = () => {
    setIsModalOpen(true);
  };

  const handleQuickStart = () => {
    // Navigate to sessions page to start a new session
    router.push("/sessions");
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
        <WorkoutCard
          title="Add New Workout"
          description="Start tracking your progress"
          icon={Plus}
          onClick={handleAddNewWorkout}
          variant="primary"
        />

        <WorkoutCard
          title="Workout Templates"
          description="View and manage your saved workouts"
          icon={Dumbbell}
          onClick={handleWorkoutTemplates}
        />

        <WorkoutCard
          title="Quick Start Session"
          description="Start tracking your workout"
          icon={Play}
          onClick={handleQuickStart}
        />
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
        onAddNewWorkout={() => {
          setIsWorkoutTemplatesModalOpen(false);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export default WorkoutsContent;
