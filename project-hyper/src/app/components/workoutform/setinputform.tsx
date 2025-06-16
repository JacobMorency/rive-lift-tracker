import AddSetButtons from "@/app/components/workoutform/addsetbuttons";
import { AddSetButtonProps } from "@/app/components/workoutform/addsetbuttons";
import { NullableNumber } from "@/types/workout";

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
  return (
    <div className="px-4">
      <div className="flex gap-1 w-full">
        <div className="flex-1">
          <label htmlFor="reps">Reps</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="reps"
            value={reps !== null ? reps : ""}
            onChange={(e) =>
              setReps(e.target.value !== "" ? parseInt(e.target.value) : null)
            }
            placeholder="0"
            className={`${
              repsEmpty || repsInvalid ? "border-error input" : "input"
            } w-full`}
          />
          {repsEmpty && (
            <p className="text-error italic text-sm">Reps required</p>
          )}
          {repsInvalid && (
            <p className="text-error italic text-sm">Invalid amount of reps</p>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="weight">Weight</label>
          <input
            type="text"
            inputMode="decimal"
            id="weight"
            value={weight !== null ? weight : ""}
            onChange={(e) => {
              const val = e.target.value;
              const parsed = parseFloat(val);
              setWeight(val === "" || isNaN(parsed) ? null : parsed);
            }}
            placeholder="0 (lbs)"
            className={`${
              weightEmpty || weightInvalid ? "border-error input" : "input"
            } w-full`}
          />
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
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="partialReps"
            value={partialReps !== null ? partialReps : ""}
            onChange={(e) =>
              setPartialReps(e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="0 (optional)"
            className={`${
              partialRepsInvalid ? "border-error input" : "input"
            } w-full`}
          />
          {partialRepsInvalid && (
            <p className="text-error italic text-sm">
              Invalid amount of partial reps
            </p>
          )}
        </div>
      </div>
      <div className="mt-3">
        <AddSetButtons {...props} />
      </div>
    </div>
  );
};

export default SetInputForm;
