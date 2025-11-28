import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { uploadFileToBucket, deleteFileFromBucket } from "../../lib/storage";

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);

  // FORM STATES
  const [mode, setMode] = useState("list"); // list | create | edit
  const [editingProject, setEditingProject] = useState(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProjects(data || []);
  }

  function resetForm() {
    setTitle("");
    setDesc("");
    setFile(null);
    setEditingProject(null);
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  }

  // ----------------------
  // CREATE PROJECT
  // ----------------------
  async function handleCreate() {
    if (!title.trim()) return alert("Please add title");
    if (!file) return alert("Please choose image");

    setUploading(true);

    try {
      const path = `projects/${Date.now()}_${file.name.replace(/\s/g, "_")}`;

      const { publicUrl, error } = await uploadFileToBucket({
        bucket: "public",
        path,
        file,
      });

      if (error) throw error;

      const { data, error: insertErr } = await supabase
        .from("projects")
        .insert([
          {
            title,
            description: desc,
            images: [publicUrl],
          },
        ]);

      if (insertErr) throw insertErr;

      resetForm();
      setMode("list");
      await loadProjects();
      alert("Project created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setUploading(false);
    }
  }

  // ----------------------
  // LOAD PROJECT INTO FORM FOR EDITING
  // ----------------------
  function openEditForm(project) {
    setEditingProject(project);
    setTitle(project.title);
    setDesc(project.description || "");
    setFile(null);
    setMode("edit");
  }

  // ----------------------
  // UPDATE PROJECT
  // ----------------------
  async function handleUpdate() {
    if (!editingProject) return;

    setUploading(true);

    try {
      let imageUrl = editingProject.images?.[0];

      // If new file is uploaded
      if (file) {
        // delete old image
        if (imageUrl) {
          const parts = imageUrl.split("/storage/v1/object/public/")[1];
          if (parts) {
            const [bucket, ...rest] = parts.split("/");
            await deleteFileFromBucket({
              bucket,
              path: rest.join("/"),
            });
          }
        }

        // upload new file
        const path = `projects/${Date.now()}_${file.name.replace(/\s/g, "_")}`;
        const uploadRes = await uploadFileToBucket({
          bucket: "public",
          path,
          file,
        });

        if (uploadRes.error) throw uploadRes.error;
        imageUrl = uploadRes.publicUrl;
      }

      const { error: updateErr } = await supabase
        .from("projects")
        .update({
          title,
          description: desc,
          images: [imageUrl],
        })
        .eq("id", editingProject.id);

      if (updateErr) throw updateErr;

      resetForm();
      setMode("list");
      await loadProjects();
      alert("Project updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setUploading(false);
    }
  }

  // ----------------------
  // DELETE PROJECT
  // ----------------------
  async function handleDelete(project) {
    if (!confirm("Delete this project?")) return;

    try {
      const imageUrl = project.images?.[0];

      if (imageUrl) {
        const parts = imageUrl.split("/storage/v1/object/public/")[1];
        if (parts) {
          const [bucket, ...rest] = parts.split("/");
          await deleteFileFromBucket({
            bucket,
            path: rest.join("/"),
          });
        }
      }

      await supabase.from("projects").delete().eq("id", project.id);
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  // ----------------------
  // FORM UI COMPONENT
  // ----------------------
  function ProjectForm({ submitText, onSubmit }) {
    return (
      <div style={{ border: "1px solid #eee", padding: 16, marginBottom: 20 }}>
        <h3>{submitText}</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ width: 180, marginTop: 10 }}
          />
        )}

        {editingProject && !file && editingProject.images?.[0] && (
          <img
            src={editingProject.images[0]}
            alt="current"
            style={{ width: 180, marginTop: 10 }}
          />
        )}

        <button
          disabled={uploading}
          onClick={onSubmit}
          style={{ marginTop: 15 }}
        >
          {uploading ? "Saving..." : submitText}
        </button>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setMode("list");
          }}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // ----------------------
  // MAIN UI
  // ----------------------
  return (
    <div>
      {mode === "list" ? (
        <div className="flex items-center mb-5">
          <h2 className="text-main text-xl font-semibold">
            Projects Management
          </h2>
          <button
            onClick={() => setMode("create")}
            className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
          >
            + New Project
          </button>
        </div>
      ) : (
        <div className="flex">
          <h2 className="text-main text-xl font-semibold">
            Projects Management
          </h2>
        </div>
      )}
      {mode === "list" && (
        <>
          <ul style={{ padding: 0 }}>
            {projects.map((p) => (
              <li
                key={p.id}
                style={{
                  listStyle: "none",
                  padding: 10,
                  border: "1px solid #ddd",
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  onClick={() => openEditForm(p)}
                  style={{ cursor: "pointer" }}
                >
                  <strong>{p.title}</strong>
                  <br />
                  {p.images?.[0] && (
                    <img
                      src={p.images[0]}
                      alt=""
                      style={{ width: 120, marginTop: 5 }}
                    />
                  )}
                </div>

                <button
                  onClick={() => handleDelete(p)}
                  style={{ background: "red", color: "white" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {mode === "create" && (
        <ProjectForm submitText="Create Project" onSubmit={handleCreate} />
      )}

      {mode === "edit" && (
        <ProjectForm submitText="Update Project" onSubmit={handleUpdate} />
      )}
    </div>
  );
}
