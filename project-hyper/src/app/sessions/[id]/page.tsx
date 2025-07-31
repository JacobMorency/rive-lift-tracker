"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, Dumbbell } from "lucide-react";
import supabase from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";
import ExerciseTracker from "@/app/components/sessions/exercise-tracker";
import { use } from "react";
import { NullableNumber } from "@/types/workout";
import { formatExerciseName } from "@/app/lib/utils";

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

type Set = {
  id?: number;
  reps: NullableNumber;
  weight: NullableNumber;
  partialReps: NullableNumber;
  set_number: number;
};

type RawSession = {
  id: string;
  started_at: string;
  workout_id: string;
};

type RawWorkoutExercise = {
  exercise_id: number;
  order_index: number;
};

type RawExercise = {
  id: number;
  name: string;
  category: string;
};

type ExerciseProgress = {
  exerciseId: number;
  exerciseName: string;
  sets: Set[];
  completed: boolean;
};

const SessionPage = ({ params }: SessionPageProps) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<
    number | null
  >(null);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>(
    []
  );
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
      // First query: Fetch session data
      const { data: sessionData, error: sessionError } = await supabase
        .from("workout_sessions")
        .select("id, started_at, workout_id")
        .eq("id", resolvedParams.id)
        .eq("user_id", user?.id)
        .single();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        return;
      }

      // Second query: Fetch workout name
      const { data: workoutData, error: workoutError } = await supabase
        .from("workouts")
        .select("name")
        .eq("id", sessionData.workout_id)
        .single();

      if (workoutError) {
        console.error("Error fetching workout:", workoutError.message);
        return;
      }

      // Third query: Fetch workout exercises
      const { data: workoutExercisesData, error: workoutExercisesError } =
        await supabase
          .from("workout_exercises")
          .select("exercise_id, order_index")
          .eq("workout_id", sessionData.workout_id)
          .order("order_index", { ascending: true });

      if (workoutExercisesError) {
        console.error(
          "Error fetching workout exercises:",
          workoutExercisesError.message
        );
        return;
      }

      if (!workoutExercisesData || workoutExercisesData.length === 0) {
        setSessionData({
          id: sessionData.id,
          started_at: sessionData.started_at,
          workout_id: sessionData.workout_id,
          workout_name: workoutData.name,
          exercises: [],
        });
        return;
      }

      // Get unique exercise IDs
      const exerciseIds = workoutExercisesData.map((we) => we.exercise_id);

      // Fourth query: Fetch exercise details
      const { data: exercisesData, error: exercisesError } = await supabase
        .from("exercise_library")
        .select("id, name, category")
        .in("id", exerciseIds);

      if (exercisesError) {
        console.error("Error fetching exercises:", exercisesError.message);
        return;
      }

      // Create a map of exercise IDs to exercise details
      const exerciseMap = new Map<number, RawExercise>();
      exercisesData?.forEach((exercise) => {
        exerciseMap.set(exercise.id, exercise);
      });

      // Transform the exercises data
      const exercises = workoutExercisesData
        .map((we: RawWorkoutExercise) => {
          const exercise = exerciseMap.get(we.exercise_id);
          return exercise
            ? {
                id: exercise.id,
                name: exercise.name,
                category: exercise.category,
              }
            : null;
        })
        .filter((exercise): exercise is Exercise => exercise !== null);

      setSessionData({
        id: sessionData.id,
        started_at: sessionData.started_at,
        workout_id: sessionData.workout_id,
        workout_name: workoutData.name,
        exercises,
      });

      // Initialize exercise progress
      const initialProgress = exercises.map((exercise) => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: [],
        completed: false,
      }));
      setExerciseProgress(initialProgress);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exerciseIndex: number) => {
    setCurrentExerciseIndex(exerciseIndex);
  };

  const handleExerciseComplete = (sets: Set[]) => {
    if (currentExerciseIndex === null) return;

    const updatedProgress = [...exerciseProgress];
    updatedProgress[currentExerciseIndex] = {
      ...updatedProgress[currentExerciseIndex],
      sets,
      completed: true,
    };
    setExerciseProgress(updatedProgress);
    setCurrentExerciseIndex(null);
  };

  const handleBackToExercises = () => {
    setCurrentExerciseIndex(null);
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
            Session not found or you don&apos;t have access to it.
          </p>
        </div>
      </ClientLayout>
    );
  }

  // If we're tracking an exercise, show the exercise tracker
  if (currentExerciseIndex !== null) {
    const exercise = sessionData.exercises[currentExerciseIndex];
    const progress = exerciseProgress[currentExerciseIndex];

    return (
      <ClientLayout header={<PageHeader heading="Session" />}>
        <ExerciseTracker
          exercise={exercise}
          onComplete={handleExerciseComplete}
          onBack={handleBackToExercises}
          initialSets={progress.sets}
        />
      </ClientLayout>
    );
  }

  // Show exercise list
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
      <div className="p-2">
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
            {sessionData.exercises.map((exercise, index) => {
              const progress = exerciseProgress[index];
              const isCompleted = progress?.completed;
              const setCount = progress?.sets.length || 0;

              return (
                <button
                  key={exercise.id}
                  className="btn w-full py-4 text-left bg-base-100 hover:bg-base-200 border border-base-300"
                  onClick={() => handleExerciseClick(index)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 text-left">
                      <div className="font-medium text-base-content">
                        {formatExerciseName(exercise.name)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="badge badge-success badge-sm">
                          {setCount} sets
                        </span>
                      )}
                      <Play className="size-5 text-base-content/40" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default SessionPage;
