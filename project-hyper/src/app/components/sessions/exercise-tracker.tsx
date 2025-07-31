"use client";

import { useState } from "react";
import { Plus, Check, X, ArrowLeft } from "lucide-react";
import { NullableNumber } from "@/types/workout";
import { formatExerciseName } from "@/app/lib/utils";

type Exercise = {
  id: number;
  name: string;
  category: string;
};

type ExerciseSet = {
  id?: string;
  reps: NullableNumber;
  weight: NullableNumber;
  partialReps: NullableNumber;
  set_number: number;
};

type ExerciseTrackerProps = {
  exercise: Exercise;
  onComplete: (sets: ExerciseSet[]) => void;
  onBack: () => void;
  initialSets?: ExerciseSet[];
};

const ExerciseTracker = ({
  exercise,
  onComplete,
  onBack,
  initialSets = [],
}: ExerciseTrackerProps) => {
  const [sets, setSets] = useState<ExerciseSet[]>(initialSets);
  const [currentSet, setCurrentSet] = useState<ExerciseSet>({
    reps: null,
    weight: null,
    partialReps: null,
    set_number: sets.length + 1,
  });
  const [weightIncrement, setWeightIncrement] = useState<number>(5);

  const handleAddSet = () => {
    if (currentSet.reps === null || currentSet.weight === null) {
      return; // Don't add incomplete sets
    }

    const newSet = { ...currentSet };
    setSets([...sets, newSet]);

    // Reset for next set
    setCurrentSet({
      reps: null,
      weight: null,
      partialReps: null,
      set_number: sets.length + 2,
    });
  };

  const handleComplete = () => {
    onComplete(sets);
  };

  const handleCopyLastSet = () => {
    if (sets.length > 0) {
      const lastSet = sets[sets.length - 1];
      setCurrentSet({
        reps: lastSet.reps,
        weight: lastSet.weight,
        partialReps: lastSet.partialReps,
        set_number: sets.length + 1,
      });
    }
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <button onClick={onBack} className="btn btn-ghost btn-sm">
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {formatExerciseName(exercise.name)}
          </h2>
          <p className="text-sm text-base-content/60">{exercise.category}</p>
        </div>
        <button
          onClick={handleComplete}
          className="btn btn-primary btn-sm"
          disabled={sets.length === 0}
        >
          <Check className="size-4" />
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 ">
        {/* Current Set Input */}
        <div className="bg-base-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium mb-3">
            Set {currentSet.set_number}
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Reps */}
            <div>
              <label className="text-xs text-base-content/60">Reps</label>
              <div className="bg-base-100 rounded-lg flex items-center">
                <button
                  type="button"
                  className="px-3 py-2 text-sm hover:bg-base-300 rounded-l"
                  onClick={() => {
                    const newValue = (currentSet.reps || 0) - 1;
                    if (newValue >= 0) {
                      setCurrentSet({ ...currentSet, reps: newValue });
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    currentSet.reps !== null ? currentSet.reps.toString() : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "-") {
                      setCurrentSet({ ...currentSet, reps: null });
                    } else {
                      const parsed = parseInt(value);
                      if (!isNaN(parsed)) {
                        setCurrentSet({ ...currentSet, reps: parsed });
                      }
                    }
                  }}
                  placeholder="0"
                  className="input flex-1 text-center border-none shadow-none p-0 m-0 w-full min-w-0"
                />
                <button
                  type="button"
                  className="px-3 py-2 text-sm hover:bg-base-300 rounded-r"
                  onClick={() =>
                    setCurrentSet({
                      ...currentSet,
                      reps: (currentSet.reps || 0) + 1,
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="text-xs text-base-content/60">
                Weight (lbs)
              </label>
              <div className="bg-base-100 rounded-lg flex items-center">
                <button
                  type="button"
                  className="px-3 py-2 text-sm hover:bg-base-300 rounded-l"
                  onClick={() => {
                    const newValue = (currentSet.weight || 0) - weightIncrement;
                    if (newValue >= 0) {
                      setCurrentSet({ ...currentSet, weight: newValue });
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  inputMode="decimal"
                  value={
                    currentSet.weight !== null
                      ? currentSet.weight.toString()
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "-" || value === ".") {
                      setCurrentSet({ ...currentSet, weight: null });
                    } else {
                      const parsed = parseFloat(value);
                      if (!isNaN(parsed)) {
                        const rounded = Math.floor(parsed * 10) / 10;
                        setCurrentSet({ ...currentSet, weight: rounded });
                      }
                    }
                  }}
                  placeholder="0"
                  className="input flex-1 text-center border-none shadow-none p-0 m-0 w-full min-w-0"
                />
                <button
                  type="button"
                  className="px-3 py-2 text-sm hover:bg-base-300 rounded-r"
                  onClick={() =>
                    setCurrentSet({
                      ...currentSet,
                      weight: (currentSet.weight || 0) + weightIncrement,
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Partial Reps */}
            <div>
              <label className="text-xs text-base-content/60">Partials</label>
              <div className="bg-base-100 rounded-lg flex items-center">
                <button
                  type="button"
                  className="px-3 py-2 text-sm hover:bg-base-300 rounded-l"
                  onClick={() => {
                    const newValue = (currentSet.partialReps || 0) - 1;
                    if (newValue >= 0) {
                      setCurrentSet({ ...currentSet, partialReps: newValue });
                    }
                  }}
                >
                  -
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    currentSet.partialReps !== null
                      ? currentSet.partialReps.toString()
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "-") {
                      setCurrentSet({ ...currentSet, partialReps: null });
                    } else {
                      const parsed = parseInt(value);
                      if (!isNaN(parsed)) {
                        setCurrentSet({ ...currentSet, partialReps: parsed });
                      }
                    }
                  }}
                  placeholder="0"
                  className="input flex-1 text-center border-none shadow-none p-0 m-0 w-full min-w-0"
                />
                <button
                  type="button"
                  className="px-3 py-2 text-sm hover:bg-base-300 rounded-r"
                  onClick={() =>
                    setCurrentSet({
                      ...currentSet,
                      partialReps: (currentSet.partialReps || 0) + 1,
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Weight Increment Tabs */}
          <div className="tabs tabs-xs tabs-box mt-3 bg-base-100">
            <input
              type="radio"
              name="weightIncrement"
              id="increment-2.5"
              value="2.5"
              checked={weightIncrement === 2.5}
              onChange={() => setWeightIncrement(2.5)}
              className="hidden"
            />
            <label
              htmlFor="increment-2.5"
              className={`tab flex-1 ${
                weightIncrement === 2.5 ? "bg-primary text-primary-content" : ""
              }`}
            >
              2.5lbs
            </label>
            <input
              type="radio"
              name="weightIncrement"
              id="increment-5"
              value="5"
              checked={weightIncrement === 5}
              onChange={() => setWeightIncrement(5)}
              className="hidden"
            />
            <label
              htmlFor="increment-5"
              className={`tab flex-1 ${
                weightIncrement === 5 ? "bg-primary text-primary-content" : ""
              }`}
            >
              5lbs
            </label>
            <input
              type="radio"
              name="weightIncrement"
              id="increment-10"
              value="10"
              checked={weightIncrement === 10}
              onChange={() => setWeightIncrement(10)}
              className="hidden"
            />
            <label
              htmlFor="increment-10"
              className={`tab flex-1 ${
                weightIncrement === 10 ? "bg-primary text-primary-content" : ""
              }`}
            >
              10lbs
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddSet}
              disabled={currentSet.reps === null || currentSet.weight === null}
              className="btn btn-primary btn-sm flex-1"
            >
              <Plus className="size-4 mr-1" />
              Add Set
            </button>
            {sets.length > 0 && (
              <button
                onClick={handleCopyLastSet}
                className="btn btn-outline btn-sm"
              >
                Copy Last
              </button>
            )}
          </div>
        </div>

        {/* Completed Sets */}
        {sets.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">
              Completed Sets ({sets.length})
            </h3>
            <div className="space-y-1">
              {sets.map((set, index) => (
                <div
                  key={index}
                  className="bg-base-100 rounded-lg p-3 flex items-center justify-between border border-base-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium bg">
                      Set {set.set_number}
                    </span>
                    <span className="text-sm">{set.reps} reps</span>
                    <span className="text-sm">{set.weight} lbs</span>
                    {set.partialReps && set.partialReps > 0 && (
                      <span className="text-sm text-base-content/60">
                        +{set.partialReps} partials
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeSet(index)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseTracker;
