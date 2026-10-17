"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl border bg-secondary/30" />,
});

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block", "link"],
    ["clean"],
  ],
};

const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "align", "blockquote", "code-block", "link"];

export function RichTextEditor({ value, onChange, disabled }) {
  return <div className="mt-2 overflow-hidden rounded-2xl border bg-background [&_.ql-container]:min-h-72 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-72 [&_.ql-editor]:px-4 [&_.ql-editor]:py-4 [&_.ql-editor]:font-sans [&_.ql-editor]:text-base [&_.ql-editor]:leading-7 [&_.ql-snow_.ql-stroke]:stroke-[var(--muted-foreground)] [&_.ql-snow_.ql-fill]:fill-[var(--muted-foreground)] [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-secondary/25">
    <QuillEditor theme="snow" value={value || ""} onChange={onChange} modules={modules} formats={formats} readOnly={disabled} placeholder="Write the article here. Headings, links, quotes, lists, and formatting are saved as HTML." />
  </div>;
}
