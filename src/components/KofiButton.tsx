import { Coffee } from "lucide-react";

interface KofiButtonProps {
  size?: "sm" | "md";
}

export default function KofiButton({ size = "md" }: KofiButtonProps) {
  const isSmall = size === "sm";

  return (
    <a
      href="https://ko-fi.com/stibios"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Apoya el proyecto invitando a un café en Ko-fi"
      style={{ backgroundColor: "#ff5e5b" }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white shadow-sm transition hover:opacity-90 ${
        isSmall
          ? "px-4 py-2 text-xs"
          : "w-full rounded-xl px-4 py-3 text-sm"
      }`}
    >
      <Coffee size={isSmall ? 14 : 16} aria-hidden="true" />
      Invítame a un café ☕
    </a>
  );
}
