import Skills from "@/components/admin/skills/skills";
import AdminLayout from "./admin-layout";

function SkillsManager() {
  return <Skills />;
}

SkillsManager.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default SkillsManager;
