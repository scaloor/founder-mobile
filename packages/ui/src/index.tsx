import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <section
      style={{
        width: "min(720px, 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: 24,
        background: "white",
        padding: 32,
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
      }}
    >
      {children}
    </section>
  );
}

export function Button({ children }: PropsWithChildren) {
  return (
    <button
      type="button"
      style={{
        marginTop: 16,
        border: 0,
        borderRadius: 999,
        background: "#111827",
        color: "white",
        padding: "12px 18px",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}
