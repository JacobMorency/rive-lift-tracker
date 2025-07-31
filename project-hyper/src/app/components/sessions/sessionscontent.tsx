"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { Plus, Play, ChevronRight } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import SelectWorkoutModal from "./selectworkoutmodal";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  name: string;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
};

type RawSession = {
  id: string;
  started_at: string;
  ended_at: string | null;
  completed: boolean;
  workout_id: string;
};

const SessionsContent = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSelectWorkoutModalOpen, setIsSelectWorkoutModalOpen] =
    useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    try {
      // First query: Get sessions
      const { data: rawSessionsData, error: sessionsError } = await supabase
        .from("workout_sessions")
        .select("id, started_at, ended_at, completed, workout_id")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError.message);
        return;
      }

      if (!rawSessionsData || rawSessionsData.length === 0) {
        setSessions([]);
        return;
      }

      // Get unique workout IDs
      const workoutIds = [
        ...new Set(rawSessionsData.map((session) => session.workout_id)),
      ];

      // Second query: Get workout names
      const { data: workoutsData, error: workoutsError } = await supabase
        .from("workouts")
        .select("id, name")
        .in("id", workoutIds);

      if (workoutsError) {
        console.error("Error fetching workouts:", workoutsError.message);
        return;
      }

      // Create a map of workout IDs to names
      const workoutMap = new Map<string, string>();
      workoutsData?.forEach((workout) => {
        workoutMap.set(workout.id, workout.name);
      });

      // Transform the data
      const transformedSessions = rawSessionsData.map(
        (session: RawSession) => ({
          id: session.id,
          name: workoutMap.get(session.workout_id) || "Unknown Workout",
          started_at: session.started_at,
          ended_at: session.ended_at,
          completed: session.completed || false,
        })
      );

      setSessions(transformedSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    setIsSelectWorkoutModalOpen(true);
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="animate-fade-in-up transition-opacity duration-500 mt-3">
        {/* New Session Button */}
        <div className="px-4 mb-4">
          <button onClick={handleNewSession} className="btn btn-primary w-full">
            <Plus className="size-5 mr-2" />
            New Session
          </button>
        </div>

        {/* Sessions List */}
        <div className="px-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Play className="size-12 text-base-content/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">
                No Sessions
              </h3>
              <p className="text-base-content/60">
                Start your first workout session to track your progress
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  className="btn w-full py-4 text-left bg-base-100 hover:bg-base-200 border border-base-300"
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <Play className="size-5 text-primary mr-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-base-content">
                        {session.name}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {new Date(session.started_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge badge-sm ${
                          session.completed ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {session.completed ? "Completed" : "In Progress"}
                      </span>
                      <ChevronRight className="size-5 text-base-content/40 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Select Workout Modal */}
      <SelectWorkoutModal
        isOpen={isSelectWorkoutModalOpen}
        onClose={() => setIsSelectWorkoutModalOpen(false)}
      />
    </div>
  );
};

export default SessionsContent;
