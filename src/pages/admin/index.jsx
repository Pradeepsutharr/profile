import AdminLayout from "./admin-layout";
import ProjectsManager from "./projects-manager";

function AdminHome() {
  return <ProjectsManager />;
}

AdminHome.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminHome;
