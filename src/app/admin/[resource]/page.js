import { notFound } from "next/navigation";
import { AppearanceManager, ProfileManager, ResourceManager } from "@/components/admin/admin-manager";
import { adminResources } from "@/lib/site-config";

export default async function AdminResourcePage({ params }) { const { resource } = await params; if (resource === "profile") return <ProfileManager />; if (resource === "appearance") return <AppearanceManager />; if (!adminResources[resource]) notFound(); return <ResourceManager resource={resource} />; }
