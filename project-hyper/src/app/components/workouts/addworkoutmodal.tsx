"use client";

import { useState } from "react";
import { X } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { useAuth } from "@/app/context/authcontext";
import { useRouter } from "next/navigation";

type AddWorkoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddWorkoutModal = ({ isOpen, onClose }: AddWorkoutModalProps) => {
  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

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

      // Navigate to the add workout form with the new workout ID
      // router.push(`/addworkout/${data.id}`);
      onClose();
    } catch (error) {
      console.error("Error creating workout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setWorkoutName("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
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

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="workoutName"
                className="block text-sm font-medium text-base-content mb-2"
              >
                Workout Name *
              </label>
              <input
                type="text"
                id="workoutName"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name"
                className="input input-bordered w-full"
                required
                maxLength={50}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-base-content mb-2"
              >
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
              className="btn btn-outline flex-1"
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
                "Create Workout"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkoutModal;
