// components/admin/experience-manager.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Trash2, GripHorizontal } from "lucide-react";

/**
 * Expected schema (based on your sample):
 * - id (uuid)
 * - company (text)
 * - title (text)
 * - start_date (date / text)
 * - end_date (date / text, nullable)
 * - location (text)
 * - responsibilities (text)
 * - bullets (text[] on DB)  <-- we will send JS array; if your DB uses csv change accordingly
 * - order (int)
 * - created_at, updated_at
 *
 * Notes:
 * - If bullets column does not exist, change payload to send CSV or remove bullets.
 * - This component assumes RLS/policies allow the authenticated admin to perform CRUD.
 */

export default function ExperienceManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("list"); // list | create | edit
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragStartIndexRef = useRef(null);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if ((mode === "create" || mode === "edit") && e.key === "Escape")
        closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  async function loadItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from("experience") // change to "experiences" if your table name differs
      .select("*")
      .order("order", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadItems error", error);
      setItems([]);
      setLoading(false);
      return;
    }

    // normalize order so UI shows sensible numbers
    const normalized = (data || []).map((it, i) => ({
      ...it,
      order: typeof it.order === "number" ? it.order : i + 1,
    }));

    setItems(normalized);
    setLoading(false);
  }

  // Persist order to Supabase (one update per item, run in parallel)
  async function persistOrder(newOrderedItems) {
    try {
      const ops = newOrderedItems.map((it, idx) =>
        supabase
          .from("experience")
          .update({ order: idx + 1 })
          .eq("id", it.id)
      );

      const results = await Promise.all(ops);
      const err = results.find((r) => r.error);
      if (err?.error) {
        console.error("persistOrder error", err.error);
        throw err.error;
      }

      // reload to reflect server state (and any triggers/updated_at)
      await loadItems();
    } catch (e) {
      console.error("persistOrder failed", e);
      alert("Failed to save order: " + (e?.message || e));
      // revert UI by reloading
      await loadItems();
    } finally {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
    }
  }

  // CREATE
  async function handleCreate(form) {
    if (!form.company?.trim() || !form.title?.trim())
      return alert("Company and title are required");
    setSubmitting(true);
    try {
      // determine order: max(order) + 1 if not provided
      const maxOrder = items.reduce(
        (m, it) =>
          typeof it.order === "number" && it.order > m ? it.order : m,
        0
      );
      const assignedOrder =
        typeof form.order === "number" &&
        !Number.isNaN(form.order) &&
        form.order > 0
          ? form.order
          : maxOrder + 1 || items.length + 1;

      const payload = {
        company: form.company.trim(),
        title: form.title.trim(),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        location: form.location || null,
        responsibilities: form.responsibilities || null,
        order: assignedOrder,
        ...(form.bullets && form.bullets.length
          ? { bullets: form.bullets }
          : {}),
      };

      const res = await supabase.from("experience").insert([payload]).select();
      if (res.error) throw res.error;
      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        throw new Error("Insert succeeded but returned no rows.");
      }
      closeModal();
      await loadItems();
      alert("Experience created");
    } catch (err) {
      console.error("create experience err:", err);
      alert("Create failed: " + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  // UPDATE
  async function handleUpdate(form) {
    if (!editing) return alert("No experience selected");
    setSubmitting(true);
    try {
      const payload = {
        company: form.company.trim(),
        title: form.title.trim(),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        location: form.location || null,
        responsibilities: form.responsibilities || null,
        order: typeof form.order === "number" ? form.order : 0,
        ...(form.bullets && form.bullets.length
          ? { bullets: form.bullets }
          : {}),
      };

      const res = await supabase
        .from("experience")
        .update(payload)
        .eq("id", editing.id)
        .select();
      if (res.error) throw res.error;
      if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
        throw new Error(
          "Update returned no rows. Check permissions / matching id."
        );
      }
      closeModal();
      await loadItems();
      alert("Experience updated");
    } catch (err) {
      console.error("update experience err:", err);
      alert("Update failed: " + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  // DELETE
  async function handleDelete(item, e) {
    e?.stopPropagation?.();
    if (!confirm("Delete this experience?")) return;
    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", item.id);
      if (error) throw error;
      await loadItems();
      if (editing?.id === item.id) closeModal();
    } catch (err) {
      console.error("delete experience err:", err);
      alert("Delete failed");
    }
  }

  function openCreate() {
    setEditing(null);
    setMode("create");
  }
  function openEdit(i) {
    setEditing(i);
    setMode("edit");
  }
  function closeModal() {
    setEditing(null);
    setMode("list");
  }

  // ---------------- Drag & Drop Handlers ----------------
  function onDragStart(e, it, index) {
    e.stopPropagation();
    setDraggingId(it.id);
    dragStartIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", it.id);
    } catch (err) {}
  }

  function onDragOver(e, it, index) {
    e.preventDefault();
    setDragOverId(it.id);
    e.dataTransfer.dropEffect = "move";
  }

  function onDragLeave() {
    setDragOverId(null);
  }

  function onDrop(e, targetItem, targetIndex) {
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
    if (draggedId === targetItem.id) {
      setDraggingId(null);
      setDragOverId(null);
      dragStartIndexRef.current = null;
      return;
    }

    const current = [...items];
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
    setItems(current);
    persistOrder(current);
  }

  return (
    <div>
      <div className="flex items-center mb-5">
        <h2 className="text-main text-xl font-semibold">
          Experience Management
        </h2>
        <button
          onClick={openCreate}
          className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
        >
          + New Experience
        </button>
      </div>

      <ul style={{ padding: 0 }}>
        {loading ? (
          <li className="text-subtle">Loading...</li>
        ) : items.length === 0 ? (
          <li className="text-subtle">No experience records yet</li>
        ) : (
          items.map((it, idx) => {
            const isDragging = draggingId === it.id;
            const isDragOver = dragOverId === it.id && draggingId !== it.id;
            return (
              <li
                key={it.id}
                onClick={() => openEdit(it)}
                draggable
                onDragStart={(e) => onDragStart(e, it, idx)}
                onDragOver={(e) => onDragOver(e, it, idx)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, it, idx)}
                className={`border border-stroke mb-3 flex items-center justify-between p-3 rounded-lg cursor-pointer bg-background
                  ${isDragging ? "opacity-60" : ""} ${
                  isDragOver ? "bg-zinc-800" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-zinc-900 flex items-center justify-center mt-1">
                    <GripHorizontal color="#ffdb70" size={16} />
                  </div>

                  <div>
                    <div className="text-main font-medium">
                      {it.company} —{" "}
                      <span className="capitalize">{it.title}</span>
                    </div>
                    <div className="text-subtle text-xs">
                      {it.location ?? "—"} • {it.start_date ?? "—"} —{" "}
                      {it.end_date ?? "Present"} • order: {it.order ?? idx + 1}
                    </div>
                    {it.responsibilities ? (
                      <div className="text-subtle text-sm mt-1">
                        {it.responsibilities}
                      </div>
                    ) : null}
                    {Array.isArray(it.bullets) && it.bullets.length ? (
                      <ul className="text-subtle text-xs mt-2 list-disc list-inside space-y-1">
                        {it.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(it, e)}
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
          <ExperienceForm
            mode={mode}
            initial={editing}
            onCancel={closeModal}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            submitting={submitting}
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
        <div className="bg-background border border-stroke rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ExperienceForm */
/* Updated ExperienceForm (replace the existing ExperienceForm in components/admin/experience-manager.jsx) */
function ExperienceForm({
  mode,
  initial,
  onCancel,
  onCreate,
  onUpdate,
  submitting,
}) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [bullets, setBullets] = useState([]);
  const [order, setOrder] = useState(0);

  const [tagInput, setTagInput] = useState("");
  const createdBlobsRef = useRef([]);

  useEffect(() => {
    if (initial) {
      setCompany(initial.company || "");
      setTitle(initial.title || "");
      setStartDate(initial.start_date ?? "");
      setEndDate(initial.end_date ?? "");
      setLocation(initial.location || "");
      setResponsibilities(initial.responsibilities || "");
      setBullets(
        Array.isArray(initial.bullets)
          ? initial.bullets
          : initial.bullets
          ? initial.bullets
              .toString()
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []
      );
      setOrder(
        typeof initial.order === "number"
          ? initial.order
          : Number(initial.order ?? 0)
      );
      setTagInput("");
    } else {
      setCompany("");
      setTitle("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setResponsibilities("");
      setBullets([]);
      setOrder(0);
      setTagInput("");
    }

    return () => {
      // revoke any created blobs (none used here but keep pattern)
      try {
        createdBlobsRef.current.forEach((u) => {
          if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
        });
      } catch (e) {}
      createdBlobsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  function addBulletFromInputKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = (tagInput || "").trim();
      if (!v) return;
      if (!bullets.includes(v)) setBullets((s) => [...s, v]);
      setTagInput("");
    } else if (e.key === "Backspace") {
      // if input empty and user presses Backspace, remove last bullet for quick editing
      if (!tagInput && bullets.length) {
        e.preventDefault();
        setBullets((s) => s.slice(0, -1));
      }
    }
  }

  function addBulletManually() {
    const v = (tagInput || "").trim();
    if (!v) return;
    if (!bullets.includes(v)) setBullets((s) => [...s, v]);
    setTagInput("");
  }

  function removeBullet(b) {
    setBullets((s) => s.filter((x) => x !== b));
  }

  async function submit() {
    const form = {
      company,
      title,
      start_date: startDate || null,
      end_date: endDate || null,
      location,
      responsibilities,
      bullets: bullets.length ? bullets : null,
      order: Number(order || 0),
    };

    if (mode === "create") await onCreate(form);
    else await onUpdate(form);
  }

  return (
    <div className="max-h-[80vh] overflow-auto hide-scrollbar p-1">
      <h3 className="text-main mb-4 text-xl font-semibold">
        {mode === "create" ? "Create Experience" : "Update Experience"}
      </h3>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <div className="flex flex-col gap-y-4">
        <div>
          <label className="text-subtle block mb-1 text-sm">Company *</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">
              End date (leave empty for present)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">
            Responsibilities
          </label>
          <textarea
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={3}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        {/* TAGS / BULLETS — chips row + separate input row for typing */}
        <div>
          <label className="text-subtle block mb-1 text-sm">
            Bullets (press Enter to add)
          </label>

          {/* chips */}
          <div className="min-h-[44px] border border-stroke rounded p-2 flex items-center gap-2 flex-wrap bg-[#1e1e1f]">
            {bullets.length === 0 ? (
              <span className="text-subtle text-sm">Add bullet points</span>
            ) : (
              bullets.map((b) => (
                <span
                  key={b}
                  className="text-xs px-2 py-1 rounded bg-zinc-800 border border-stroke flex items-center gap-2"
                >
                  {b}
                  <button
                    onClick={() => removeBullet(b)}
                    className="ml-1 text-subtle"
                    type="button"
                    aria-label={`Remove bullet ${b}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* separate full-width input for typing — this improves focus reliability */}
          <div className="mt-2 flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addBulletFromInputKey}
              placeholder="Type a bullet and press Enter"
              className="flex-1 p-2 rounded bg-transparent border border-stroke text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <button
              type="button"
              onClick={addBulletManually}
              className="px-4 rounded bg-primary"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="text-subtle block mb-1 text-sm">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-40 p-2 rounded bg-transparent border border-stroke text-main"
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
            ? "Create Experience"
            : "Update Experience"}
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
