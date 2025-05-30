export type Set = {
  id: number;
  workout_exercise_id: number | null;
  set_number: number | null;
  weight: number | null;
  reps: number | null;
  partial_reps: number | null;
  exercise_name: string | null;
  workout_id: number | null;
};

export type Exercise = {
  id: number;
  name: string;
};

export type ExercisesInWorkout = {
  id: NullableNumber;
  name: string;
};

export type NullableNumber = number | null;

export type Workout = {
  id: number;
  user_id: string;
  date: string; // ISO date string
  is_complete: boolean;
};
