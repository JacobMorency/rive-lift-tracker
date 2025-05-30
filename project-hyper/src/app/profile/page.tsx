import ProfileCard from "@/app/components/profile/profilecard";
import ClientLayout from "@/app/components/clientlayout";
import PageHeader from "@/app/components/pageheader";

const Profile = () => {
  return (
    <ClientLayout header={<PageHeader heading="Profile" />}>
      <ProfileCard />
    </ClientLayout>
  );
};

export default Profile;
