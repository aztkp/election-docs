import { getBlock, getBlocks, getPrefectures } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPartyColor } from "@/lib/types";

export async function generateStaticParams() {
  return getBlocks().map(b => ({ code: b.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const block = getBlock(code);
  return { title: block ? `比例${block.name}ブロック - 衆院選ガイド 2026` : "Not Found" };
}

export default async function BlockPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const block = getBlock(code);
  if (!block) notFound();

  const prefectures = getPrefectures().filter(p => p.blockCode === code);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← 地図に戻る</Link>
      </div>

      <h1 className="text-3xl font-bold">比例{block.name}ブロック</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-3">
          <h2 className="font-bold">基本情報</h2>
          <div className="text-sm space-y-1">
            <div><span className="text-gray-500">構成:</span> {block.composition}</div>
            <div><span className="text-gray-500">定数:</span> {block.seats}議席</div>
          </div>
        </div>

        {block.results2024.length > 0 && (
          <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-3">
            <h2 className="font-bold">2024年結果</h2>
            <div className="space-y-2">
              {block.results2024.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="text-xs rounded-full px-2 py-0.5 text-white"
                    style={{ backgroundColor: getPartyColor(r.party) }}
                  >
                    {r.party}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(r.seats / block.seats) * 100}%`,
                        backgroundColor: getPartyColor(r.party),
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold">{r.seats}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {block.situation2026 && (
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <h2 className="font-bold mb-2">2026年の構図</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{block.situation2026}</p>
        </div>
      )}

      {Object.keys(block.partyLists).length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-3">
          <h2 className="font-bold">比例名簿</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(block.partyLists).map(([party, members]) => (
              <div key={party}>
                <h3
                  className="text-sm font-bold mb-1 flex items-center gap-1"
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: getPartyColor(party) }}
                  />
                  {party}
                </h3>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {members.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-bold">構成都道府県</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {prefectures.map(p => (
            <Link
              key={p.code}
              href={`/prefecture/${p.code}`}
              className="rounded-xl bg-white border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="font-bold">{p.name}</div>
              <div className="text-xs text-gray-400">{p.districtCount}選挙区</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
