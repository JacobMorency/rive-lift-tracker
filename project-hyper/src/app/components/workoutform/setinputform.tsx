import AddSetButtons from "@/app/components/workoutform/addsetbuttons";
import { AddSetButtonProps } from "@/app/components/workoutform/addsetbuttons";
import { NullableNumber } from "@/types/workout";
import { useState } from "react";

// Imports types for the AddSetButtonProps and new ones for the spread at the bottom
type SetInputFormProps = AddSetButtonProps & {
  reps: NullableNumber;
  weight: NullableNumber;
  partialReps: NullableNumber;
  setReps: (value: NullableNumber) => void;
  setWeight: (value: NullableNumber) => void;
  setPartialReps: (value: NullableNumber) => void;
  repsEmpty: boolean;
  weightEmpty: boolean;
  partialRepsInvalid: boolean;
  weightInvalid: boolean;
  repsInvalid: boolean;
  repsError: string;
  weightError: string;
  partialRepsError: string;
  lastSet?: {
    reps: NullableNumber;
    weight: NullableNumber;
    partialReps: NullableNumber;
  };
  repeatLastSet: boolean;
  setRepeatLastSet: (value: boolean) => void;
  handleAddSet: () => void;
};

const SetInputForm = (props: SetInputFormProps) => {
  const {
    reps,
    weight,
    partialReps,
    setReps,
    setWeight,
    setPartialReps,
    repsEmpty,
    weightEmpty,
    repsError,
    weightError,
    partialRepsError,
    lastSet,
  } = props;
  const [weightIncrement, setWeightIncrement] = useState<number>(5);

  return (
    <div>
      <div className="flex gap-1 w-full">
        <div className="flex-1">
          <label htmlFor="reps">Reps</label>
          <div className="bg-base-200 rounded-lg">
            <div className="flex items-center">
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-l"
                onClick={() => {
                  const newValue = (reps || 0) - 1;
                  if (newValue >= 0) {
                    setReps(newValue);
                  }
                }}
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="reps"
                maxLength={3}
                value={reps !== null ? reps.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || value === "-") {
                    setReps(null);
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      setReps(parsed);
                    }
                  }
                }}
                placeholder="0"
                className={`${
                  repsError ? "border-error input" : "input"
                } flex-1 text-center border-none shadow-none p-0 m-0 w-full min-w-0`}
              />
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-r"
                onClick={() => setReps((reps || 0) + 1)}
              >
                +
              </button>
            </div>
          </div>
          {repsEmpty && (
            <p className="text-error italic text-sm">Reps required</p>
          )}
          {repsError && (
            <p className="text-error italic text-sm">{repsError}</p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="weight">Weight (lbs)</label>
          <div className="bg-base-200 rounded-lg">
            <div className="flex items-center">
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-l"
                onClick={() => {
                  const newValue = (weight || 0) - weightIncrement;
                  if (newValue >= 0) {
                    setWeight(newValue);
                  }
                }}
              >
                -
              </button>
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                id="weight"
                maxLength={6}
                value={weight !== null ? weight.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || value === "-" || value === ".") {
                    setWeight(null);
                  } else {
                    const parsed = parseFloat(value);
                    if (!isNaN(parsed)) {
                      const rounded = Math.floor(parsed * 10) / 10;
                      setWeight(rounded);
                    }
                  }
                }}
                placeholder="0"
                className={`${
                  weightError ? "border-error input" : "input"
                } flex-1 text-center border-none shadow-none p-0 m-0 w-full min-w-0`}
              />
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-r"
                onClick={() => setWeight((weight || 0) + weightIncrement)}
              >
                +
              </button>
            </div>
          </div>
          <div className="tabs tabs-xs tabs-box mt-2">
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
              2.5
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
              5
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
              10
            </label>
          </div>
          <div className="text-xs text-base-content/60 text-center mt-1 mb-2">
            Weight increment
          </div>
          {weightEmpty && (
            <p className="text-error italic text-sm">Weight required</p>
          )}
          {weightError && (
            <p className="text-error italic text-sm">{weightError}</p>
          )}
        </div>
        {/* TODO: Add a help icon and potentially a toggle for partial reps */}
        <div className="flex-1">
          <label htmlFor="partialReps">Partials</label>
          <div className="bg-base-200 rounded-lg">
            <div className="flex items-center">
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-l"
                onClick={() => {
                  const newValue = (partialReps || 0) - 1;
                  if (newValue >= 0) {
                    setPartialReps(newValue);
                  }
                }}
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="partialReps"
                maxLength={3}
                value={partialReps !== null ? partialReps.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || value === "-") {
                    setPartialReps(null);
                  } else {
                    const parsed = parseInt(value);
                    if (!isNaN(parsed)) {
                      setPartialReps(parsed);
                    }
                  }
                }}
                placeholder="0"
                className={`${
                  partialRepsError ? "border-error input" : "input"
                } flex-1 text-center border-none shadow-none p-0 m-0 w-full min-w-0`}
              />
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-r"
                onClick={() => setPartialReps((partialReps || 0) + 1)}
              >
                +
              </button>
            </div>
          </div>
          {partialRepsError && (
            <p className="text-error italic text-sm">{partialRepsError}</p>
          )}
        </div>
      </div>
      <div>
        <AddSetButtons {...props} />
      </div>

      {/* Copy Last Set Button */}
      {lastSet && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setReps(lastSet.reps);
              setWeight(lastSet.weight);
              setPartialReps(lastSet.partialReps);
            }}
            className="btn btn-sm btn-outline btn-primary"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Last Set
          </button>
        </div>
      )}
    </div>
  );
};

export default SetInputForm;
