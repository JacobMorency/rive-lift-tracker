"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import {
  X,
  Dumbbell,
  ChevronRight,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import WorkoutDetailsModal from "./workoutdetailsmodal";

type WorkoutTemplatesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddNewWorkout?: () => void;
};

type WorkoutTemplate = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  exercise_count: number;
};

type WorkoutWithExercises = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  workout_exercises: { count: number }[];
};

const WorkoutTemplatesModal = ({
  isOpen,
  onClose,
  onAddNewWorkout,
}: WorkoutTemplatesModalProps) => {
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutTemplate | null>(
    null
  );
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchWorkoutTemplates();
    }
  }, [isOpen, user]);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (openMenuId) {
        const target = event.target as Element;
        if (!target.closest(".dropdown-menu")) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMenuId]);

  const fetchWorkoutTemplates = async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch workout templates with exercise count
      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
          id,
          name,
          description,
          created_at,
          workout_exercises(count)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workout templates:", error.message);
        return;
      }

      // Transform the data to include exercise count
      const templates =
        data?.map((workout: WorkoutWithExercises) => ({
          id: workout.id,
          name: workout.name,
          description: workout.description,
          created_at: workout.created_at,
          exercise_count: workout.workout_exercises?.[0]?.count || 0,
        })) || [];

      setWorkoutTemplates(templates);
    } catch (error) {
      console.error("Error fetching workout templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutClick = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedWorkoutId(null);
  };

  const handleMenuToggle = (workoutId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === workoutId ? null : workoutId);
  };

  const handleEditWorkout = (workout: WorkoutTemplate) => {
    setEditingWorkout(workout);
    setEditName(workout.name);
    setEditDescription(workout.description || "");
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingWorkout || !editName.trim()) return;

    try {
      const { error } = await supabase
        .from("workouts")
        .update({
          name: editName.trim(),
          description: editDescription.trim() || null,
        })
        .eq("id", editingWorkout.id);

      if (error) {
        console.error("Error updating workout:", error.message);
        return;
      }

      // Refresh the workout templates list
      await fetchWorkoutTemplates();
      setEditingWorkout(null);
      setEditName("");
      setEditDescription("");
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkout(null);
    setEditName("");
    setEditDescription("");
  };

  const handleDeleteWorkout = async (
    workoutId: string,
    workoutName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${workoutName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // First, check if there are any sessions using this workout
      const { data: sessions, error: sessionsError } = await supabase
        .from("workout_sessions")
        .select("id")
        .eq("workout_id", workoutId);

      if (sessionsError) {
        console.error("Error checking sessions:", sessionsError.message);
        return;
      }

      if (sessions && sessions.length > 0) {
        const sessionCount = sessions.length;
        const confirmDeleteSessions = confirm(
          `This workout has ${sessionCount} session${
            sessionCount > 1 ? "s" : ""
          } associated with it. Deleting the workout will also delete all related sessions. Do you want to continue?`
        );

        if (!confirmDeleteSessions) {
          return;
        }

        // Delete all related sessions first
        const { error: deleteSessionsError } = await supabase
          .from("workout_sessions")
          .delete()
          .eq("workout_id", workoutId);

        if (deleteSessionsError) {
          console.error(
            "Error deleting sessions:",
            deleteSessionsError.message
          );
          return;
        }
      }

      // Now delete the workout (this will cascade delete workout_exercises)
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId);

      if (error) {
        console.error("Error deleting workout:", error.message);
        return;
      }

      // Refresh the workout templates list
      await fetchWorkoutTemplates();
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full h-full p-0 rounded-none animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            Workout Templates ({workoutTemplates.length})
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 h-full">
          {/* Add New Workout Button */}
          {onAddNewWorkout && (
            <div className="mb-4 flex-shrink-0">
              <button
                onClick={onAddNewWorkout}
                className="btn btn-primary w-full"
              >
                <Plus className="size-5 mr-2" />
                Add New Workout
              </button>
            </div>
          )}

          {/* Scrollable List Section */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-10rem)] scroll-smooth">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : workoutTemplates.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell className="size-12 text-base-content/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  No Workout Templates
                </h3>
                <p className="text-base-content/60">
                  Create your first workout template to get started
                </p>
              </div>
            ) : (
              <div className="space-y-1 snap-y snap-mandatory">
                {workoutTemplates.map((workout) => (
                  <div key={workout.id} className="flex items-center gap-2">
                    <button
                      className="btn btn-ghost flex-1 py-4 text-left bg-base-300 hover:bg-base-200 border border-base-300 snap-start"
                      onClick={() => handleWorkoutClick(workout.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Dumbbell className="size-5 text-primary mr-4" />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-base-content">
                            {workout.name}
                          </div>
                        </div>
                        <p className="text-base-content/40">
                          {workout.exercise_count}
                        </p>
                        <ChevronRight className="size-5 text-base-content/40 flex-shrink-0 ml-2" />
                      </div>
                    </button>

                    {/* Three-dot menu */}
                    <div className="relative dropdown-menu">
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={(e) => handleMenuToggle(workout.id, e)}
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {openMenuId === workout.id && (
                        <div className="absolute right-0 top-full mt-1 bg-base-200 shadow-lg rounded-lg border border-base-300 z-50 min-w-[140px]">
                          <div className="py-1">
                            <button
                              onClick={() => handleEditWorkout(workout)}
                              className="w-full px-4 py-2 text-left hover:bg-base-300 flex items-center gap-2 transition-colors"
                            >
                              <Edit className="size-4" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteWorkout(workout.id, workout.name)
                              }
                              className="w-full px-4 py-2 text-left hover:bg-base-300 flex items-center gap-2 text-error transition-colors"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Workout Modal */}
      {editingWorkout && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Workout Template</h3>

            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Workout Name</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter workout name"
              />
            </div>

            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Description (Optional)</span>
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Enter workout description"
                rows={3}
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveEdit}
                disabled={!editName.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workout Details Modal */}
      <WorkoutDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        workoutId={selectedWorkoutId}
      />
    </div>
  );
};

export default WorkoutTemplatesModal;
