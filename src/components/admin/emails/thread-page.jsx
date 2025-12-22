// pages/admin/emails/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function EmailThreadPage() {
  const router = useRouter();
  const [threadId, setThreadId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [replySubject, setReplySubject] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const { id } = router.query;
    if (!id) return;

    setThreadId(id);
    loadThread(id);
  }, [router.isReady]);

  useEffect(() => {
    if (!threadId) return;

    const channel = supabase
      .channel(`emails-thread-${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "emails",
          filter: `gmail_thread_id=eq.${threadId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // prevent duplicates
            if (prev.some((m) => m.id === payload.new.id)) {
              return prev;
            }
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId]);

  async function loadThread(threadId) {
    setLoading(true);

    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("gmail_thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);

    if (data?.length) {
      const subject = data[0].subject || "Conversation";
      setReplySubject(subject.startsWith("Re:") ? subject : `Re: ${subject}`);
    }
  }

  async function sendReply() {
    if (!replyMsg.trim()) return alert("Write a reply");

    setSending(true);

    const lastInbound = [...messages]
      .reverse()
      .find((m) => m.direction === "inbound");

    const res = await fetch("/api/admin/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        to: lastInbound?.from_email,
        subject: replySubject,
        html: replyMsg,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      alert("Failed to send reply");
      setSending(false);
      return;
    }

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        direction: "outbound",
        subject: replySubject,
        body_html: replyMsg,
        created_at: new Date().toISOString(),
      },
    ]);

    setReplyMsg("");
    setSending(false);
    await loadThread(threadId);
  }

  if (loading) {
    return <div className="p-6 max-w-4xl mx-auto text-subtle">Loading…</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-main">
      <button
        onClick={() => router.back()}
        className="text-subtle hover:text-main mb-6"
      >
        ← Back
      </button>

      {/* Thread Messages */}
      {messages.map((msg, i) => (
        <div
          key={msg.id || i}
          className="bg-background border border-stroke rounded-lg p-5 mb-6"
        >
          <h2 className="text-lg font-semibold mb-2">
            {msg.direction === "outbound"
              ? "Your Reply"
              : msg.from_name || msg.from_email || "Client"}
          </h2>

          <div className="text-sm text-subtle mb-3">
            {msg.direction === "outbound" ? (
              <>
                From: <span className="text-main">You</span>
              </>
            ) : (
              <>
                From:{" "}
                <span className="text-main">
                  {msg.from_name ? msg.from_name : msg.from_email}
                </span>
              </>
            )}
          </div>

          <div className="text-sm text-subtle mb-3">
            {new Date(msg.created_at).toLocaleString()}
          </div>

          <div className="font-medium mb-3">{msg.subject}</div>

          <div className="whitespace-pre-wrap leading-relaxed text-main">
            {msg.body_text || msg.snippet}
          </div>
        </div>
      ))}

      {/* Reply Box */}
      <div className="bg-background border border-stroke rounded-lg p-5 mt-8">
        <h2 className="text-lg font-semibold mb-3">Send Reply</h2>

        <label className="text-sm text-subtle block mb-1">Subject</label>
        <input
          value={replySubject}
          onChange={(e) => setReplySubject(e.target.value)}
          className="w-full p-2 rounded bg-transparent border border-stroke text-main mb-3"
        />

        <label className="text-sm text-subtle block mb-1">Message</label>
        <textarea
          rows={6}
          value={replyMsg}
          onChange={(e) => setReplyMsg(e.target.value)}
          className="w-full p-3 rounded border border-stroke bg-transparent text-main mb-4"
        />

        <button
          onClick={sendReply}
          disabled={sending}
          className="px-4 py-2 bg-primary text-black rounded-full"
        >
          {sending ? "Sending…" : "Send Reply"}
        </button>
      </div>
    </div>
  );
}
