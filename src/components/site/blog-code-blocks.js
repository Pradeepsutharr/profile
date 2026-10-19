"use client";

import { useEffect, useRef } from "react";

function codeText(pre) {
  const code = pre.querySelector("code");
  if (code) return code.innerText.replace(/\n$/, "");
  const clone = pre.cloneNode(true);
  clone.querySelector(".blog-code-toolbar")?.remove();
  return clone.innerText.replace(/\n$/, "");
}

export function BlogHtml({ html, className = "" }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const blocks = root.querySelectorAll("pre.blog-code-block, pre");
    const cleanups = [];

    blocks.forEach((pre) => {
      if (pre.dataset.copyReady === "true") return;
      pre.dataset.copyReady = "true";
      pre.classList.add("blog-code-block");

      const toolbar = document.createElement("div");
      toolbar.className = "blog-code-toolbar";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "blog-code-copy";
      button.setAttribute("aria-label", "Copy code");
      button.innerHTML = `
        <svg class="blog-code-copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="blog-code-copy-label">Copy</span>
      `;

      async function onCopy() {
        try {
          await navigator.clipboard.writeText(codeText(pre));
          button.classList.add("is-copied");
          button.innerHTML = `
            <svg class="blog-code-copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="blog-code-copy-label">Copied</span>
          `;
          window.setTimeout(() => {
            button.classList.remove("is-copied");
            button.innerHTML = `
              <svg class="blog-code-copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span class="blog-code-copy-label">Copy</span>
            `;
          }, 1600);
        } catch {
          button.querySelector(".blog-code-copy-label").textContent = "Failed";
          window.setTimeout(() => {
            button.querySelector(".blog-code-copy-label").textContent = "Copy";
          }, 1600);
        }
      }

      button.addEventListener("click", onCopy);
      toolbar.appendChild(button);
      pre.appendChild(toolbar);
      cleanups.push(() => {
        button.removeEventListener("click", onCopy);
        toolbar.remove();
        delete pre.dataset.copyReady;
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [html]);

  return (
    <div
      ref={rootRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
