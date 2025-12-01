// components/admin/education-manager.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Trash2, GripHorizontal } from "lucide-react";

/**
 * Education schema:
 * id uuid
 * institution text
 * degree text
 * start_date date
 * end_date date
 * description text
 * location text
 * order int
 */

export default function EducationManager() {
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
      .from("education")
      .select("*")
      .order("order", { ascending: true, nulls: "last" })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load education error:", error);
      setItems([]);
      setLoading(false);
      return;
    }

    // Normalize order values so UI always shows sensible numbers
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
          .from("education")
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
    if (!form.institution?.trim()) return alert("Institution name is required");

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
        institution: form.institution.trim(),
        degree: form.degree || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        description: form.description || null,
        location: form.location || null,
        order: assignedOrder,
      };

      const res = await supabase.from("education").insert([payload]).select();
      if (res.error) throw res.error;

      closeModal();
      await loadItems();
      alert("Education added");
    } catch (err) {
      console.error("Create education error:", err);
      alert(err.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  // UPDATE
  async function handleUpdate(form) {
    if (!editing) return alert("No record selected");

    setSubmitting(true);

    try {
      const payload = {
        institution: form.institution.trim(),
        degree: form.degree || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        description: form.description || null,
        location: form.location || null,
        order: typeof form.order === "number" ? form.order : 0,
      };

      const res = await supabase
        .from("education")
        .update(payload)
        .eq("id", editing.id)
        .select();

      if (res.error) throw res.error;

      closeModal();
      await loadItems();
      alert("Updated successfully");
    } catch (err) {
      console.error("Update education error:", err);
      alert(err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  // DELETE
  async function handleDelete(item, e) {
    e?.stopPropagation?.();
    if (!confirm("Delete this education record?")) return;

    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", item.id);

      if (error) throw error;
      await loadItems();
      if (editing?.id === item.id) closeModal();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  }

  function openCreate() {
    setEditing(null);
    setMode("create");
  }
  function openEdit(item) {
    setEditing(item);
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
          Education Management
        </h2>
        <button
          onClick={openCreate}
          className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
        >
          + Add Education
        </button>
      </div>

      <ul style={{ padding: 0 }}>
        {loading ? (
          <li className="text-subtle">Loading...</li>
        ) : items.length === 0 ? (
          <li className="text-subtle">No records found</li>
        ) : (
          items.map((ed, idx) => {
            const isDragging = draggingId === ed.id;
            const isDragOver = dragOverId === ed.id && draggingId !== ed.id;
            return (
              <li
                key={ed.id}
                onClick={() => openEdit(ed)}
                draggable
                onDragStart={(e) => onDragStart(e, ed, idx)}
                onDragOver={(e) => onDragOver(e, ed, idx)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, ed, idx)}
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
                      {ed.institution} —{" "}
                      <span className="capitalize">{ed.degree || "—"}</span>
                    </div>

                    <div className="text-subtle text-xs mt-1">
                      {ed.start_date || "—"} — {ed.end_date || "Present"} •{" "}
                      {ed.location || "—"} • order: {ed.order ?? idx + 1}
                    </div>

                    {ed.description ? (
                      <div className="text-subtle text-sm mt-1">
                        {ed.description}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(ed, e)}
                  className="bg-red-600 p-2 rounded-md text-white"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })
        )}
      </ul>

      {(mode === "create" || mode === "edit") && (
        <Modal onClose={closeModal}>
          <EducationForm
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

/* Modal */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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

/* FORM */
function EducationForm({
  mode,
  initial,
  submitting,
  onCancel,
  onCreate,
  onUpdate,
}) {
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (initial) {
      setInstitution(initial.institution || "");
      setDegree(initial.degree || "");
      setStartDate(initial.start_date || "");
      setEndDate(initial.end_date || "");
      setLocation(initial.location || "");
      setDescription(initial.description || "");
      setOrder(Number(initial.order || 0));
    } else {
      setInstitution("");
      setDegree("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setDescription("");
      setOrder(0);
    }
  }, [initial]);

  async function submit() {
    const form = {
      institution,
      degree,
      start_date: startDate || null,
      end_date: endDate || null,
      location,
      description,
      order: Number(order || 0),
    };

    if (mode === "create") await onCreate(form);
    else await onUpdate(form);
  }

  return (
    <div className="max-h-[80vh] overflow-auto hide-scrollbar p-1">
      <h3 className="text-main mb-4 text-xl font-semibold">
        {mode === "create" ? "Add Education" : "Update Education"}
      </h3>

      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <div className="flex flex-col gap-y-4">
        {/* Institution */}
        <div>
          <label className="text-subtle block mb-1 text-sm">
            Institution *
          </label>
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        {/* Degree */}
        <div>
          <label className="text-subtle block mb-1 text-sm">Degree</label>
          <input
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        {/* Dates */}
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
            <label className="text-subtle block mb-1 text-sm">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-subtle block mb-1 text-sm">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-subtle block mb-1 text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        {/* Order */}
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

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-primary py-2 px-4 rounded-full"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
            ? "Add Education"
            : "Update Education"}
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
