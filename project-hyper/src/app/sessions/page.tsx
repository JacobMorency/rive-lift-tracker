import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";
import SessionsContent from "@/app/components/sessions/sessionscontent";

export default function Sessions() {
  return (
    <ClientLayout header={<PageHeader heading="Sessions" />}>
      <SessionsContent />
    </ClientLayout>
  );
}
