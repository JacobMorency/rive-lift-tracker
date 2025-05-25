export type Set = {
  reps: number;
  weight: number;
  partialReps: number;
};

export type Exercise = {
  id: number;
  name: string;
};

export type ExercisesInWorkout = {
  id: NullableNumber;
  name: string;
};

export type CompletedSet = {
  exerciseId: NullableNumber;
  exerciseName: string;
  sets: Set[];
};

export type NullableNumber = number | null;
