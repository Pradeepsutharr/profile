// pages/admin/emails/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function EmailDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [email, setEmail] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [replySubject, setReplySubject] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) loadEmail();
  }, [id]);

  async function loadEmail() {
    setLoading(true);

    const { data: msg } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    const { data: history } = await supabase
      .from("contact_replies")
      .select("*")
      .eq("contact_id", id)
      .order("sent_at", { ascending: true });

    setEmail(msg);
    setReplies(history || []);
    setReplySubject(`Re: ${msg.topic}`);
    setLoading(false);

    if (msg.status === "new") {
      await supabase.from("contacts").update({ status: "read" }).eq("id", id);
    }
  }

  async function sendReply() {
    if (!replyMsg.trim()) return alert("Write a reply");

    setSending(true);

    const res = await fetch("/api/reply-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email.email,
        subject: replySubject,
        message: replyMsg,
        contact_id: email.id,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      alert("Failed to send reply");
      setSending(false);
      return;
    }

    await supabase.from("contacts").update({ status: "replied" }).eq("id", id);

    setReplies((p) => [
      ...p,
      {
        reply_subject: replySubject,
        reply_message: replyMsg,
        sent_at: new Date().toISOString(),
      },
    ]);

    setReplyMsg("");
    setSending(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-main">
      <button
        onClick={() => router.back()}
        className="text-subtle hover:text-main mb-6"
      >
        ← Back
      </button>

      {loading ? (
        <div className="p-6 bg-background border border-stroke rounded">
          Loading…
        </div>
      ) : (
        <>
          {/* Original Message */}
          <div className="bg-background border border-stroke rounded-lg p-5 mb-6">
            <h2 className="text-xl font-semibold mb-2">Original Message</h2>

            <div className="text-sm text-subtle mb-3">
              From: <span className="text-main">{email.name}</span> —{" "}
              <a href={`mailto:${email.email}`} className="text-primary">
                {email.email}
              </a>
            </div>

            <div className="text-sm text-subtle mb-3">
              Received: {new Date(email.created_at).toLocaleString()}
            </div>

            <div className="font-medium mb-3">{email.topic}</div>

            <div className="whitespace-pre-wrap leading-relaxed text-main">
              {email.message}
            </div>

            {email.attachment_url && (
              <a
                href={email.attachment_url}
                target="_blank"
                className="inline-block mt-4 px-4 py-2 bg-primary text-black rounded-md"
              >
                Download attachment
              </a>
            )}
          </div>

          {/* Reply History */}
          {replies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Reply History</h3>

              <div className="space-y-4">
                {replies.map((r, i) => (
                  <div
                    key={i}
                    className="bg-[#262626] border border-stroke p-4 rounded-lg"
                  >
                    <div className="text-sm text-subtle mb-1">
                      {new Date(r.sent_at).toLocaleString()}
                    </div>

                    <div className="font-medium mb-2">{r.reply_subject}</div>

                    <div className="whitespace-pre-wrap text-main">
                      {r.reply_message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        </>
      )}
    </div>
  );
}
