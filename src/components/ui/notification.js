"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

const styles = {
  success: {
    icon: CheckCircle2,
    label: "Success",
    className: "border-primary/35 bg-primary/12 text-primary",
  },
  error: {
    icon: AlertCircle,
    label: "Action needed",
    className: "border-red-500/35 bg-red-500/12 text-red-600 dark:text-red-400",
  },
  info: {
    icon: Info,
    label: "Information",
    className: "border-sky-500/35 bg-sky-500/12 text-sky-700 dark:text-sky-300",
  },
};

export function Notification({
  message,
  variant = "info",
  title,
  onDismiss,
  duration = 6500,
}) {
  const [visible, setVisible] = useState(true);
  const config = styles[variant] || styles.info;
  const Icon = config.icon;

  useEffect(() => {
    if (!duration) return undefined;
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  if (!message || !visible) return null;
  function dismiss() {
    setVisible(false);
    onDismiss?.();
  }
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`fixed right-5 top-5 z-50 flex w-[min(28rem,calc(100vw-2.5rem))] items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm shadow-2xl backdrop-blur ${config.className}`}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title || config.label}</p>
        <p className="mt-1 leading-6">{message}</p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-lg p-1 transition hover:bg-background/25"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
