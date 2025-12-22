import Services from "@/components/admin/services/services";
import AdminLayout from "./admin-layout";

function ServiceManager() {
  return <Services />;
}
ServiceManager.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default ServiceManager;
