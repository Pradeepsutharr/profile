// components/admin/projects-manager.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFileToBucket, deleteFileFromBucket } from "../../../lib/storage";
import { Trash2, Upload, Move, GripHorizontal } from "lucide-react";

/* Utility: slugify */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

/* Helper to build tech field as array or string */
function buildTechValue(techInput, preferArray = true) {
  if (!techInput) return null;
  const arr = techInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (preferArray) return arr.length ? arr : null;
  return arr.length ? arr.join(", ") : null;
}

/**
 * ProjectsManager
 */
export default function Projects() {
  const [projects, setProjects] = useState([]);
  // modal + editing context
  const [mode, setMode] = useState("list"); // list | create | edit
  const [editingProject, setEditingProject] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);

  // drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragStartIndexRef = useRef(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if ((mode === "create" || mode === "edit") && e.key === "Escape")
        closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  // Load projects ordered by `order` ascending (then fallback to created_at)
  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadProjects error", error);
      return;
    }

    // Ensure each project has numeric order (if db returned null)
    const normalized = (data || []).map((p, i) => ({
      ...p,
      order: typeof p.order === "number" ? p.order : i + 1,
    }));

    setProjects(normalized);
  }

  // Helper to persist order array to Supabase
  async function persistOrder(newOrderedProjects) {
    try {
      // Map id -> order
      // We will update each project's order to its index+1
      const updates = newOrderedProjects.map((p, idx) =>
        supabase
          .from("projects")
          .update({ order: idx + 1 })
          .eq("id", p.id)
      );
      // Run updates in parallel
      const results = await Promise.all(updates);

      // check for errors
      const err = results.find((r) => r.error);
      if (err?.error) {
        console.error("persistOrder error", err.error);
        throw err.error;
      }

      // reload (or optimistically set state)
      await loadProjects();
    } catch (e) {
      console.error("persistOrder failed", e);
      alert("Failed to save order: " + (e?.message || e));
    } finally {
      setDraggingId(null);
      setDragOverId(null);
    }
  }

  // ---------------- CREATE ----------------
  async function handleCreate(form) {
    if (!form.title?.trim()) return alert("Please add a title");
    setUploading(true);

    try {
      // upload bg + files (same as your current logic)
      let bgUrl = null;
      if (form.bgFile) {
        setBgUploading(true);
        const path = `projects/bg_${Date.now()}_${form.bgFile.name.replace(
          /\s/g,
          "_"
        )}`;
        const up = await uploadFileToBucket({
          bucket: "portfolio",
          path,
          file: form.bgFile,
        });
        setBgUploading(false);
        if (up?.error) throw up.error;
        bgUrl = up.publicUrl;
      }

      const uploadedProjectUrls = [];
      for (let i = 0; i < (form.projectFiles || []).length; i++) {
        const f = form.projectFiles[i];
        const path = `projects/images/${Date.now()}_${i}_${f.name.replace(
          /\s/g,
          "_"
        )}`;
        const up = await uploadFileToBucket({
          bucket: "portfolio",
          path,
          file: f,
        });
        if (up.error) throw up.error;
        const url =
          up.publicUrl ??
          (up.raw?.path ? await getUrlForPath("portfolio", up.raw.path) : null);
        if (!url)
          throw new Error(
            "Failed to get a usable URL for uploaded file: " + f.name
          );
        uploadedProjectUrls.push(url);
      }

      // determine order: max(order) + 1 locally (fallback to length+1)
      const maxOrder = projects.reduce(
        (m, p) => (typeof p.order === "number" && p.order > m ? p.order : m),
        0
      );
      const assignedOrder = maxOrder + 1 || projects.length + 1;

      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        tags: form.tagsInput
          ? form.tagsInput
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : null,
        bg_image: bgUrl || null,
        project_images: uploadedProjectUrls.length ? uploadedProjectUrls : null,
        link: form.link || null,
        tech_stack: buildTechValue(form.techInput, true),
        category: form.category || null,
        slug: form.slug ? slugify(form.slug) : slugify(form.title),
        order: assignedOrder,
      };

      console.log("Inserting project payload:", payload);

      const res = await supabase.from("projects").insert([payload]).select();
      console.log("create result raw:", res);

      if (res.error) {
        console.error("Supabase insert error:", res.error);
        if (
          res.error?.message?.toLowerCase().includes("column") ||
          res.error?.message?.toLowerCase().includes("datatype")
        ) {
          console.log("Retrying insert with tech_stack as string...");
          const payload2 = {
            ...payload,
            tech_stack: buildTechValue(form.techInput, false),
          };
          const res2 = await supabase
            .from("projects")
            .insert([payload2])
            .select();
          if (res2.error) throw res2.error;
          if (
            !res2.data ||
            (Array.isArray(res2.data) && res2.data.length === 0)
          ) {
            throw new Error("Insert succeeded but returned no rows.");
          }
        } else {
          throw res.error;
        }
      } else {
        if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
          throw new Error("Insert succeeded but returned no rows.");
        }
      }

      closeModal();
      await loadProjects();

      await fetch("/api/ping-sitemap", { method: "POST" });

      alert("Project created");
    } catch (err) {
      console.error("handleCreate error:", err);
      alert("Create failed: " + (err?.message || err));
    } finally {
      setUploading(false);
      setBgUploading(false);
    }
  }

  // ---------------- UPDATE ---------------- (unchanged except we keep order field)
  async function handleUpdate(form) {
    if (!editingProject) return alert("No project selected");
    setUploading(true);

    try {
      let bgUrl = editingProject.bg_image || null;

      if (form.bgFile) {
        if (bgUrl && bgUrl.includes("/storage/v1/object/public/")) {
          const parts = bgUrl.split("/storage/v1/object/public/")[1];
          if (parts) {
            const [bucket, ...rest] = parts.split("/");
            await deleteFileFromBucket({ bucket, path: rest.join("/") }).catch(
              (e) => console.warn("bg delete err", e)
            );
          }
        }
        setBgUploading(true);
        const path = `projects/bg_${Date.now()}_${form.bgFile.name.replace(
          /\s/g,
          "_"
        )}`;
        const up = await uploadFileToBucket({
          bucket: "portfolio",
          path,
          file: form.bgFile,
        });
        setBgUploading(false);
        if (up?.error) throw up.error;
        bgUrl = up.publicUrl;
      }

      const newlyUploaded = [];
      if (form.projectFiles && form.projectFiles.length) {
        for (let i = 0; i < form.projectFiles.length; i++) {
          const f = form.projectFiles[i];
          const path = `projects/images/${Date.now()}_${i}_${f.name.replace(
            /\s/g,
            "_"
          )}`;
          const up = await uploadFileToBucket({
            bucket: "portfolio",
            path,
            file: f,
          });
          if (up?.error) throw up.error;
          newlyUploaded.push(up.publicUrl);
        }
      }

      const finalUrls = (form.projectImages || [])
        .filter(Boolean)
        .map((u) => (typeof u === "string" ? u : null))
        .filter(Boolean);
      const resultImages = [...finalUrls, ...newlyUploaded];

      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        tags: form.tagsInput
          ? form.tagsInput
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : null,
        bg_image: bgUrl || null,
        project_images: resultImages.length ? resultImages : null,
        link: form.link || null,
        tech_stack: buildTechValue(form.techInput, true),
        category: form.category || null,
        slug: form.slug ? slugify(form.slug) : slugify(form.title),
        // keep order untouched here (we don't change order during normal update)
      };

      console.log("Updating project payload:", payload);

      const res = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id)
        .select();
      console.log("update result raw:", res);

      if (res.error) {
        console.error("Supabase update error:", res.error);
        if (
          res.error?.message?.toLowerCase().includes("column") ||
          res.error?.message?.toLowerCase().includes("datatype")
        ) {
          console.log("Retrying update with tech_stack as string...");
          const payload2 = {
            ...payload,
            tech_stack: buildTechValue(form.techInput, false),
          };
          const res2 = await supabase
            .from("projects")
            .update(payload2)
            .eq("id", editingProject.id)
            .select();
          if (res2.error) throw res2.error;
          if (
            !res2.data ||
            (Array.isArray(res2.data) && res2.data.length === 0)
          ) {
            throw new Error(
              "Update returned no rows. Check RLS / permissions or matching id."
            );
          }
        } else {
          throw res.error;
        }
      } else {
        if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
          throw new Error(
            "Update returned no rows. Check RLS / permissions or matching id."
          );
        }
      }

      closeModal();
      await loadProjects();

      await fetch("/api/ping-sitemap", { method: "POST" });

      alert("Project updated");
    } catch (err) {
      console.error("handleUpdate error:", err);
      alert("Update failed: " + (err?.message || err));
    } finally {
      setUploading(false);
      setBgUploading(false);
    }
  }

  // ---------------- Delete ---------------- (unchanged)
  async function handleDelete(project, e) {
    e?.stopPropagation?.();
    if (!confirm("Delete this project?")) return;
    try {
      if (
        project.bg_image &&
        project.bg_image.includes("/storage/v1/object/public/")
      ) {
        const parts = project.bg_image.split("/storage/v1/object/public/")[1];
        if (parts) {
          const [bucket, ...rest] = parts.split("/");
          await deleteFileFromBucket({ bucket, path: rest.join("/") }).catch(
            (e) => console.warn("bg delete err", e)
          );
        }
      }
      if (project.project_images && Array.isArray(project.project_images)) {
        for (const img of project.project_images) {
          if (img && img.includes("/storage/v1/object/public/")) {
            const parts = img.split("/storage/v1/object/public/")[1];
            if (parts) {
              const [bucket, ...rest] = parts.split("/");
              await deleteFileFromBucket({
                bucket,
                path: rest.join("/"),
              }).catch((e) => console.warn("img delete err", e));
            }
          }
        }
      }
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);
      if (error) throw error;
      await loadProjects();
      if (editingProject?.id === project.id) closeModal();
    } catch (err) {
      console.error("handleDelete error:", err);
      alert("Delete failed");
    }
  }

  function openCreateForm() {
    setEditingProject(null);
    setMode("create");
  }

  function openEditForm(project) {
    setEditingProject(project);
    setMode("edit");
  }

  function closeModal() {
    setEditingProject(null);
    setMode("list");
  }

  // static categories (unchanged)
  const STATIC_CATEGORIES = [
    "Web Development",
    "Ui-Ux Design",
    "Web Design",
    "Product Design",
    "Branding",
    "Other",
  ];

  // compute tech options from loaded projects (unchanged)
  const techOptions = Array.from(
    new Set(
      (projects || []).flatMap((p) => {
        if (!p.tech_stack) return [];
        if (Array.isArray(p.tech_stack)) return p.tech_stack;
        // if stored as string like "React,Node"
        return p.tech_stack
          .toString()
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      })
    )
  );

  // ---------------- Drag & Drop Handlers ----------------
  function onDragStart(e, p, index) {
    e.stopPropagation();
    setDraggingId(p.id);
    dragStartIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    // required for Firefox
    try {
      e.dataTransfer.setData("text/plain", p.id);
    } catch (err) {}
  }

  function onDragOver(e, p, index) {
    e.preventDefault();
    // show that we can drop
    setDragOverId(p.id);
    e.dataTransfer.dropEffect = "move";
  }

  function onDragLeave(e) {
    e.stopPropagation();
    setDragOverId(null);
  }

  function onDrop(e, targetProject, targetIndex) {
    e.preventDefault();
    e.stopPropagation();
    const draggedId =
      draggingId ??
      (() => {
        try {
          return e.dataTransfer.getData("text/plain");
        } catch (err) {
          return null;
        }
      })();

    if (!draggedId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    if (draggedId === targetProject.id) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    // compute new order array
    const current = [...projects];
    const fromIndex = current.findIndex((x) => x.id === draggedId);
    if (fromIndex === -1) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }
    const [movedItem] = current.splice(fromIndex, 1);
    // insert at targetIndex (we'll place before the target)
    let insertAt = targetIndex;
    // if dragged item was above target and we removed earlier item, keep insertAt as is
    current.splice(insertAt, 0, movedItem);

    // set state optimistically and persist
    setProjects(current);
    persistOrder(current);
  }

  // ---------------- UI ----------------
  return (
    <div>
      <div className="flex items-center mb-5">
        <h2 className="text-main text-xl font-semibold">Projects Management</h2>
        <button
          onClick={openCreateForm}
          className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
        >
          + New Project
        </button>
      </div>

      <ul style={{ padding: 0 }}>
        {projects.map((p, idx) => {
          const isDragging = draggingId === p.id;
          const isDragOver = dragOverId === p.id && draggingId !== p.id;
          return (
            <li
              key={p.id}
              onClick={() => openEditForm(p)}
              draggable
              onDragStart={(e) => onDragStart(e, p, idx)}
              onDragOver={(e) => onDragOver(e, p, idx)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, p, idx)}
              className={`border border-stroke mb-3 flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-[#2b2b2d]
                ${isDragging ? "opacity-60" : ""} ${
                isDragOver ? "bg-zinc-800" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-zinc-900 flex items-center justify-center">
                  <GripHorizontal color="#ffdb70" size={16} />
                </div>

                <div>
                  <h3 className="text-main capitalize">{p.title}</h3>
                  <div className="text-xs text-subtle">
                    order: {p.order ?? idx + 1}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(p, e)}
                  className="text-subtle bg-red-600 p-2 rounded-md"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {(mode === "create" || mode === "edit") && (
        <Modal onClose={closeModal}>
          <ProjectForm
            mode={mode}
            initial={editingProject}
            onCancel={closeModal}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            submitting={uploading || bgUploading}
            categoryOptions={STATIC_CATEGORIES}
            techOptions={techOptions}
          />
        </Modal>
      )}
    </div>
  );
}

/* Modal component */
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onClose && onClose()}
      />
      <div className="relative z-10 w-full max-w-4xl p-6">
        <div className="bg-[#1e1e1f] border border-stroke rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ProjectForm (with native select for Category and TechMultiSelect) */
function ProjectForm({
  mode,
  initial,
  onCancel,
  onCreate,
  onUpdate,
  submitting,
  categoryOptions = [],
  techOptions = [],
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  // we keep techInput as comma-separated string for compatibility with buildTechValue()
  const [techInput, setTechInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [link, setLink] = useState("");

  // files & previews
  const [bgFile, setBgFile] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]); // File[]
  const [projectImages, setProjectImages] = useState([]); // string urls or {url,__local,name}

  // drag state
  const [isDragging, setIsDragging] = useState(false);

  // refs
  const bgInputRef = useRef(null);
  const projectInputRef = useRef(null);

  const createdBlobsRef = useRef([]);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setSlug(initial.slug || "");
      setCategory(initial.category || "");
      setDescription(initial.description || "");
      setTechInput(
        initial.tech_stack && Array.isArray(initial.tech_stack)
          ? initial.tech_stack.join(", ")
          : initial.tech_stack || ""
      );
      setTagsInput(
        initial.tags && Array.isArray(initial.tags)
          ? initial.tags.join(", ")
          : initial.tags || ""
      );
      setLink(initial.link || "");
      setBgFile(null);
      setBgPreview(initial.bg_image || null);
      const imgs = [];
      if (initial.project_images && Array.isArray(initial.project_images)) {
        initial.project_images.forEach((u) => {
          if (u) imgs.push(u);
        });
      }
      setProjectImages(imgs);
      setProjectFiles([]);
    } else {
      setTitle("");
      setSlug("");
      setCategory("");
      setDescription("");
      setTechInput("");
      setTagsInput("");
      setLink("");
      setBgFile(null);
      setBgPreview(null);
      setProjectFiles([]);
      setProjectImages([]);
    }

    return () => {
      try {
        createdBlobsRef.current.forEach((url) => {
          if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
        });
      } catch (e) {
        // ignore
      } finally {
        createdBlobsRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  function onBgFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (
      bgPreview &&
      typeof bgPreview === "string" &&
      bgPreview.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(bgPreview);
      } catch (e) {}
    }
    setBgFile(f);
    const url = URL.createObjectURL(f);
    createdBlobsRef.current.push(url);
    setBgPreview(url);
  }

  function onProjectFilesChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setProjectFiles((prev) => [...prev, ...files]);

    const blobs = files.map((f) => {
      const url = URL.createObjectURL(f);
      createdBlobsRef.current.push(url);
      return { url, __local: true, name: f.name };
    });

    setProjectImages((prev) => {
      const filteredPrev = (prev || []).filter(Boolean);
      return [...filteredPrev, ...blobs];
    });
  }

  function removeProjectImageAt(index) {
    setProjectImages((prev) => {
      const next = (prev || []).slice();
      const img = next[index];
      if (
        img &&
        typeof img === "object" &&
        img.__local &&
        img.url &&
        img.url.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(img.url);
        } catch (e) {}
        setProjectFiles((pf) => {
          if (!pf || !pf.length) return pf || [];
          const idx = pf.findIndex((f) => f.name === img.name);
          if (idx === -1) return pf;
          const copy = [...pf];
          copy.splice(idx, 1);
          return copy;
        });
      }
      next.splice(index, 1);
      return next.filter(Boolean);
    });
  }

  function removeExistingProjectImage(url, index) {
    setProjectImages((prev) => {
      const next = (prev || []).slice();
      next.splice(index, 1);
      return next.filter(Boolean);
    });
  }

  function triggerBgPicker() {
    bgInputRef.current?.click();
  }
  function triggerProjectPicker() {
    projectInputRef.current?.click();
  }

  async function submit() {
    const form = {
      title,
      slug,
      category,
      description,
      techInput,
      tagsInput,
      link,
      bgFile,
      bgPreview,
      projectFiles,
      projectImages: (projectImages || []).filter(Boolean),
    };
    if (mode === "create") await onCreate(form);
    else await onUpdate(form);
  }

  // The Select components update local category and techInput state directly
  return (
    <div className="max-h-[80vh] overflow-auto hide-scrollbar p-1">
      <h3 className="text-main mb-4 text-xl font-semibold">
        {mode === "create" ? "Create Project" : "Update Project"}
      </h3>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <div className="flex flex-col gap-y-4">
        <div>
          <label className="text-subtle block text-sm mb-1">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-4 mt-3">
          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">
              Slug (optional)
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from title if blank"
              className="w-full p-2 rounded bg-transparent text-sm border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">Category</label>

            {/* Native select with static options passed from parent */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded bg-transparent text-sm border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="">Select Category</option>
              {(categoryOptions || []).map((cat) => (
                <option key={cat} value={cat} className="bg-[#1e1e1f]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-subtle block mt-3 mb-1 text-sm">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 rounded bg-transparent text-sm border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="text-subtle block mt-3 mb-1 text-sm">
            Tech stack
          </label>
          <TechMultiSelect
            selectedCsv={techInput}
            onChangeCsv={setTechInput}
            options={techOptions}
            placeholder="Select techs..."
            className="text-main"
          />
          <p className="text-xs text-subtle mt-1">
            Selected will be saved as CSV/array.
          </p>
        </div>

        <div>
          <label className="text-subtle block mt-3 mb-1 text-sm">
            Background image
          </label>
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            onChange={onBgFileChange}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={triggerBgPicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerBgPicker();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-stroke text-subtle bg-transparent hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Upload background image"
            title="Upload background image"
          >
            <Upload size={16} />
            <span className="text-sm">Upload background</span>
          </button>

          {bgPreview && (
            <div className="mt-2">
              <img
                src={bgPreview}
                alt="bg preview"
                style={{ width: 220, objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="text-subtle block mt-3 mb-1 text-sm">
            Project images (multiple)
          </label>
          <input
            ref={projectInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onProjectFilesChange}
            className="hidden"
          />

          <div className="flex flex-col">
            <div
              onClick={triggerProjectPicker}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  triggerProjectPicker();
                }
              }}
              role="button"
              tabIndex={0}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = Array.from(e.dataTransfer.files || []);
                if (files.length) onProjectFilesChange({ target: { files } });
              }}
              className={`border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-stroke bg-transparent"
              } hover:bg-zinc-800`}
            >
              <Upload size={22} className="text-subtle" />
              <p className="text-subtle text-xs mt-2">
                Browse or drag project images
              </p>
            </div>

            <div className="mt-3 flex gap-3 flex-wrap">
              {(projectImages || []).filter(Boolean).map((u, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={u?.url ?? u}
                    alt={`img-${idx}`}
                    className="w-[160px] h-[100px] rounded-md object-cover"
                  />
                  <button
                    onClick={() => {
                      if (typeof u === "string")
                        removeExistingProjectImage(u, idx);
                      else removeProjectImageAt(idx);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-[6px] rounded-full shadow-lg"
                    type="button"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-primary py-2 px-4 rounded-full"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
            ? "Create Project"
            : "Update Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 rounded-full border border-stroke text-subtle"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* SingleSelect - kept for backward compatibility but not used for Category now */
function SingleSelect({ value, onChange, options = [], placeholder = "" }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value || "");

  useEffect(() => setInput(value || ""), [value]);

  function choose(val) {
    setInput(val || "");
    onChange && onChange(val || "");
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onBlur={() => onChange && onChange(input || null)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 rounded bg-transparent text-sm border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      />
      {open && options && options.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 max-h-40 overflow-auto bg-[#111111] border border-stroke rounded shadow-sm z-20">
          {options.map((opt, i) => (
            <li
              key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(opt);
              }}
              className="px-3 py-2 hover:bg-zinc-800 cursor-pointer text-sm"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* TechMultiSelect
   - selectedCsv: comma-separated CSV string of selected techs
   - onChangeCsv: callback(newCsvString)
   - options: array of available tech options
   - allows adding new tech via small input (Enter to add)
*/
function TechMultiSelect({
  selectedCsv,
  onChangeCsv,
  options = [],
  placeholder = "",
}) {
  const [open, setOpen] = useState(false);
  // convert CSV to array
  const selected = (selectedCsv || "")
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [localOptions, setLocalOptions] = useState(options || []);
  const [newTech, setNewTech] = useState("");

  useEffect(() => setLocalOptions(options || []), [options]);

  function toggleOption(opt) {
    const exists = selected.includes(opt);
    let next;
    if (exists) next = selected.filter((s) => s !== opt);
    else next = [...selected, opt];
    onChangeCsv && onChangeCsv(next.join(", "));
  }

  function addNewTech(e) {
    e.preventDefault();
    const val = (newTech || "").trim();
    if (!val) return;
    const already = localOptions.includes(val);
    const alreadySelected = selected.includes(val);
    if (!already) setLocalOptions((l) => [...l, val]);
    if (!alreadySelected)
      onChangeCsv && onChangeCsv([...selected, val].join(", "));
    setNewTech("");
  }

  function removeTag(tag) {
    const next = selected.filter((s) => s !== tag);
    onChangeCsv && onChangeCsv(next.join(", "));
  }

  return (
    <div className="relative">
      <div
        onClick={() => setOpen((s) => !s)}
        className="min-h-[44px] border border-stroke rounded p-2 flex items-center gap-2 flex-wrap cursor-pointer"
        role="button"
      >
        {selected.length === 0 ? (
          <span className="text-subtle text-sm">
            {placeholder || "Select techs"}
          </span>
        ) : (
          selected.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded bg-zinc-800 text-subtle border border-stroke flex items-center gap-2"
            >
              {t}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(t);
                }}
                className="ml-1 text-subtle"
                type="button"
                aria-label={`remove ${t}`}
              >
                ×
              </button>
            </span>
          ))
        )}
        <div className="ml-auto text-subtle text-xs">▾</div>
      </div>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-2 bg-[#111111] border border-stroke rounded shadow-sm p-3 max-h-64 overflow-auto">
          <div className="mb-2">
            <form onSubmit={addNewTech} className="flex gap-2">
              <input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add new tech and press Enter"
                className="flex-1 p-2 rounded bg-transparent border border-stroke text-sm focus:outline-none"
              />
              <button type="submit" className="py-2 px-3 rounded bg-primary">
                Add
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(localOptions || []).map((opt) => {
              const checked = selected.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-zinc-900 text-main"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOption(opt)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="py-1 px-3 rounded border border-stroke text-subtle"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
