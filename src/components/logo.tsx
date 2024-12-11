import Link from "next/link"; // Assuming you're using react-router for navigation

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img src="/logo.png" alt="IIIT Logo" className="w-8 h-8" />
      <span className="hidden md:block text-zinc-700 text-lg font-medium">
        IIIT U Today
      </span>
    </Link>
  );
}
