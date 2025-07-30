"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, Dumbbell } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";
import { use } from "react";

type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Exercise = {
  id: number;
  name: string;
  category: string;
};

type SessionData = {
  id: string;
  started_at: string;
  workout_id: string;
  workout_name: string;
  exercises: Exercise[];
};

const SessionPage = ({ params }: SessionPageProps) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);

  useEffect(() => {
    if (user && resolvedParams.id) {
      fetchSessionData();
    }
  }, [user, resolvedParams.id]);

  const fetchSessionData = async () => {
    try {
      // Fetch session with workout and exercises
      const { data, error } = await supabase
        .from("workout_sessions")
        .select(
          `
          id,
          started_at,
          workout_id,
          workouts!inner(
            name,
            workout_exercises(
              exercise_id,
              order_index,
              exercise_library(
                id,
                name,
                category
              )
            )
          )
        `
        )
        .eq("id", resolvedParams.id)
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }

      // Transform the data
      const exercises =
        data.workouts.workout_exercises
          ?.sort((a: any, b: any) => a.order_index - b.order_index)
          .map((we: any) => ({
            id: we.exercise_library.id,
            name: we.exercise_library.name,
            category: we.exercise_library.category,
          })) || [];

      setSessionData({
        id: data.id,
        started_at: data.started_at,
        workout_id: data.workout_id,
        workout_name: data.workouts.name,
        exercises,
      });
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/sessions");
  };

  if (loading) {
    return (
      <ClientLayout header={<PageHeader heading="Session" />}>
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </ClientLayout>
    );
  }

  if (!sessionData) {
    return (
      <ClientLayout header={<PageHeader heading="Session Not Found" />}>
        <div className="text-center py-8">
          <p className="text-base-content/60">
            Session not found or you don't have access to it.
          </p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout
      header={
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="btn btn-ghost btn-sm">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">
              {sessionData.workout_name}
            </h1>
            <p className="text-sm text-base-content/60">
              Started {new Date(sessionData.started_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      }
    >
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Exercises ({sessionData.exercises.length})
          </h2>
          <p className="text-base-content/60 text-sm">
            Tap an exercise to start tracking your sets
          </p>
        </div>

        {sessionData.exercises.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="size-12 text-base-content/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">
              No Exercises
            </h3>
            <p className="text-base-content/60">
              This workout template has no exercises
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessionData.exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                className="btn w-full py-4 text-left bg-base-100 hover:bg-base-200 border border-base-300"
                onClick={() => {
                  // TODO: Navigate to exercise tracking
                  console.log("Start tracking exercise:", exercise.name);
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-content rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-base-content">
                        {exercise.name}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {exercise.category}
                      </div>
                    </div>
                  </div>
                  <Play className="size-5 text-base-content/40" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default SessionPage;
