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
    partialRepsInvalid,
    weightInvalid,
    repsInvalid,
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
                onClick={() => setReps((reps || 0) - 1)}
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="reps"
                value={reps !== null ? reps : ""}
                onChange={(e) =>
                  setReps(
                    e.target.value !== "" ? parseInt(e.target.value) : null
                  )
                }
                placeholder="0"
                className={`${
                  repsEmpty || repsInvalid ? "border-error input" : "input"
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
          {repsInvalid && (
            <p className="text-error italic text-sm">Invalid amount of reps</p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="weight">Weight (lbs)</label>
          <div className="bg-base-200 rounded-lg">
            <div className="flex items-center">
              <button
                type="button"
                className="px-4 py-1 text-sm hover:bg-base-300 rounded-l"
                onClick={() => setWeight((weight || 0) - weightIncrement)}
              >
                -
              </button>
              <input
                type="number"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                id="weight"
                value={weight !== null ? weight : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = parseFloat(val);
                  if (val === "" || isNaN(parsed)) {
                    setWeight(null);
                  } else {
                    const rounded = Math.floor(parsed * 10) / 10;
                    setWeight(rounded);
                  }
                }}
                placeholder="0"
                className={`${
                  weightEmpty || weightInvalid ? "border-error input" : "input"
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
          {weightEmpty && (
            <p className="text-error italic text-sm">Weight required</p>
          )}
          {weightInvalid && (
            <p className="text-error italic text-sm">
              Invalid amount of weight
            </p>
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
                onClick={() => setPartialReps((partialReps || 0) - 1)}
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="partialReps"
                value={partialReps !== null ? partialReps : ""}
                onChange={(e) =>
                  setPartialReps(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="0"
                className={`${
                  partialRepsInvalid ? "border-error input" : "input"
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
          {partialRepsInvalid && (
            <p className="text-error italic text-sm">
              Invalid amount of partial reps
            </p>
          )}
        </div>
      </div>
      {/* <div className="mt-3">
        <QuickActionButtons
          reps={reps}
          weight={weight}
          setReps={setReps}
          setWeight={setWeight}
          setPartialReps={setPartialReps}
          lastSet={props.lastSet}
          repeatLastSet={props.repeatLastSet}
          setRepeatLastSet={props.setRepeatLastSet}
        />
      </div> */}
      <div className="mt-3">
        <AddSetButtons {...props} />
      </div>
    </div>
  );
};

export default SetInputForm;
