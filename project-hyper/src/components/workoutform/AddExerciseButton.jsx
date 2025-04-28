import { Button } from "../ui/button";

const AddExerciseButton = ({
  handleAddExerciseToWorkout,
  isSetUpdating,
  sets,
  isExerciseUpdating,
}) => {
  return (
    <div>
      {isExerciseUpdating ? (
        <div>
          <Button
            className="w-full my-3"
            type="button"
            onClick={handleAddExerciseToWorkout}
            disabled={sets.length === 0 || isSetUpdating}
          >
            Update Exercise
          </Button>
        </div>
      ) : (
        <Button
          className="w-full my-3"
          type="button"
          onClick={handleAddExerciseToWorkout}
          disabled={sets.length === 0 || isSetUpdating}
        >
          Add Exercise to Workout
        </Button>
      )}
    </div>
  );
};

export default AddExerciseButton;
