// components/admin/services-manager.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFileToBucket, deleteFileFromBucket } from "../../../lib/storage";
import { Trash2, Upload, Move, GripHorizontal } from "lucide-react";
import Image from "next/image";

/**
 * Schema expected (based on your sample):
 * id (uuid), title (text), description (text), icon (public url), order (int), created_at (timestamptz)
 *
 * This component stores uploaded icons in the `portfolio` bucket (change if you use another).
 * If you paste a remote URL into the Icon URL field, it will be stored as-is (no upload).
 */

// static categories kept optional (remove if you don't want categories)
const STATIC_CATEGORIES = [
  "Consulting",
  "Development",
  "Design",
  "Support",
  "Other",
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [mode, setMode] = useState("list"); // list | create | edit
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconUploading, setIconUploading] = useState(false);

  // drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragStartIndexRef = useRef(null);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if ((mode === "create" || mode === "edit") && e.key === "Escape")
        closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  async function loadServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadServices error", error);
      setServices([]);
      setLoading(false);
      return;
    }

    // Normalize order values so UI always shows numbers
    const normalized = (data || []).map((s, i) => ({
      ...s,
      order: typeof s.order === "number" ? s.order : i + 1,
    }));

    setServices(normalized);
    setLoading(false);
  }

  // Persist order to Supabase (one update per item, parallel)
  async function persistOrder(newOrderedServices) {
    try {
      const ops = newOrderedServices.map((svc, idx) =>
        supabase
          .from("services")
          .update({ order: idx + 1 })
          .eq("id", svc.id)
      );

      const results = await Promise.all(ops);
      const err = results.find((r) => r.error);
      if (err?.error) {
        console.error("persistOrder error", err.error);
        throw err.error;
      }

      // reload to reflect server state (and any triggers/updated_at)
      await loadServices();
    } catch (e) {
      console.error("persistOrder failed", e);
      alert("Failed to save order: " + (e?.message || e));
    } finally {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
    }
  }

  // ---------------- CREATE ----------------
  async function handleCreate(form) {
    if (!form.title?.trim()) return alert("Please add a title");
    try {
      // handle icon upload (if file provided)
      let iconUrl = form.iconUrl?.trim() || null;
      if (form.iconFile) {
        setIconUploading(true);
        const path = `services/icon_${Date.now()}_${form.iconFile.name.replace(
          /\s/g,
          "_"
        )}`;
        const up = await uploadFileToBucket({
          bucket: "portfolio",
          path,
          file: form.iconFile,
        });
        setIconUploading(false);
        if (up?.error) throw up.error;
        iconUrl = up.publicUrl;
      }

      // determine order: max(order) + 1
      const maxOrder = services.reduce(
        (m, s) => (typeof s.order === "number" && s.order > m ? s.order : m),
        0
      );
      const assignedOrder =
        typeof form.order === "number" && form.order > 0
          ? form.order
          : maxOrder + 1 || services.length + 1;

      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        icon: iconUrl || null,
        order: assignedOrder,
      };

      const res = await supabase.from("services").insert([payload]).select();
      if (res.error) {
        console.error("create service error", res.error);
        throw res.error;
      }
      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        throw new Error("Insert succeeded but returned no rows.");
      }
      closeModal();
      await loadServices();
      alert("Service created");
    } catch (err) {
      console.error("handleCreate err:", err);
      alert("Create failed: " + (err?.message || err));
      setIconUploading(false);
    }
  }

  // ---------------- UPDATE ----------------
  async function handleUpdate(form) {
    if (!editing) return alert("No service selected");
    try {
      let iconUrl = editing.icon || null;

      // if new iconFile provided => delete old (if from storage) then upload
      if (form.iconFile) {
        if (iconUrl && iconUrl.includes("/storage/v1/object/public/")) {
          const parts = iconUrl.split("/storage/v1/object/public/")[1];
          if (parts) {
            const [bucket, ...rest] = parts.split("/");
            await deleteFileFromBucket({ bucket, path: rest.join("/") }).catch(
              (e) => console.warn("prev-icon-delete err", e)
            );
          }
        }
        setIconUploading(true);
        const path = `services/icon_${Date.now()}_${form.iconFile.name.replace(
          /\s/g,
          "_"
        )}`;
        const up = await uploadFileToBucket({
          bucket: "portfolio",
          path,
          file: form.iconFile,
        });
        setIconUploading(false);
        if (up?.error) throw up.error;
        iconUrl = up.publicUrl;
      } else if (
        form.iconUrl &&
        form.iconUrl.trim() &&
        form.iconUrl !== editing.icon
      ) {
        // user typed a new icon URL — just use it (no upload).
        iconUrl = form.iconUrl.trim();
      }

      const payload = {
        title: form.title.trim(),
        description: form.description || null,
        icon: iconUrl || null,
        order:
          typeof form.order === "number" && !Number.isNaN(form.order)
            ? form.order
            : editing.order ?? 0,
      };

      const res = await supabase
        .from("services")
        .update(payload)
        .eq("id", editing.id)
        .select();
      if (res.error) {
        console.error("update service error", res.error);
        throw res.error;
      }
      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        throw new Error(
          "Update returned no rows. Check permissions / matching id."
        );
      }
      closeModal();
      await loadServices();
      alert("Service updated");
    } catch (err) {
      console.error("handleUpdate err:", err);
      alert("Update failed: " + (err?.message || err));
      setIconUploading(false);
    }
  }

  // ---------------- DELETE ----------------
  async function handleDelete(svc, e) {
    e?.stopPropagation?.();
    if (!confirm("Delete this service?")) return;
    try {
      // delete icon from bucket if it looks like a public storage url
      if (svc.icon && svc.icon.includes("/storage/v1/object/public/")) {
        const parts = svc.icon.split("/storage/v1/object/public/")[1];
        if (parts) {
          const [bucket, ...rest] = parts.split("/");
          await deleteFileFromBucket({ bucket, path: rest.join("/") }).catch(
            (e) => console.warn("icon delete err", e)
          );
        }
      }
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", svc.id);
      if (error) throw error;
      await loadServices();
      if (editing?.id === svc.id) closeModal();
    } catch (err) {
      console.error("handleDelete err", err);
      alert("Delete failed");
    }
  }

  function openCreate() {
    setEditing(null);
    setMode("create");
  }
  function openEdit(svc) {
    setEditing(svc);
    setMode("edit");
  }
  function closeModal() {
    setEditing(null);
    setMode("list");
  }

  // ---------------- Drag & Drop Handlers ----------------
  function onDragStart(e, svc, index) {
    e.stopPropagation();
    setDraggingId(svc.id);
    dragStartIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", svc.id);
    } catch (err) {}
  }

  function onDragOver(e, svc, index) {
    e.preventDefault();
    setDragOverId(svc.id);
    e.dataTransfer.dropEffect = "move";
  }

  function onDragLeave() {
    setDragOverId(null);
  }

  function onDrop(e, targetSvc, targetIndex) {
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
      dragStartIndexRef.current = null;
      return;
    }
    if (draggedId === targetSvc.id) {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
      return;
    }

    const current = [...services];
    const fromIndex = current.findIndex((x) => x.id === draggedId);
    if (fromIndex === -1) {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
      return;
    }
    const [moved] = current.splice(fromIndex, 1);
    // insert before target index
    let insertAt = targetIndex;
    current.splice(insertAt, 0, moved);

    // optimistic update then persist
    setServices(current);
    persistOrder(current);
  }

  // ---------------- UI ----------------
  return (
    <div>
      <div className="flex items-center mb-5">
        <h2 className="text-main text-xl font-semibold">Services Management</h2>
        <button
          onClick={openCreate}
          className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
        >
          + New Service
        </button>
      </div>

      <ul style={{ padding: 0 }}>
        {loading ? (
          <li className="text-subtle">Loading...</li>
        ) : services.length === 0 ? (
          <li className="text-subtle">No services yet</li>
        ) : (
          services.map((s, idx) => {
            const isDragging = draggingId === s.id;
            const isDragOver = dragOverId === s.id && draggingId !== s.id;
            return (
              <li
                key={s.id}
                onClick={() => openEdit(s)}
                draggable
                onDragStart={(e) => onDragStart(e, s, idx)}
                onDragOver={(e) => onDragOver(e, s, idx)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, s, idx)}
                className={`border border-stroke mb-3 flex items-center justify-between p-3 rounded-lg cursor-pointer bg-background hover:bg-[#2b2b2d]
                  ${isDragging ? "opacity-60" : ""} ${
                  isDragOver ? "bg-zinc-800" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-zinc-900 flex items-center justify-center">
                    <GripHorizontal color="#ffdb70" size={16} />
                  </div>

                  <div className="flex items-center gap-3">
                    {s.icon ? (
                      <Image
                        src={s.icon}
                        alt={s.title}
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-md object-contain bg-[#0f0f10] p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-zinc-800 flex items-center justify-center text-subtle">
                        S
                      </div>
                    )}
                    <div>
                      <div className="text-main font-medium">{s.title}</div>
                      <div className="text-subtle text-xs">
                        order: {s.order ?? idx + 1}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(s, e)}
                    className="bg-red-600 p-2 rounded-md text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      {(mode === "create" || mode === "edit") && (
        <Modal onClose={closeModal}>
          <ServiceForm
            mode={mode}
            initial={editing}
            onCancel={closeModal}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            submitting={iconUploading}
            categoryOptions={STATIC_CATEGORIES}
          />
        </Modal>
      )}
    </div>
  );
}

/* Modal component (matches your theme) */
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
      <div className="relative z-10 w-full max-w-3xl p-6">
        <div className="bg-background border border-stroke rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ServiceForm adapted to your schema (icon + order) */
function ServiceForm({
  mode,
  initial,
  onCancel,
  onCreate,
  onUpdate,
  submitting,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState(""); // user can paste a url
  const [iconFile, setIconFile] = useState(null); // or upload a file
  const [iconPreview, setIconPreview] = useState(null);
  const [order, setOrder] = useState(0);

  const iconRef = useRef(null);
  const createdBlobsRef = useRef([]);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setDescription(initial.description || "");
      setIconUrl(initial.icon || "");
      setIconPreview(initial.icon || null);
      setIconFile(null);
      setOrder(
        typeof initial.order === "number"
          ? initial.order
          : Number(initial.order ?? 0)
      );
    } else {
      setTitle("");
      setDescription("");
      setIconUrl("");
      setIconFile(null);
      setIconPreview(null);
      setOrder(0);
    }

    return () => {
      // revoke created blobs
      try {
        createdBlobsRef.current.forEach((u) => {
          if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
        });
      } catch (e) {}
      createdBlobsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  function triggerIconPicker() {
    iconRef.current?.click();
  }

  function onIconFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // revoke previous blob if any
    if (
      iconPreview &&
      typeof iconPreview === "string" &&
      iconPreview.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(iconPreview);
      } catch (e) {}
    }
    setIconFile(f);
    const url = URL.createObjectURL(f);
    createdBlobsRef.current.push(url);
    setIconPreview(url);
    // clear manual url input since file takes precedence on upload
    setIconUrl("");
  }

  function onIconUrlChange(e) {
    setIconUrl(e.target.value);
    setIconFile(null);
    setIconPreview(e.target.value || null);
  }

  async function submit() {
    const form = {
      title,
      description,
      iconUrl,
      iconFile,
      order: Number(order || 0),
    };
    if (mode === "create") await onCreate(form);
    else await onUpdate(form);
  }

  return (
    <div className="max-h-[80vh] overflow-auto hide-scrollbar p-1">
      <h3 className="text-main mb-4 text-xl font-semibold">
        {mode === "create" ? "Create Service" : "Update Service"}
      </h3>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <div className="flex flex-col gap-y-4">
        <div>
          <label className="text-subtle block mb-1 text-sm">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 rounded bg-transparent text-sm border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">
            Icon (paste URL or upload file)
          </label>

          <input
            ref={iconRef}
            type="file"
            accept="image/*,image/svg+xml"
            className="hidden"
            onChange={onIconFileChange}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={triggerIconPicker}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-stroke text-subtle bg-transparent hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Upload size={16} />
              <span className="text-sm">Upload icon</span>
            </button>

            <input
              value={iconUrl}
              onChange={onIconUrlChange}
              placeholder="Paste icon URL (optional)"
              className="flex-1 p-2 rounded bg-transparent border border-stroke text-sm text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />

            {iconPreview && (
              <img
                src={iconPreview}
                alt="icon preview"
                className="w-16 h-12 rounded-md object-contain bg-[#0f0f10] p-1"
              />
            )}
          </div>

          <p className="text-xs text-subtle mt-1">
            If you both paste a URL and upload a file, the file upload will be
            used when saving.
          </p>
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">
            Order (number)
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-40 p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
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
            ? "Create Service"
            : "Update Service"}
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
