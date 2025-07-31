"use client";

import { useAuth } from "@/app/context/authcontext";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, Dumbbell, AlertTriangle } from "lucide-react";
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
  completed: boolean;
};

type ExerciseSet = {
  id?: string;
  reps: NullableNumber;
  weight: NullableNumber;
  partialReps: NullableNumber;
  set_number: number;
};

type RawSession = {
  id: string;
  started_at: string;
  workout_id: string;
  completed: boolean;
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
  sets: ExerciseSet[];
  completed: boolean;
};

type RawExerciseSet = {
  id: string;
  reps: number;
  weight: number;
  partial_reps: number;
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
  const [showCancelModal, setShowCancelModal] = useState(false);
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
        .select("id, started_at, workout_id, completed")
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
          completed: sessionData.completed || false,
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
        completed: sessionData.completed || false,
      });

      // Initialize exercise progress
      const initialProgress = exercises.map((exercise) => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: [],
        completed: false,
      }));
      setExerciseProgress(initialProgress);

      // Load existing exercise data
      await loadExistingExerciseData(exercises);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exerciseIndex: number) => {
    setCurrentExerciseIndex(exerciseIndex);
  };

  const handleExerciseComplete = async (sets: ExerciseSet[]) => {
    if (currentExerciseIndex === null) return;

    const updatedProgress = [...exerciseProgress];
    updatedProgress[currentExerciseIndex] = {
      ...updatedProgress[currentExerciseIndex],
      sets,
      completed: true,
    };
    setExerciseProgress(updatedProgress);
    setCurrentExerciseIndex(null);

    // Save exercise data to database
    await saveExerciseData(currentExerciseIndex, sets);
  };

  const loadExistingExerciseData = async (exercises: Exercise[]) => {
    if (!sessionData) return;

    try {
      // Get all session exercises for this session
      const { data: sessionExercises, error: sessionExercisesError } =
        await supabase
          .from("session_exercises")
          .select(
            `
          id,
          exercise_id,
          order_index,
          exercise_sets (
            id,
            reps,
            weight,
            partial_reps
          )
        `
          )
          .eq("session_id", sessionData.id)
          .order("order_index");

      if (sessionExercisesError) {
        console.error(
          "Error loading session exercises:",
          sessionExercisesError
        );
        return;
      }

      // Update exercise progress with loaded data
      const updatedProgress = [...exerciseProgress];

      sessionExercises?.forEach((sessionExercise) => {
        const exerciseIndex = exercises.findIndex(
          (ex) => ex.id === sessionExercise.exercise_id
        );
        if (exerciseIndex !== -1) {
          const sets: ExerciseSet[] =
            sessionExercise.exercise_sets?.map(
              (set: RawExerciseSet, index: number) => ({
                id: set.id,
                reps: set.reps,
                weight: set.weight,
                partialReps: set.partial_reps,
                set_number: index + 1,
              })
            ) || [];

          updatedProgress[exerciseIndex] = {
            ...updatedProgress[exerciseIndex],
            sets,
            completed: sets.length > 0,
          };
        }
      });

      setExerciseProgress(updatedProgress);
    } catch (error) {
      console.error("Error loading existing exercise data:", error);
    }
  };

  const saveExerciseData = async (
    exerciseIndex: number,
    sets: ExerciseSet[]
  ) => {
    if (!sessionData || !user) return;

    const exercise = sessionData.exercises[exerciseIndex];

    try {
      // First, check if session_exercise record exists
      const { data: existingSessionExercise, error: checkError } =
        await supabase
          .from("session_exercises")
          .select("id")
          .eq("session_id", sessionData.id)
          .eq("exercise_id", exercise.id)
          .single();

      let sessionExerciseData;

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected if no record exists
        console.error("Error checking session exercise:", checkError);
        return;
      }

      if (existingSessionExercise) {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from("session_exercises")
          .update({ order_index: exerciseIndex })
          .eq("id", existingSessionExercise.id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating session exercise:", updateError);
          return;
        }
        sessionExerciseData = updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from("session_exercises")
          .insert({
            session_id: sessionData.id,
            exercise_id: exercise.id,
            order_index: exerciseIndex,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting session exercise:", insertError);
          return;
        }
        sessionExerciseData = insertedData;
      }

      // Delete existing sets for this exercise
      await supabase
        .from("exercise_sets")
        .delete()
        .eq("session_exercise_id", sessionExerciseData.id);

      // Insert new sets
      if (sets.length > 0) {
        const setsToInsert = sets.map((set) => ({
          session_exercise_id: sessionExerciseData.id,
          reps: set.reps,
          weight: set.weight,
          partial_reps: set.partialReps || 0,
        }));

        const { error: setsError } = await supabase
          .from("exercise_sets")
          .insert(setsToInsert);

        if (setsError) {
          console.error("Error saving sets:", setsError);
        }
      }
    } catch (error) {
      console.error("Error saving exercise data:", error);
    }
  };

  const handleBackToExercises = () => {
    setCurrentExerciseIndex(null);
  };

  const handleBack = () => {
    router.push("/sessions");
  };

  const handleCancelSession = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!sessionData || !user) return;

    try {
      // Delete the session from the database
      const { error: deleteError } = await supabase
        .from("workout_sessions")
        .delete()
        .eq("id", sessionData.id);

      if (deleteError) {
        console.error("Error deleting session:", deleteError);
        return;
      }

      // Navigate back to sessions list
      router.push("/sessions");
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const handleDismissCancel = () => {
    setShowCancelModal(false);
  };

  const handleCompleteSession = async () => {
    if (!sessionData || !user) return;

    try {
      // Update the session to mark it as completed
      const { error: updateError } = await supabase
        .from("workout_sessions")
        .update({
          completed: true,
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionData.id);

      if (updateError) {
        console.error("Error completing session:", updateError);
        return;
      }

      // Navigate back to sessions list
      router.push("/sessions");
    } catch (error) {
      console.error("Error completing session:", error);
    }
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
        {/* Session Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleCancelSession}
            className="btn btn-outline btn-error flex-1"
          >
            {sessionData.completed ? "Delete Session" : "Cancel Session"}
          </button>
          <button
            onClick={handleCompleteSession}
            className="btn btn-primary flex-1"
            disabled={exerciseProgress.every((ex) => !ex.completed)}
          >
            Complete Session
          </button>
        </div>

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

      {/* Cancel Session Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="size-6 text-error" />
              <h3 className="text-lg font-semibold">Cancel Session</h3>
            </div>
            <p className="text-base-content/70 mb-6">
              Are you sure you want to cancel this session? This will
              permanently delete the session and all your progress.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDismissCancel}
                className="btn btn-outline flex-1"
              >
                Keep Session
              </button>
              <button
                onClick={handleConfirmCancel}
                className="btn btn-error flex-1"
              >
                Delete Session
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
};

export default SessionPage;
