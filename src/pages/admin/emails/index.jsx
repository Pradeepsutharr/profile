import EmailsManager from "@/components/admin/emails/emails";
import AdminLayout from "../admin-layout";

function Emails() {
  return <EmailsManager />;
}

Emails.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Emails;
