import { NullableNumber } from "@/types/workout";
import { useEffect } from "react";

type QuickActionButtonsProps = {
  reps: NullableNumber;
  weight: NullableNumber;
  setReps: (value: NullableNumber) => void;
  setWeight: (value: NullableNumber) => void;
  setPartialReps: (value: NullableNumber) => void;
  lastSet?: {
    reps: NullableNumber;
    weight: NullableNumber;
    partialReps: NullableNumber;
  };
  repeatLastSet: boolean;
  setRepeatLastSet: (value: boolean) => void;
};

const QuickActionButtons = ({
  reps,
  weight,
  setReps,
  setWeight,
  setPartialReps,
  lastSet,
  repeatLastSet,
  setRepeatLastSet,
}: QuickActionButtonsProps) => {
  // Auto-fill form when toggle is enabled and there's a last set
  useEffect(() => {
    if (repeatLastSet && lastSet) {
      setReps(lastSet.reps);
      setWeight(lastSet.weight);
      setPartialReps(lastSet.partialReps);
    }
  }, [repeatLastSet, lastSet, setReps, setWeight, setPartialReps]);

  const handleRepsChange = (delta: number) => {
    const currentReps = reps || 0;
    const newReps = Math.max(0, currentReps + delta);
    setReps(newReps);
  };

  const handleWeightChange = (delta: number) => {
    const currentWeight = weight || 0;
    const newWeight = Math.max(0, currentWeight + delta);
    setWeight(newWeight);
  };

  const handleRepeatLastSetToggle = () => {
    setRepeatLastSet(!repeatLastSet);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          className="btn btn-sm btn-outline w-20"
          onClick={() => handleRepsChange(1)}
        >
          +1 Rep
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline w-20"
          onClick={() => handleRepsChange(-1)}
        >
          -1 Rep
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline w-20"
          onClick={() => handleWeightChange(5)}
        >
          +5lb
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline w-20"
          onClick={() => handleWeightChange(-5)}
        >
          -5lb
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline w-20"
          onClick={() => handleWeightChange(10)}
        >
          +10lb
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline w-20"
          onClick={() => handleWeightChange(-10)}
        >
          -10lb
        </button>
      </div>
      {lastSet && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="repeat-last-set-toggle"
            checked={repeatLastSet}
            onChange={handleRepeatLastSetToggle}
            className="checkbox checkbox-sm"
          />
          <label
            htmlFor="repeat-last-set-toggle"
            className="cursor-pointer text-sm"
          >
            Repeat last set values
          </label>
        </div>
      )}
    </div>
  );
};

export default QuickActionButtons;
