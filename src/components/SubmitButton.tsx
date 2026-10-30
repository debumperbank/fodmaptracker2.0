"use client";

import { useFormStatus } from "react-dom";
import type { CSSProperties, ReactNode } from "react";

export function SubmitButton({
  children,
  confirmMessage,
  pendingLabel = "Bezig…",
  className,
  style,
  ariaLabel,
}: {
  children: ReactNode;
  confirmMessage?: string;
  pendingLabel?: string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      style={style}
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }
        if (confirmMessage && !window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
