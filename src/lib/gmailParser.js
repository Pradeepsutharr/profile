// lib/gmailParser.js
export function parseGmailMessage(message) {
  const headers = message.payload.headers || [];

  const getHeader = (name) => headers.find((h) => h.name === name)?.value || "";

  let rawHtml = "";
  let plainText = "";

  function extractParts(parts = []) {
    for (const part of parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        plainText = Buffer.from(part.body.data, "base64").toString("utf-8");
      }

      if (part.mimeType === "text/html" && part.body?.data) {
        rawHtml = Buffer.from(part.body.data, "base64").toString("utf-8");
      }

      if (part.parts) extractParts(part.parts);
    }
  }

  if (message.payload.parts) {
    extractParts(message.payload.parts);
  } else if (message.payload.body?.data) {
    rawHtml = Buffer.from(message.payload.body.data, "base64").toString(
      "utf-8"
    );
  }

  // 🔥 Extract ONLY the actual user message from HTML
  let cleanMessage = plainText;

  if (!cleanMessage && rawHtml) {
    const match = rawHtml.match(/<div class="message">([\s\S]*?)<\/div>/);

    if (match) {
      cleanMessage = match[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+>/g, "") // strip any remaining tags
        .trim();
    }
  }

  return {
    subject: getHeader("Subject"),
    from: getHeader("From"),
    to: getHeader("To"),
    date: getHeader("Date"),

    // ✅ THIS is what you show in UI
    body_text: cleanMessage || null,

    // optional (for future)
    body_html: rawHtml || null,

    snippet: message.snippet || null,
  };
}
