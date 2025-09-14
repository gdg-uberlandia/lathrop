import SpeakerForm from "../../components/admin/SpeakerForm";
import SpeakersList from "@/components/admin/SpeakersList";
import AdminLayout from "layouts/admin-layout";

function AdminSpeakersPage() {
  return (
    <div>
      <SpeakersList />
    </div>
  );
}

AdminSpeakersPage.layout = AdminLayout;

export default AdminSpeakersPage;
