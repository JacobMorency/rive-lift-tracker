const CompletedExerciseList = ({ exercisesInWorkout }) => {
  return (
    <div>
      <h3 className="font-bold text-lg my-3">
        Exercises Completed This Workout:
      </h3>
      <ul>
        {exercisesInWorkout.length > 0 ? (
          exercisesInWorkout.map((exercise) => (
            <li key={exercise.id}>{exercise.name}</li>
          ))
        ) : (
          <li>No exercises completed yet.</li>
        )}
      </ul>
    </div>
  );
};

export default CompletedExerciseList;
