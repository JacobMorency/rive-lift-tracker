import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";
import WorkoutsContent from "@/app/components/workouts/workoutscontent";

const Workouts = () => {
  return (
    <ClientLayout header={<PageHeader heading="Workouts" />}>
      <WorkoutsContent />
    </ClientLayout>
  );
};

export default Workouts;
