import { getPrefectures, getBlocks } from "@/lib/data";
import JapanMap from "@/components/JapanMap";
import Link from "next/link";

const BLOCK_COLORS: Record<string, string> = {
  "01": "#3b82f6", "02": "#ef4444", "03": "#f97316", "04": "#eab308",
  "05": "#a855f7", "06": "#06b6d4", "07": "#22c55e", "08": "#ec4899",
  "09": "#14b8a6", "10": "#f59e0b", "11": "#8b5cf6",
};

export default function HomePage() {
  const prefectures = getPrefectures();
  const blocks = getBlocks();
  const totalDistricts = prefectures.reduce((s, p) => s + p.districtCount, 0);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold">
          衆院選ビジュアルガイド 2026
        </h1>
        <p className="text-gray-500">
          {prefectures.length}都道府県 · {totalDistricts}選挙区 · 11比例ブロック
        </p>
      </section>

      <section>
        <JapanMap />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">比例代表ブロック</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {blocks.map(block => {
            const blockPrefs = prefectures.filter(p => p.blockCode === block.code);
            return (
              <Link
                key={block.code}
                href={`/block/${block.code}`}
                className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: BLOCK_COLORS[block.code] }}
                  />
                  <span className="font-bold">{block.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {block.seats}議席 · {blockPrefs.length}都道府県
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">都道府県一覧</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {prefectures.map(pref => (
            <Link
              key={pref.code}
              href={`/prefecture/${pref.code}`}
              className="rounded-lg bg-white border border-gray-200 p-3 text-center hover:shadow-md transition-shadow"
            >
              <div className="font-bold text-sm">{pref.name}</div>
              <div className="text-xs text-gray-400">{pref.districtCount}区</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
