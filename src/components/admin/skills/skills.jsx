// components/admin/skills-manager.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFileToBucket, deleteFileFromBucket } from "../../../lib/storage";
import { Trash2, Upload, Move, GripHorizontal } from "lucide-react";

/**
 * Expected schema (based on your sample):
 * - id (uuid)
 * - name (text)
 * - score (int)
 * - category (text)
 * - order (int)
 * - created_at, updated_at
 *
 * Notes:
 * - icon is supported in UI as optional (icon URL or file). If you later add an `icon` column,
 *   this UI will already send an `icon` value to the DB (if present) — just make sure your table
 *   has an `icon` column. For now it will be ignored by DB if column missing (remove icon from payload).
 * - Uploads go to bucket: "portfolio" (change if you use another).
 */

// Static categories (edit to your preferred set)
const STATIC_CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Mobile",
  "Data",
  "Tools",
  "Other",
];

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // list | create | edit
  const [editing, setEditing] = useState(null);
  const [iconUploading, setIconUploading] = useState(false);

  // drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragStartIndexRef = useRef(null);

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if ((mode === "create" || mode === "edit") && e.key === "Escape")
        closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  async function loadSkills() {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadSkills error", error);
      setSkills([]);
      setLoading(false);
      return;
    }

    // Normalize order values so UI always shows sensible numbers
    const normalized = (data || []).map((s, i) => ({
      ...s,
      order: typeof s.order === "number" ? s.order : i + 1,
    }));

    setSkills(normalized);
    setLoading(false);
  }

  // Persist order to Supabase (one update per item, run in parallel)
  async function persistOrder(newOrderedSkills) {
    try {
      const ops = newOrderedSkills.map((sk, idx) =>
        supabase
          .from("skills")
          .update({ order: idx + 1 })
          .eq("id", sk.id)
      );

      const results = await Promise.all(ops);
      const err = results.find((r) => r.error);
      if (err?.error) {
        console.error("persistOrder error", err.error);
        throw err.error;
      }

      // reload from server to reflect any triggers/updated_at
      await loadSkills();
    } catch (e) {
      console.error("persistOrder failed", e);
      alert("Failed to save order: " + (e?.message || e));
      // revert by reloading
      await loadSkills();
    } finally {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
    }
  }

  // CREATE
  async function handleCreate(form) {
    if (!form.name?.trim()) return alert("Please add a skill name");
    try {
      // handle optional icon upload
      let iconUrl = form.iconUrl?.trim() || null;
      if (form.iconFile) {
        setIconUploading(true);
        const path = `skills/icon_${Date.now()}_${form.iconFile.name.replace(
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

      // determine order: max(order)+1 if not provided
      const maxOrder = skills.reduce(
        (m, s) => (typeof s.order === "number" && s.order > m ? s.order : m),
        0
      );
      const assignedOrder =
        typeof form.order === "number" &&
        !Number.isNaN(form.order) &&
        form.order > 0
          ? form.order
          : maxOrder + 1 || skills.length + 1;

      const payload = {
        name: form.name.trim(),
        score: Number.isFinite(form.score) ? form.score : 0,
        category: form.category || null,
        order: assignedOrder,
        ...(iconUrl ? { icon: iconUrl } : {}),
      };

      const res = await supabase.from("skills").insert([payload]).select();
      if (res.error) {
        console.error("create skill error", res.error);
        throw res.error;
      }
      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        throw new Error("Insert succeeded but returned no rows.");
      }

      closeModal();
      await loadSkills();
      alert("Skill created");
    } catch (err) {
      console.error("handleCreate err:", err);
      alert("Create failed: " + (err?.message || err));
      setIconUploading(false);
    }
  }

  // UPDATE
  async function handleUpdate(form) {
    if (!editing) return alert("No skill selected");
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
        const path = `skills/icon_${Date.now()}_${form.iconFile.name.replace(
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
        // user typed a new icon URL — just use it (no upload). Note: we don't auto-delete previous remote icons.
        iconUrl = form.iconUrl.trim();
      }

      const payload = {
        name: form.name.trim(),
        score: Number.isFinite(form.score) ? form.score : 0,
        category: form.category || null,
        order:
          typeof form.order === "number" && !Number.isNaN(form.order)
            ? form.order
            : editing.order ?? 0,
        ...(iconUrl ? { icon: iconUrl } : {}),
      };

      const res = await supabase
        .from("skills")
        .update(payload)
        .eq("id", editing.id)
        .select();
      if (res.error) {
        console.error("update skill error", res.error);
        throw res.error;
      }
      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        throw new Error(
          "Update returned no rows. Check permissions / matching id."
        );
      }
      closeModal();
      await loadSkills();
      alert("Skill updated");
    } catch (err) {
      console.error("handleUpdate err:", err);
      alert("Update failed: " + (err?.message || err));
      setIconUploading(false);
    }
  }

  // DELETE
  async function handleDelete(skill, e) {
    e?.stopPropagation?.();
    if (!confirm("Delete this skill?")) return;
    try {
      if (skill.icon && skill.icon.includes("/storage/v1/object/public/")) {
        const parts = skill.icon.split("/storage/v1/object/public/")[1];
        if (parts) {
          const [bucket, ...rest] = parts.split("/");
          await deleteFileFromBucket({ bucket, path: rest.join("/") }).catch(
            (e) => console.warn("icon delete err", e)
          );
        }
      }
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skill.id);
      if (error) throw error;
      await loadSkills();
      if (editing?.id === skill.id) closeModal();
    } catch (err) {
      console.error("handleDelete err:", err);
      alert("Delete failed");
    }
  }

  function openCreate() {
    setEditing(null);
    setMode("create");
  }
  function openEdit(s) {
    setEditing(s);
    setMode("edit");
  }
  function closeModal() {
    setEditing(null);
    setMode("list");
  }

  // ---------------- Drag & Drop Handlers ----------------
  function onDragStart(e, sk, index) {
    e.stopPropagation();
    setDraggingId(sk.id);
    dragStartIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", sk.id);
    } catch (err) {}
  }

  function onDragOver(e, sk, index) {
    e.preventDefault();
    setDragOverId(sk.id);
    e.dataTransfer.dropEffect = "move";
  }

  function onDragLeave() {
    setDragOverId(null);
  }

  function onDrop(e, targetSkill, targetIndex) {
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
    if (draggedId === targetSkill.id) {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
      return;
    }

    const current = [...skills];
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
    setSkills(current);
    persistOrder(current);
  }

  return (
    <div>
      <div className="flex items-center mb-5">
        <h2 className="text-main text-xl font-semibold">Skills Management</h2>
        <button
          onClick={openCreate}
          className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
        >
          + New Skill
        </button>
      </div>

      <ul style={{ padding: 0 }}>
        {loading ? (
          <li className="text-subtle">Loading...</li>
        ) : skills.length === 0 ? (
          <li className="text-subtle">No skills yet</li>
        ) : (
          skills.map((s, idx) => {
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
                className={`border border-stroke mb-3 flex items-center justify-between p-3 rounded-lg cursor-pointer bg-background
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
                      <img
                        src={s.icon}
                        alt={s.name}
                        className="w-10 h-10 rounded-md object-contain bg-[#0f0f10] p-1"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-zinc-800 flex items-center justify-center text-subtle">
                        S
                      </div>
                    )}
                    <div>
                      <div className="text-main font-medium">{s.name}</div>
                      <div className="text-subtle text-xs">
                        {s.category} • score: {s.score} • order:{" "}
                        {s.order ?? idx + 1}
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
          <SkillForm
            mode={mode}
            initial={editing}
            onCancel={closeModal}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            submitting={iconUploading}
            staticCategories={STATIC_CATEGORIES}
          />
        </Modal>
      )}
    </div>
  );
}

/* Modal */
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

/* SkillForm - supports static dropdown with 'Add new' option and optional icon (url/upload) */
function SkillForm({
  mode,
  initial,
  onCancel,
  onCreate,
  onUpdate,
  submitting,
  staticCategories = [],
}) {
  const [name, setName] = useState("");
  const [score, setScore] = useState(50);
  const [category, setCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [order, setOrder] = useState(0);

  // icon states (optional)
  const [iconUrl, setIconUrl] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const iconRef = useRef(null);
  const createdBlobsRef = useRef([]);

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setScore(
        typeof initial.score === "number"
          ? initial.score
          : Number(initial.score ?? 0)
      );
      setCategory(initial.category || "");
      setOrder(
        typeof initial.order === "number"
          ? initial.order
          : Number(initial.order ?? 0)
      );
      setIconUrl(initial.icon || "");
      setIconPreview(initial.icon || null);
      setIconFile(null);
      setShowAddCategory(false);
      setNewCategory("");
    } else {
      setName("");
      setScore(50);
      setCategory("");
      setOrder(0);
      setIconUrl("");
      setIconFile(null);
      setIconPreview(null);
      setShowAddCategory(false);
      setNewCategory("");
    }

    return () => {
      // cleanup created blobs
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
    setIconUrl(""); // file takes precedence
  }

  function onIconUrlChange(e) {
    setIconUrl(e.target.value);
    setIconFile(null);
    setIconPreview(e.target.value || null);
  }

  function onCategoryChange(e) {
    const val = e.target.value;
    if (val === "__add_new__") {
      setShowAddCategory(true);
      setCategory("");
      setNewCategory("");
    } else {
      setShowAddCategory(false);
      setCategory(val);
      setNewCategory("");
    }
  }

  async function submit() {
    // if user added a new category, use it
    const finalCategory =
      showAddCategory && newCategory.trim()
        ? newCategory.trim()
        : category || null;

    const form = {
      name,
      score: Number(score || 0),
      category: finalCategory,
      order: Number(order || 0),
      iconUrl,
      iconFile,
    };

    if (mode === "create") await onCreate(form);
    else await onUpdate(form);
  }

  return (
    <div className="max-h-[80vh] overflow-auto hide-scrollbar p-1">
      <h3 className="text-main mb-4 text-xl font-semibold">
        {mode === "create" ? "Create Skill" : "Update Skill"}
      </h3>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <div className="flex flex-col gap-y-4">
        <div>
          <label className="text-subtle block mb-1 text-sm">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Score</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-20 p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Category</label>
          <div className="flex gap-2 items-center">
            <select
              value={showAddCategory ? "__add_new__" : category}
              onChange={onCategoryChange}
              className="p-2 rounded bg-transparent border border-stroke text-main"
            >
              <option value="" className="bg-[#303031] text-main">
                Select category
              </option>
              {(staticCategories || []).map((c) => (
                <option key={c} value={c} className="bg-[#303031] text-main ">
                  {c}
                </option>
              ))}
              <option className="bg-[#303031] text-main" value="__add_new__">
                Add new category...
              </option>
            </select>

            {showAddCategory && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Type new category"
                className="flex-1 p-2 rounded bg-transparent border border-stroke text-main"
              />
            )}
          </div>
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-40 p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">
            Icon (URL or upload, optional)
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
                className="w-12 h-10 rounded-md object-contain bg-[#0f0f10] p-1"
              />
            )}
          </div>
          <p className="text-xs text-subtle mt-1">
            Icon is optional — if DB doesn't yet have an icon column this will
            be ignored until you add it.
          </p>
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
            ? "Create Skill"
            : "Update Skill"}
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
