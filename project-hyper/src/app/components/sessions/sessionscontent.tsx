"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { Plus, Play, ChevronRight } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";

type Session = {
  id: string;
  name: string;
  created_at: string;
  exercise_count: number;
};

type SessionWithExercises = {
  id: string;
  name: string;
  created_at: string;
  workout_exercises: { count: number }[];
};

const SessionsContent = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      // Fetch sessions with exercise count
      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
          id,
          name,
          created_at,
          workout_exercises(count)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sessions:", error.message);
        return;
      }

      // Transform the data to include exercise count
      const sessionsData =
        data?.map((session: SessionWithExercises) => ({
          id: session.id,
          name: session.name,
          created_at: session.created_at,
          exercise_count: session.workout_exercises?.[0]?.count || 0,
        })) || [];

      setSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    // TODO: Implement new session logic
    console.log("Create new session");
  };

  const handleSessionClick = (sessionId: string) => {
    // TODO: Navigate to session details or start session
    console.log("Open session:", sessionId);
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
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-base-content/40">
                        {session.exercise_count}
                      </p>
                      <ChevronRight className="size-5 text-base-content/40 flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsContent;
