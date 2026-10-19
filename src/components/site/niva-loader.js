"use client";

import { useEffect } from "react";

const SCRIPT_SRC = "https://app.getniva.ai/pradeep-suthar/widget.js";
const BOT_KEY = "pk_live_05bdd5b34731a5e7d88611bc5c456b8d";

/**
 * Load the chat widget after first user interaction (or a long idle).
 * Keeps initial LCP/TBT clean without removing the feature.
 */
export function NivaLoader() {
  useEffect(() => {
    let loaded = false;
    let timer;

    function load() {
      if (loaded || document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
      loaded = true;
      cleanup();
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.dataset.botKey = BOT_KEY;
      document.body.appendChild(script);
    }

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("scroll", load, { passive: true });
    }

    window.addEventListener("pointerdown", load, { once: true });
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("scroll", load, { once: true, passive: true });
    // Desktop idle fallback so the widget still appears without a click.
    timer = window.setTimeout(load, 8000);

    return cleanup;
  }, []);

  return null;
}
