import Experience from "@/components/admin/experience/experience";
import AdminLayout from "./admin-layout";

function ExperienceManager() {
  return <Experience />;
}

ExperienceManager.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default ExperienceManager;
