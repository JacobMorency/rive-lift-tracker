"use client";

import AddWorkoutForm from "@/app/components/addworkoutform";

import { useEffect, useState } from "react";

const AddWorkoutPage = () => {
  const [workoutId, setWorkoutId] = useState(null);

  useEffect(() => {
    const savedWorkoutId = localStorage.getItem("workoutId");
    if (savedWorkoutId) {
      setWorkoutId(savedWorkoutId);
    }
  }, []);

  return (
    <div>
      <h1>Add Workout</h1>
      {workoutId && <AddWorkoutForm workoutId={workoutId} />}
    </div>
  );
};

export default AddWorkoutPage;
