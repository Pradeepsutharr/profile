import BlogsManager from "@/components/admin/blogs/blogs";
import AdminLayout from "./admin-layout";

function BlogsManagerPage() {
  return <BlogsManager />;
}

BlogsManagerPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default BlogsManagerPage;
