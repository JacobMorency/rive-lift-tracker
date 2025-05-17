import DashboardHeader from "@/app/components/dashboard/dashboardheader";
import DashboardContent from "@/app/components/dashboard/dashboardcontent";
import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";

const Dashboard = () => {
  return (
    <ClientLayout header={<PageHeader heading="Dashboard" />}>
      <DashboardHeader />
      <DashboardContent />
    </ClientLayout>
  );
};

export default Dashboard;
