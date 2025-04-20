import AddSetButtons from "./AddSetButtons";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
const SetInputForm = (props) => {
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
    <div>
      <div className="flex space-x-3 my-3">
        <div className="my-3">
          <Label htmlFor="reps">Reps</Label>
          <Input
            type="number"
            id="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            className={repsEmpty || repsInvalid ? "border-error" : ""}
          />
          {repsEmpty && (
            <p className="text-error italic text-sm">Reps required</p>
          )}
          {repsInvalid && (
            <p className="text-error italic text-sm">Invalid amount of reps</p>
          )}
        </div>
        <div className="my-3">
          <Label htmlFor="weight">Weight</Label>
          <Input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0 (lbs)"
            className={weightEmpty || weightInvalid ? "border-error" : ""}
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
        <div className="my-3">
          <Label htmlFor="partialReps">Partial Reps</Label>
          <Input
            type="number"
            id="partialReps"
            value={partialReps}
            onChange={(e) => setPartialReps(e.target.value)}
            placeholder="0 (optional)"
            className={partialRepsInvalid ? "border-error" : ""}
          />
          {partialRepsInvalid && (
            <p className="text-error italic text-sm">
              Invalid amount of partial reps
            </p>
          )}
        </div>
      </div>
      <AddSetButtons {...props} />
    </div>
  );
};

export default SetInputForm;
