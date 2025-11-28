// src/components/ActivityTracker.jsx
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient"; // adjust path if your lib is at /lib

/**
 * ActivityTracker:
 * - auto-signs-out the user after INACTIVITY_TIMEOUT_MS ms of inactivity
 * - resets timer on user interactions
 * - also logs out on visibilitychange when tab becomes hidden for more than timeout
 *
 * Props:
 * - timeoutMs (number) optional. Default 24 hours (24*60*60*1000). Change as needed.
 * - onLogout (fn) optional callback after signOut
 */
export default function ActivityTracker({
  timeoutMs = 24 * 60 * 60 * 1000,
  onLogout,
}) {
  const timerRef = useRef(null);
  const lastHiddenAtRef = useRef(null);

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        // sign out
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error("Auto signOut error", err);
        }
        if (typeof onLogout === "function") onLogout();
      }, timeoutMs);
    };

    // visibility handling (if user hides tab for timeoutMs -> signout)
    const handleVisibility = () => {
      if (document.hidden) {
        lastHiddenAtRef.current = Date.now();
      } else {
        // if tab was hidden and hidden duration > timeout => sign out
        if (lastHiddenAtRef.current) {
          const hiddenFor = Date.now() - lastHiddenAtRef.current;
          if (hiddenFor >= timeoutMs) {
            // force signout immediately
            (async () => {
              try {
                await supabase.auth.signOut();
                alert("Session timed-out, Please login");
              } catch (err) {
                console.error("Auto signOut on visibility error", err);
              }
              if (typeof onLogout === "function") onLogout();
            })();
            return;
          }
        }
        lastHiddenAtRef.current = null;
      }
      resetTimer();
    };

    // attach listeners
    events.forEach((ev) =>
      window.addEventListener(ev, resetTimer, { passive: true })
    );
    document.addEventListener("visibilitychange", handleVisibility);

    // initialize
    resetTimer();

    return () => {
      // cleanup
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [timeoutMs, onLogout]);

  return null; // no UI
}
