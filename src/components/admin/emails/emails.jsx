// components/admin/emails-manager.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import { Trash2, Star } from "lucide-react";

export default function EmailsManager({ pageSize = 30 }) {
  const router = useRouter();

  const [filter, setFilter] = useState("all"); // new | read | replied | all
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

  async function buildQuery(from, to) {
    let q = supabase
      .from("emails")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "new") q = q.eq("is_read", false);
    if (filter === "read") q = q.eq("is_read", true);
    if (filter === "replied") q = q.eq("direction", "outbound");

    return q.range(from, to);
  }

  async function loadInitialEmails() {
    setLoading(true);

    const { data, error } = await buildQuery(0, pageSize - 1);
    if (error) console.error(error);

    setEmails(data || []);
    setHasMore((data || []).length === pageSize);
    offsetRef.current = pageSize;
    setLoading(false);
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const start = offsetRef.current;
    const end = start + pageSize - 1;

    const { data } = await buildQuery(start, end);

    if (data) {
      setEmails((prev) => [...prev, ...data]);
      setHasMore(data.length === pageSize);
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

  function openEmail(email) {
    router.push(`/admin/emails/${email.gmail_thread_id}`);
  }

  async function toggleStar(email, ev) {
    ev.stopPropagation();

    await fetch("/api/admin/star-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: email.gmail_message_id,
        star: !email.is_starred,
      }),
    });

    setEmails((prev) =>
      prev.map((e) =>
        e.id === email.id ? { ...e, is_starred: !e.is_starred } : e
      )
    );
  }

  async function deleteEmail(email, ev) {
    ev.stopPropagation();

    const ok = confirm(
      "This will move the email thread to Trash in Gmail. Continue?"
    );
    if (!ok) return;

    const res = await fetch("/api/admin/delete-thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId: email.gmail_thread_id,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      alert("Failed to delete email from Gmail");
      return;
    }

    // remove from UI
    setEmails((prev) =>
      prev.filter((e) => e.gmail_thread_id !== email.gmail_thread_id)
    );
  }

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex gap-3 mb-5">
        {["all", "new", "read", "replied"].map((f) => (
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
        <thead className="bg-zinc-900 text-main">
          <tr>
            <th className="px-6 py-3 text-left text-sm">#</th>
            <th className="px-6 py-3 text-left text-sm">From</th>
            <th className="px-6 py-3 text-left text-sm">Subject</th>
            <th className="px-6 py-3 text-left text-sm">Received</th>
            <th className="px-6 py-3 text-left text-sm">State</th>
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
                <td colSpan={6} className="px-6 py-5">
                  <div className="h-4 w-full bg-zinc-700 rounded" />
                </td>
              </tr>
            ))}

          {!loading &&
            emails.map((e, idx) => (
              <tr
                key={e.id}
                onClick={() => openEmail(e)}
                className="border-t border-stroke hover:bg-[#2b2b2d] cursor-pointer bg-[#1e1e1f]"
              >
                <td className="px-6 py-5 text-sm text-subtle">{idx + 1}</td>

                <td className="px-6 py-5 text-sm text-subtle">{e.from_name}</td>

                <td className="px-6 py-5 text-sm text-subtle">
                  {e.subject || "(no subject)"}
                  <div className="text-xs text-subtle truncate max-w-md">
                    {e.snippet}
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-subtle">
                  {new Date(e.created_at).toLocaleString()}
                </td>

                <td className="px-6 py-5 text-sm">
                  {!e.is_read ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      UNREAD
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      READ
                    </span>
                  )}
                </td>

                <td
                  className="px-6 py-5 text-right"
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <div className="flex justify-end gap-3">
                    {/* Star */}
                    <button onClick={(ev) => toggleStar(e, ev)}>
                      <Star
                        size={18}
                        fill={e.is_starred ? "gold" : "none"}
                        color={e.is_starred ? "gold" : "gray"}
                      />
                    </button>

                    {/* Delete */}
                    <button onClick={(ev) => deleteEmail(e, ev)}>
                      <Trash2
                        size={18}
                        className="text-red-500 hover:text-red-600"
                      />
                    </button>
                  </div>
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
            <td colSpan={6} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
