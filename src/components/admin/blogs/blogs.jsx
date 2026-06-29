import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { uploadFileToBucket } from "../../../lib/storage";
import {
  Trash2,
  Upload,
  Plus,
  X,
  Bold,
  Italic,
  List,
  Code,
  Link2,
  Image as ImageIcon,
  Heading2,
  Heading3,
} from "lucide-react";

function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // 'list', 'create', 'edit'
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch blogs list
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching blogs", error);
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const openCreateForm = () => {
    setEditingBlog(null);
    setMode("create");
  };

  const openEditForm = (blog) => {
    setEditingBlog(blog);
    setMode("edit");
  };

  const closeModal = () => {
    setMode("list");
    setEditingBlog(null);
  };

  const handleDelete = async (blogId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", blogId);
      if (error) {
        alert("Error deleting blog: " + error.message);
      } else {
        setBlogs(blogs.filter((b) => b.id !== blogId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (blogData) => {
    setSubmitting(true);
    try {
      if (mode === "create") {
        const { data, error } = await supabase
          .from("blogs")
          .insert([blogData])
          .select();
        if (error) {
          alert("Error creating blog: " + error.message);
        } else {
          closeModal();
          fetchBlogs();
        }
      } else if (mode === "edit") {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", editingBlog.id);
        if (error) {
          alert("Error updating blog: " + error.message);
        } else {
          closeModal();
          fetchBlogs();
        }
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading && mode === "list") {
    return <div className="text-subtle p-6">Loading blogs...</div>;
  }

  return (
    <div className="p-2 md:p-4">
      {mode === "list" ? (
        <div>
          <div className="flex items-center mb-6">
            <h2 className="text-main text-2xl font-bold tracking-tight">Blogs Management</h2>
            <button
              onClick={openCreateForm}
              className="bg-primary hover:bg-primary/90 text-black py-2 px-4 rounded-full font-medium ml-auto flex items-center gap-1.5 transition-all duration-300 shadow-[0_4px_15px_rgba(255,219,112,0.15)]"
            >
              <Plus size={16} />
              <span>New Blog</span>
            </button>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-16 border border-stroke/50 rounded-2xl bg-surface/10 text-muted">
              No blogs found. Click "New Blog" to create your first article!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  onClick={() => openEditForm(b)}
                  className="border border-stroke/50 bg-surface/20 flex items-center justify-between p-4 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-input/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {b.bg_image && (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-stroke/30 flex-shrink-0">
                        <img
                          src={b.bg_image}
                          alt={b.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-main font-semibold text-base capitalize group-hover:text-primary">
                        {b.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-subtle/80 mt-1">
                        <span className="bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                          {b.category || "General"}
                        </span>
                        <span>/{b.slug}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(b.id, e)}
                    className="text-subtle bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white p-2.5 rounded-lg transition-all duration-200"
                    title="Delete blog"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1e1e1f] border border-stroke rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stroke/50">
            <h2 className="text-main text-xl font-bold capitalize">
              {mode === "create" ? "Create New Blog" : "Edit Blog"}
            </h2>
            <button
              onClick={closeModal}
              className="text-muted hover:text-main p-1.5 rounded-lg border border-stroke/50 hover:bg-input/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <BlogForm
            initial={editingBlog}
            onCancel={closeModal}
            onSave={handleSave}
            submitting={submitting}
          />
        </div>
      )}
    </div>
  );
}

/* Helper functions to convert raw text / markdown to HTML tags */
const parseInlineMarkdown = (text) => {
  let result = text;

  // Bold: **text**
  result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text* or _text_
  result = result.replace(/\*(.*?)\*/g, "<em>$1</em>");
  result = result.replace(/_(.*?)_/g, "<em>$1</em>");

  // Inline code: `code`
  result = result.replace(/`(.*?)`/g, "<code>$1</code>");

  // Links: [anchor](url)
  result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  return result;
};

const convertRawToHTML = (text) => {
  if (!text) return "";

  // If it already contains HTML paragraph/heading tags, return it directly
  if (/<p>|<h2>|<h3>|<ul>|<ol>|<div>|<pre>|<strong>|<em>/.test(text)) {
    return text;
  }

  const lines = text.split("\n");
  let html = [];
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let inCodeBlock = false;
  let codeContent = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        html.push(`<pre><code>${codeContent.join("\n")}</code></pre>`);
        codeContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Handle lists
    const isBulletList = line.trim().startsWith("- ") || line.trim().startsWith("* ");
    const isNumList = /^\d+\.\s+/.test(line.trim());

    if (isBulletList || isNumList) {
      const currentListType = isBulletList ? "ul" : "ol";
      const cleanLine = isBulletList
        ? line.trim().replace(/^[-*]\s+/, "")
        : line.trim().replace(/^\d+\.\s+/, "");

      if (!inList) {
        inList = true;
        listType = currentListType;
        html.push(`<${listType}>`);
      } else if (listType !== currentListType) {
        html.push(`</${listType}>`);
        listType = currentListType;
        html.push(`<${listType}>`);
      }

      html.push(`  <li>${parseInlineMarkdown(cleanLine)}</li>`);
      continue;
    } else {
      if (inList) {
        html.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
    }

    // Empty lines
    if (line.trim() === "") {
      continue;
    }

    // Headings
    if (line.trim().startsWith("### ")) {
      html.push(`<h3>${parseInlineMarkdown(line.trim().substring(4))}</h3>`);
    } else if (line.trim().startsWith("## ")) {
      html.push(`<h2>${parseInlineMarkdown(line.trim().substring(3))}</h2>`);
    } else if (line.trim().startsWith("# ")) {
      html.push(`<h1>${parseInlineMarkdown(line.trim().substring(2))}</h1>`);
    } else {
      // Normal paragraphs
      // Group contiguous lines
      let paragraphLines = [line];
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim() !== "" &&
        !lines[i + 1].trim().startsWith("#") &&
        !lines[i + 1].trim().startsWith("- ") &&
        !lines[i + 1].trim().startsWith("* ") &&
        !/^\d+\.\s+/.test(lines[i + 1].trim()) &&
        !lines[i + 1].trim().startsWith("```")
      ) {
        i++;
        paragraphLines.push(lines[i]);
      }
      const pText = paragraphLines.join(" ").trim();
      html.push(`<p>${parseInlineMarkdown(pText)}</p>`);
    }
  }

  // Close list if open
  if (inList) {
    html.push(`</${listType}>`);
  }

  return html.join("\n");
};

const cleanHTML = (htmlString) => {
  if (!htmlString) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode(true);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      const ignoredTags = ["meta", "title", "style", "script", "noscript", "link"];
      if (ignoredTags.includes(tagName)) {
        return null;
      }

      if (tagName === "span") {
        const style = node.getAttribute("style") || "";
        const isBold = style.includes("font-weight:700") || style.includes("font-weight: 700") || style.includes("font-weight:bold");
        const isItalic = style.includes("font-style:italic") || style.includes("font-style: italic");

        let container = document.createDocumentFragment();
        for (let child of node.childNodes) {
          const sanitizedChild = sanitizeNode(child);
          if (sanitizedChild) {
            container.appendChild(sanitizedChild);
          }
        }

        if (isBold && isItalic) {
          const strong = document.createElement("strong");
          const em = document.createElement("em");
          em.appendChild(container);
          strong.appendChild(em);
          return strong;
        } else if (isBold) {
          const strong = document.createElement("strong");
          strong.appendChild(container);
          return strong;
        } else if (isItalic) {
          const em = document.createElement("em");
          em.appendChild(container);
          return em;
        } else {
          return container;
        }
      }

      const cleanEl = document.createElement(tagName);

      if (tagName === "a") {
        const href = node.getAttribute("href");
        if (href) cleanEl.setAttribute("href", href);
        cleanEl.setAttribute("target", "_blank");
        cleanEl.setAttribute("rel", "noopener noreferrer");
      }
      if (tagName === "img") {
        const src = node.getAttribute("src");
        const alt = node.getAttribute("alt");
        if (src) cleanEl.setAttribute("src", src);
        if (alt) cleanEl.setAttribute("alt", alt);
      }

      for (let child of node.childNodes) {
        const sanitizedChild = sanitizeNode(child);
        if (sanitizedChild) {
          cleanEl.appendChild(sanitizedChild);
        }
      }

      const selfClosingTags = ["img", "br", "hr"];
      if (!selfClosingTags.includes(tagName) && cleanEl.childNodes.length === 0 && cleanEl.textContent.trim() === "") {
        return null;
      }

      return cleanEl;
    }

    return null;
  };

  const container = document.createElement("div");
  const body = doc.body;
  if (body) {
    for (let child of body.childNodes) {
      const sanitized = sanitizeNode(child);
      if (sanitized) {
        container.appendChild(sanitized);
      }
    }
  }

  return container.innerHTML;
};

const prettifyHTML = (htmlString) => {
  if (!htmlString) return "";
  
  let formatted = htmlString;
  
  // 1. Remove duplicate/unnecessary spacing or existing newlines first
  formatted = formatted.replace(/\n+/g, " ");
  formatted = formatted.replace(/\s+/g, " ");
  
  // 2. Insert double newlines after closing block tags for human readability
  const blockTags = ["p", "h1", "h2", "h3", "h4", "h5", "ul", "ol", "pre", "blockquote"];
  blockTags.forEach(tag => {
    const regex = new RegExp(`</${tag}>`, "gi");
    formatted = formatted.replace(regex, `</${tag}>\n\n`);
  });
  
  // Also insert double newlines after self-closing horizontal rules
  formatted = formatted.replace(/<hr\s*\/?>/gi, "<hr />\n\n");
  
  return formatted.trim();
};

/* Blog Form component with custom rich HTML text editor */
const DEFAULT_CATEGORIES = [
  "Frontend Development",
  "Product Design",
  "UI Design",
  "UX Research",
  "Web Development",
  "Web Design"
];

function BlogForm({ initial, onCancel, onSave, submitting }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");

  const isDefaultCategory = initial?.category ? DEFAULT_CATEGORIES.includes(initial.category) : true;
  const [selectedCategoryType, setSelectedCategoryType] = useState(
    !initial?.category
      ? "Frontend Development"
      : isDefaultCategory
        ? initial.category
        : "Custom"
  );
  const [customCategory, setCustomCategory] = useState(
    isDefaultCategory ? "" : initial?.category || ""
  );

  const [description, setDescription] = useState(initial?.description || "");
  const [content, setContent] = useState(initial?.content || "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description || "");
  const [keywords, setKeywords] = useState(initial?.keywords || "");

  // Image Uploading
  const [bgImage, setBgImage] = useState(initial?.bg_image || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-generate slug from title (as user types, but only if they haven't manually edited it to be completely empty/different)
  useEffect(() => {
    if (!initial && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") // collapse multiple hyphens
        .trim();
      setSlug(generatedSlug);
    }
  }, [title]);


  const [isSourceView, setIsSourceView] = useState(false);
  const editorRef = useRef(null);

  // Sync content state to contentEditable innerHTML on mount and value change
  useEffect(() => {
    if (editorRef.current && !isSourceView) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || "<p><br></p>";
      }
    }
  }, [content, isSourceView]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorPaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const htmlData = clipboardData.getData("text/html");

    // If clipboard has rich HTML formatting (e.g. from Google Docs / MS Word), sanitize it to strip inline CSS/styles
    if (htmlData) {
      e.preventDefault();
      const cleanHTMLData = cleanHTML(htmlData);

      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();

      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = cleanHTMLData;

      const fragment = document.createDocumentFragment();
      let node;
      while ((node = tempDiv.firstChild)) {
        fragment.appendChild(node);
      }

      range.insertNode(fragment);

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
      return;
    }

    const textData = clipboardData.getData("text");
    if (textData) {
      e.preventDefault();

      let formattedText;
      if (!textData.includes("\n")) {
        formattedText = parseInlineMarkdown(textData);
      } else {
        formattedText = convertRawToHTML(textData);
      }

      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();

      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formattedText;

      const fragment = document.createDocumentFragment();
      let node;
      while ((node = tempDiv.firstChild)) {
        fragment.appendChild(node);
      }

      range.insertNode(fragment);

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const executeCommand = (command, arg = null) => {
    if (isSourceView) {
      insertHTMLTag(command);
    } else {
      document.execCommand(command, false, arg);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `blogs/bg_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const res = await uploadFileToBucket({
        bucket: "portfolio",
        path: fileName,
        file,
      });

      if (res.error) {
        alert("Upload failed: " + res.error.message);
      } else if (res.publicUrl) {
        setBgImage(res.publicUrl);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
    setUploading(false);
  };

  // HTML Toolbar actions
  const insertHTMLTag = (tagType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    let replacement = "";

    switch (tagType) {
      case "h2":
        replacement = `<h2>${selectedText || "Heading 2"}</h2>`;
        break;
      case "h3":
        replacement = `<h3>${selectedText || "Heading 3"}</h3>`;
        break;
      case "h4":
        replacement = `<h4>${selectedText || "Heading 4"}</h4>`;
        break;
      case "h5":
        replacement = `<h5>${selectedText || "Heading 5"}</h5>`;
        break;
      case "p":
        replacement = `<p>${selectedText || "Paragraph text"}</p>`;
        break;
      case "bold":
        replacement = `<strong>${selectedText || "Bold Text"}</strong>`;
        break;
      case "italic":
        replacement = `<em>${selectedText || "Italic Text"}</em>`;
        break;
      case "list":
        replacement = selectedText
          ? `<ul>\n${selectedText.split("\n").map(line => `  <li>${line}</li>`).join("\n")}\n</ul>`
          : `<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>`;
        break;
      case "code":
        replacement = selectedText
          ? `<pre><code>${selectedText}</code></pre>`
          : `<pre><code>// code here\nconsole.log("hello world");</code></pre>`;
        break;
      case "link":
        const url = prompt("Enter the URL:", "https://");
        if (url === null) return;
        replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || "Link Text"}</a>`;
        break;
      case "image":
        const imgUrl = prompt("Enter the Image URL (or upload image above to get URL):", "https://");
        if (imgUrl === null) return;
        replacement = `<img src="${imgUrl}" alt="${selectedText || "Image Description"}" />`;
        break;
      default:
        return;
    }

    const newValue =
      textarea.value.substring(0, startPos) +
      replacement +
      textarea.value.substring(endPos);

    setContent(newValue);

    // Reset cursor position helper
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        startPos + replacement.length,
        startPos + replacement.length
      );
    }, 50);
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("text");

    if (pastedText) {
      // If it already looks like HTML, let it paste normally
      if (/<p>|<h2>|<h3>|<ul>|<ol>|<div>|<pre>|<strong>|<em>/.test(pastedText)) {
        return;
      }

      e.preventDefault();

      let formattedText;
      // If it is a single-line paste, only format inline styles (bold, italic, links)
      if (!pastedText.includes("\n")) {
        formattedText = parseInlineMarkdown(pastedText);
      } else {
        formattedText = convertRawToHTML(pastedText);
      }

      const textarea = textareaRef.current;
      if (textarea) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const newValue =
          textarea.value.substring(0, startPos) +
          formattedText +
          textarea.value.substring(endPos);

        setContent(newValue);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            startPos + formattedText.length,
            startPos + formattedText.length
          );
        }, 50);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Title is required");
    if (!content) return alert("Content is required");

    let finalSlug = slug.trim();
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    if (!finalSlug) return alert("Slug is required or could not be generated from the title");

    const finalCategory = selectedCategoryType === "Custom"
      ? (customCategory.trim() || "General")
      : selectedCategoryType;

    // Auto-convert plain text or markdown content to HTML format if it doesn't already contain HTML tags
    let finalContent = content;
    if (!/<p>|<h2>|<h3>|<ul>|<ol>|<div>|<pre>|<strong>|<em>/.test(finalContent)) {
      finalContent = convertRawToHTML(finalContent);
    }

    onSave({
      title,
      slug: finalSlug,
      category: finalCategory,
      description,
      content: finalContent,
      bg_image: bgImage,
      meta_description: metaDescription,
      keywords,
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 2 Column Layout for general details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-subtle text-sm font-semibold mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200"
            placeholder="e.g. Mastering Next.js Performance"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-subtle text-sm font-semibold mb-2">Slug (Auto-generated if empty)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200"
            placeholder="Auto-generated from title if left blank"
          />
        </div>

        {/* Category Dropdown & Custom input */}
        <div>
          <label className="block text-subtle text-sm font-semibold mb-2">Category</label>
          <select
            value={selectedCategoryType}
            onChange={(e) => setSelectedCategoryType(e.target.value)}
            className="w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200 cursor-pointer"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-background text-main">
                {cat}
              </option>
            ))}
            <option value="Custom" className="bg-background text-main">
              Custom / Others...
            </option>
          </select>

          {selectedCategoryType === "Custom" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="mt-3 w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200"
              placeholder="Enter custom category name..."
              required
            />
          )}
        </div>

        {/* Header Image */}
        <div>
          <label className="block text-subtle text-sm font-semibold mb-2">Cover Image</label>
          <div className="flex gap-4 items-center">
            {bgImage ? (
              <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-stroke/50 flex-shrink-0 bg-zinc-800">
                <img src={bgImage} alt="Cover preview" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => setBgImage("")}
                  className="absolute top-0 right-0 bg-black/70 hover:bg-black p-0.5 rounded-bl text-red-500"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-14 rounded-lg border border-dashed border-stroke/80 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 bg-input/40 transition-colors"
              >
                <Upload size={16} className="text-muted" />
                <span className="text-[9px] text-muted mt-1">Upload</span>
              </div>
            )}
            <div className="flex-1">
              <input
                type="text"
                value={bgImage}
                onChange={(e) => setBgImage(e.target.value)}
                className="w-full bg-input border border-stroke rounded-xl px-4 py-2 text-main text-xs outline-none focus:border-primary transition-colors duration-200"
                placeholder="Image URL or upload a file"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {uploading && <span className="text-[10px] text-primary mt-1 block">Uploading file...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-subtle text-sm font-semibold mb-2">Short Description (Cards listing)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200"
          placeholder="Brief summary of the article..."
        />
      </div>

      {/* SEO Section Accordion Title */}
      <div className="pb-2 border-b border-stroke/50">
        <h3 className="text-primary text-sm font-bold uppercase tracking-wider">SEO Fields</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta Description */}
        <div>
          <label className="block text-subtle text-sm font-semibold mb-2">Meta Description (For search engines)</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200"
            placeholder="Recommended: 150-160 characters..."
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-subtle text-sm font-semibold mb-2">Keywords (Comma separated)</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={3}
            className="w-full bg-input border border-stroke rounded-xl px-4 py-3 text-main outline-none focus:border-primary transition-colors duration-200"
            placeholder="nextjs, performance, frontend, web vitals"
          />
        </div>
      </div>

      {/* Content Editor Section */}
      <div className="pb-2 border-b border-stroke/50">
        <h3 className="text-primary text-sm font-bold uppercase tracking-wider">Blog Content Editor</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HTML Editor Panel */}
        <div className="flex flex-col">
          <label className="block text-subtle text-sm font-semibold mb-2">
            {isSourceView ? "Content HTML *" : "Content Editor *"}
          </label>

          {/* Editor toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-surface/50 border border-stroke border-b-0 rounded-t-xl">
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "H2")}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Heading 2"
            >
              <Heading2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "H3")}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Heading 3"
            >
              <Heading3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "H4")}
              className="p-1.5 px-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors text-xs font-bold font-mono"
              title="Heading 4"
            >
              H4
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "H5")}
              className="p-1.5 px-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors text-xs font-bold font-mono"
              title="Heading 5"
            >
              H5
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "P")}
              className="p-1.5 px-2.5 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors text-xs font-bold font-mono"
              title="Paragraph"
            >
              P
            </button>
            <div className="w-px h-6 bg-stroke/60 mx-1" />
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <div className="w-px h-6 bg-stroke/60 mx-1" />
            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "PRE")}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Code Block"
            >
              <Code size={16} />
            </button>
            <div className="w-px h-6 bg-stroke/60 mx-1" />
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter URL:", "https://");
                if (url) executeCommand("createLink", url);
              }}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Insert Link"
            >
              <Link2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter Image URL (or upload image above to get URL):", "https://");
                if (url) executeCommand("insertImage", url);
              }}
              className="p-2 text-subtle hover:text-primary hover:bg-input rounded-md transition-colors"
              title="Insert Image tag"
            >
              <ImageIcon size={16} />
            </button>
            <div className="w-px h-6 bg-stroke/60 mx-1" />
            <button
              type="button"
              onClick={() => {
                const formatted = convertRawToHTML(content);
                setContent(formatted);
              }}
              className="p-1.5 px-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black rounded-lg transition-all duration-300 text-xs font-bold"
              title="Auto-convert plain text or markdown content into clean HTML formatting tags"
            >
              Auto-Format HTML
            </button>
            <div className="w-px h-6 bg-stroke/60 mx-1 ml-auto" />
            <button
              type="button"
              onClick={() => {
                if (!isSourceView) {
                  const pretty = prettifyHTML(content);
                  setContent(pretty);
                }
                setIsSourceView(!isSourceView);
              }}
              className={`p-1.5 px-3 rounded-lg transition-all duration-300 text-xs font-bold ${isSourceView
                  ? "bg-primary text-black"
                  : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black"
                }`}
              title="Toggle between HTML Source View and Rich Text WYSIWYG View"
            >
              {isSourceView ? "Rich Text Editor" : "HTML Source View"}
            </button>
          </div>

          {isSourceView ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              rows={12}
              className="w-full bg-input border border-stroke rounded-b-xl px-4 py-3 text-main font-mono text-sm outline-none focus:border-primary transition-colors duration-200"
              placeholder="Write HTML directly or use toolbar helpers..."
              required
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              onPaste={handleEditorPaste}
              className="w-full min-h-[300px] max-h-[440px] overflow-y-auto bg-input border border-stroke rounded-b-xl px-4 py-3 text-main font-normal text-sm outline-none focus:border-primary transition-colors duration-200
                blog-content
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-main [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-stroke/30 [&_h2]:pb-1
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-main [&_h3]:mt-5 [&_h3]:mb-2
                [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-main [&_h4]:mt-4 [&_h4]:mb-2
                [&_h5]:text-sm [&_h5]:font-bold [&_h5]:text-main [&_h5]:mt-3 [&_h5]:mb-1
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                [&_li]:mb-1
                [&_strong]:text-main [&_strong]:font-semibold
                [&_pre]:bg-surface/50 [&_pre]:border [&_pre]:border-stroke/50 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-5 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto
                [&_code]:bg-surface/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-primary/95
                [&_a]:text-primary [&_a]:underline
                [&_img]:rounded-xl [&_img]:my-5 [&_img]:max-w-full [&_img]:border [&_img]:border-stroke/30
              "
              placeholder="Start typing your blog post content here..."
            />
          )}
        </div>

        {/* Live Preview Panel */}
        <div className="flex flex-col">
          <label className="block text-subtle text-sm font-semibold mb-2">Live styled Preview</label>
          <div className="flex-1 bg-surface/10 border border-stroke rounded-xl p-4 overflow-y-auto min-h-[300px] max-h-[440px]">
            {content ? (
              <div
                className="blog-content w-full text-subtle text-sm leading-relaxed
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-main [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-stroke/30 [&_h2]:pb-1
                  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-main [&_h3]:mt-5 [&_h3]:mb-2
                  [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-main [&_h4]:mt-4 [&_h4]:mb-2
                  [&_h5]:text-sm [&_h5]:font-bold [&_h5]:text-main [&_h5]:mt-3 [&_h5]:mb-1
                  [&_p]:mb-4 [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                  [&_li]:mb-1
                  [&_strong]:text-main [&_strong]:font-semibold
                  [&_pre]:bg-surface/50 [&_pre]:border [&_pre]:border-stroke/50 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-5 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto
                  [&_code]:bg-surface/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:text-primary/95
                  [&_a]:text-primary [&_a]:underline
                  [&_img]:rounded-xl [&_img]:my-5 [&_img]:max-w-full [&_img]:border [&_img]:border-stroke/30
                "
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-muted/60 text-xs italic">
                Content preview will appear here in real-time as you write HTML or use the toolbar options.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-stroke/50">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-5 py-2.5 rounded-full border border-stroke text-subtle hover:bg-input/30 font-medium text-sm transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="bg-primary text-black font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(255,219,112,0.15)]"
        >
          {submitting ? "Saving..." : "Save Blog"}
        </button>
      </div>
    </form>
  );
}

export default BlogsManager;
