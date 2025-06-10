"use client";

import AddWorkoutForm from "@/app/components/addworkoutform";
import { useParams, useSearchParams } from "next/navigation";
import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";

const AddWorkoutPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const workoutId = params?.id ? Number(params.id) : null;
  const isEditing = searchParams.get("edit") === "true";

  return (
    <div>
      <ClientLayout header={<PageHeader heading="Add Workout" />}>
        <div className="flex-1 overflow-y-auto">
          {workoutId && (
            <AddWorkoutForm workoutId={workoutId} isEditing={isEditing} />
          )}
        </div>
      </ClientLayout>
    </div>
  );
};

export default AddWorkoutPage;
