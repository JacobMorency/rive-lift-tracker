import AddWorkoutForm from "../components/AddWorkoutForm";
import { useParams } from "react-router-dom";

const AddWorkoutPage = () => {
  const { workoutId } = useParams();
  return (
    <div>
      <AddWorkoutForm workoutId={workoutId} />
    </div>
  );
};

export default AddWorkoutPage;
