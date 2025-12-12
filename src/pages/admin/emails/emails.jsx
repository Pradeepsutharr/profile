// components/admin/emails-manager.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Paperclip, Trash2 } from "lucide-react";

export default function EmailsManager({ pageSize = 30 }) {
  const router = useRouter();

  const [filter, setFilter] = useState("new"); // new | read | replied | all
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const observerRef = useRef(null);

  useEffect(() => {
    offsetRef.current = 0;
    setEmails([]);
    loadInitialEmails();
  }, [filter]);

  async function loadInitialEmails() {
    setLoading(true);

    let q = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "new") q = q.eq("status", "new");
    if (filter === "read") q = q.eq("status", "read");
    if (filter === "replied") q = q.eq("status", "replied");

    const { data, error } = await q.range(0, pageSize - 1);
    if (error) return console.error(error);

    setEmails(data || []);
    setHasMore((data || []).length === pageSize);
    setLoading(false);

    offsetRef.current = pageSize;
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    let q = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "new") q = q.eq("status", "new");
    if (filter === "read") q = q.eq("status", "read");
    if (filter === "replied") q = q.eq("status", "replied");

    const start = offsetRef.current;
    const end = start + pageSize - 1;

    const { data, error } = await q.range(start, end);

    if (!error) {
      setEmails((prev) => [...prev, ...(data || [])]);
      setHasMore((data || []).length === pageSize);
      offsetRef.current = end + 1;
    }

    setLoadingMore(false);
  }, [loadingMore, hasMore, filter]);

  const bottomRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  function openEmail(e) {
    router.push(`/admin/emails/${e.id}`);
  }

  async function removeEmail(id) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    setEmails((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="w-full">
      {/* Filter Buttons */}
      <div className="flex gap-3 mb-5">
        {["new", "read", "replied", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm border border-stroke ${
              filter === f ? "bg-primary text-black" : "bg-background text-main"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <table className="w-full rounded-lg overflow-hidden">
        <thead className="bg-zinc-900 text-subtle">
          <tr>
            <th className="px-6 py-3 text-left text-sm">No.</th>
            <th className="px-6 py-3 text-left text-sm">From</th>
            <th className="px-6 py-3 text-left text-sm">Subject</th>
            <th className="px-6 py-3 text-left text-sm">Received</th>
            <th className="px-6 py-3 text-left text-sm">Status</th>
            <th className="px-6 py-3 text-right text-sm">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading &&
            [...Array(6)].map((_, i) => (
              <tr
                key={i}
                className="border-t border-stroke animate-pulse bg-[#1e1e1f]"
              >
                <td className="px-6 py-5">
                  <div className="h-4 w-8 bg-zinc-700 rounded"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-24 bg-zinc-700 rounded"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-32 bg-zinc-700 rounded"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-40 bg-zinc-700 rounded"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-16 bg-zinc-700 rounded"></div>
                </td>
                <td className="px-6 py-5 text-right"></td>
              </tr>
            ))}

          {!loading &&
            emails.map((e, idx) => (
              <tr
                key={e.id}
                onClick={() => openEmail(e)}
                className="border-t border-stroke hover:bg-[#2b2b2d] cursor-pointer bg-[#1e1e1f]"
              >
                <td className="px-6 py-5 text-sm text-main">{idx + 1}</td>
                <td className="px-6 py-5 text-sm text-main capitalize">
                  {e.name || e.email}
                </td>
                <td className="px-6 py-5 text-sm text-main">{e.topic}</td>
                <td className="px-6 py-5 text-sm text-subtle">
                  {new Date(e.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-5 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      e.status === "new"
                        ? "bg-yellow-100 text-yellow-800"
                        : e.status === "replied"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td
                  className="px-6 py-5 text-right"
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <button
                    onClick={() => removeEmail(e.id)}
                    className="px-3 py-1"
                  >
                    <Trash2 size={18} color="red" />
                  </button>
                </td>
              </tr>
            ))}

          {loadingMore && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-subtle">
                Loading more…
              </td>
            </tr>
          )}

          <tr ref={bottomRef}>
            <td colSpan={6}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
