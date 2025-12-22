import UserData from "@/components/admin/user-data/user-data";
import AdminLayout from "./admin-layout";

function UserDataManager() {
  return <UserData />;
}
UserDataManager.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default UserDataManager;
