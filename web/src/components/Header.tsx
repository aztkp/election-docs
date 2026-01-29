import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          🗳️ 衆院選ガイド 2026
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            地図
          </Link>
        </nav>
      </div>
    </header>
  );
}
