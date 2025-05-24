const AddExerciseButton = ({
  handleAddExerciseToWorkout,
  isSetUpdating,
  sets,
  isExerciseUpdating,
}) => {
  return (
    <div className="px-4">
      {isExerciseUpdating ? (
        <div>
          <button
            className="w-full btn btn-primary"
            type="button"
            onClick={handleAddExerciseToWorkout}
            disabled={sets.length === 0 || isSetUpdating}
          >
            Update Exercise
          </button>
        </div>
      ) : (
        <button
          className="w-full btn btn-primary"
          type="button"
          onClick={handleAddExerciseToWorkout}
          disabled={sets.length === 0 || isSetUpdating}
        >
          Add Exercise to Workout
        </button>
      )}
    </div>
  );
};

export default AddExerciseButton;
