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
      <div className="flex space-x-3">
        <div className="flex-1">
          <label htmlFor="reps">Reps</label>
          <input
            type="number"
            id="reps"
            value={reps !== null ? reps : ""}
            onChange={(e) =>
              setReps(e.target.value !== "" ? parseInt(e.target.value) : null)
            }
            placeholder="0"
            className={
              repsEmpty || repsInvalid ? "border-error input" : "input"
            }
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
            type="number"
            id="weight"
            value={weight !== null ? weight : ""}
            onChange={(e) =>
              setWeight(e.target.value ? parseFloat(e.target.value) : null)
            }
            placeholder="0 (lbs)"
            className={
              weightEmpty || weightInvalid ? "border-error input" : "input"
            }
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
          <label htmlFor="partialReps">Partial Reps</label>
          <input
            type="number"
            id="partialReps"
            value={partialReps !== null ? partialReps : ""}
            onChange={(e) =>
              setPartialReps(e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="0 (optional)"
            className={partialRepsInvalid ? "border-error input" : "input"}
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
