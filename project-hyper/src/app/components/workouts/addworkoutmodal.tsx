"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { useAuth } from "@/app/context/authcontext";
import { useModal } from "@/app/context/modalcontext";
import AddExercisesContent from "./addexercisescontent";

type AddWorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalStep = "create-workout" | "add-exercises";

const AddWorkoutModal = ({ isOpen, onClose }: AddWorkoutModalProps) => {
  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalStep>("create-workout");
  const [createdWorkoutId, setCreatedWorkoutId] = useState("");
  const { user } = useAuth();
  const { setIsExerciseSelectorOpen } = useModal();

  // Update modal context when exercise selector is open
  useEffect(() => {
    setIsExerciseSelectorOpen(currentStep === "add-exercises" && isOpen);
  }, [currentStep, isOpen, setIsExerciseSelectorOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workoutName.trim()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert([
          {
            name: workoutName.trim(),
            description: description.trim() || null,
            user_id: user?.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating workout:", error.message);
        return;
      }

      // Move to exercise selection step
      setCreatedWorkoutId(data.id);
      setCurrentStep("add-exercises");
      setLoading(false);
    } catch (error) {
      console.error("Error creating workout:", error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWorkoutName("");
    setDescription("");
    setCurrentStep("create-workout");
    setCreatedWorkoutId("");
    onClose();
  };

  const handleExercisesComplete = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      {currentStep === "create-workout" ? (
        <div className="modal-box flex flex-col">
          <div className="flex items-center justify-between py-2 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content">
              Add New Workout
            </h2>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="workoutName" className="label text-sm">
                  Workout Name *
                </label>
                <input
                  type="text"
                  id="workoutName"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="Enter workout name"
                  className="input w-full"
                  required
                  maxLength={50}
                />
              </div>

              <div>
                <label htmlFor="description" className="label text-sm">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter workout description"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  maxLength={200}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-error flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading || !workoutName.trim()}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="modal-box w-full h-full p-0 rounded-none">
          <AddExercisesContent
            workoutId={createdWorkoutId}
            onComplete={handleExercisesComplete}
          />
        </div>
      )}
    </div>
  );
};

export default AddWorkoutModal;
