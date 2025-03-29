import AddWorkoutForm from "../components/AddWorkoutForm";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

const AddWorkoutPage = () => {
  // const { workoutId } = useParams();
  const [workoutId, setWorkoutId] = useState(null);

  useEffect(() => {
    const savedWorkoutId = localStorage.getItem("workoutId");
    if (savedWorkoutId) {
      setWorkoutId(savedWorkoutId);
    }
  }, []);

  return (
    <div>
      <AddWorkoutForm workoutId={workoutId} />
    </div>
  );
};

export default AddWorkoutPage;
