"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import SelectWorkoutModal from "./selectworkoutmodal";
import SessionTabs from "./sessiontabs";

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
        <SessionTabs sessions={sessions} />
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
