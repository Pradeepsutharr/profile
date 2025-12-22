import AdminLayout from "../admin-layout";
import EmailThreadPage from "../../../components/admin/emails/thread-page"; // or same file content

export default function Thread() {
  return (
    <AdminLayout>
      <EmailThreadPage />
    </AdminLayout>
  );
}
