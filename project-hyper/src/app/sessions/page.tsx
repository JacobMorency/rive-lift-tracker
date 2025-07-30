import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";

export default function Sessions() {
  return (
    <ClientLayout header={<PageHeader heading="Sessions" />}>
      <div>Sessions</div>
    </ClientLayout>
  );
}
