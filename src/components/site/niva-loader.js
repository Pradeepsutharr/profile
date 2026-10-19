"use client";

import { useEffect } from "react";

const SCRIPT_SRC = "https://app.getniva.ai/pradeep-suthar/widget.js";
const BOT_KEY = "pk_live_05bdd5b34731a5e7d88611bc5c456b8d";

/**
 * Load the chat widget only after a real user gesture.
 * Avoid scroll/idle loading so Lighthouse/PSI do not pull in the widget.
 */
export function NivaLoader() {
  useEffect(() => {
    let loaded = false;

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
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      window.removeEventListener("touchstart", load);
    }

    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });
    window.addEventListener("touchstart", load, { once: true, passive: true });

    return cleanup;
  }, []);

  return null;
}
