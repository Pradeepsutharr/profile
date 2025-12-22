import Education from "@/components/admin/education/education";
import AdminLayout from "./admin-layout";

function EducationManager() {
  return <Education />;
}

EducationManager.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default EducationManager;
