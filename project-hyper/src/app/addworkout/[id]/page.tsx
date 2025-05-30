"use client";

import AddWorkoutForm from "@/app/components/addworkoutform";
import { useParams } from "next/navigation";
import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";

const AddWorkoutPage = () => {
  const params = useParams();
  const workoutId = params?.id ? Number(params.id) : null;

  return (
    <div>
      <ClientLayout header={<PageHeader heading="Add Workout" />}>
        <div className="flex-1 flex flex-col">
          {workoutId && <AddWorkoutForm workoutId={workoutId} />}
        </div>
      </ClientLayout>
    </div>
  );
};

export default AddWorkoutPage;
