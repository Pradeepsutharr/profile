// components/admin/item-editor.jsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ItemEditor({ cfg, item, onSaved, onDeleted }) {
  const [title, setTitle] = useState(item[cfg.titleField] || "");
  const [desc, setDesc] = useState(item[cfg.descField] || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(item[cfg.titleField] || "");
    setDesc(item[cfg.descField] || "");
  }, [item, cfg]);

  async function save() {
    setSaving(true);
    try {
      const payload = { [cfg.titleField]: title };
      if (cfg.descField) payload[cfg.descField] = desc;

      const { data, error } = await supabase
        .from(cfg.table)
        .update(payload)
        .eq("id", item.id)
        .select()
        .single();

      if (error) throw error;

      onSaved && onSaved(data);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Delete?")) return;
    try {
      const { error } = await supabase
        .from(cfg.table)
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      onDeleted && onDeleted();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  function cancel() {
    // optional: reset editor state if needed
    onDeleted && onDeleted(null); // closes editor
  }

  return (
    <div className="p-4 border border-stroke rounded-lg bg-[#0b0b0c]">
      <div className="mb-3">
        <label className="block text-sm text-subtle">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-transparent border border-stroke"
        />
      </div>

      {cfg.descField && (
        <div className="mb-3">
          <label className="block text-sm text-subtle">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={6}
            className="w-full p-2 rounded bg-transparent border border-stroke"
          />
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary py-2 px-4 rounded-full"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={remove}
          className="text-red-400 py-2 px-4 rounded-full border border-red-400"
        >
          Delete
        </button>

        <button
          onClick={cancel}
          className="py-2 px-4 rounded-full border border-stroke text-subtle"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
