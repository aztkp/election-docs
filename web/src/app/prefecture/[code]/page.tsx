import { getPrefectureDetail, getPrefectures } from "@/lib/data";
import { BLOCKS } from "@/lib/types";
import DistrictSection from "@/components/DistrictSection";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getPrefectures().map(p => ({ code: p.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const pref = await getPrefectureDetail(code);
  return { title: pref ? `${pref.name} - 衆院選ガイド 2026` : "Not Found" };
}

export default async function PrefecturePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const pref = await getPrefectureDetail(code);
  if (!pref) notFound();

  const block = BLOCKS.find(b => b.code === pref.blockCode);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← 地図に戻る</Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{pref.name}</h1>
        {block && (
          <Link href={`/block/${block.code}`} className="text-sm text-gray-500 hover:underline">
            比例{block.name}ブロック
          </Link>
        )}
      </div>

      {pref.basicInfo && (
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <p className="text-sm text-gray-700 leading-relaxed">{pref.basicInfo}</p>
        </div>
      )}

      {pref.issues.length > 0 && (
        <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-2">
          <h2 className="font-bold">政治的争点</h2>
          <div className="flex flex-wrap gap-2">
            {pref.issues.map((issue, i) => (
              <span key={i} className="text-sm rounded-full bg-blue-50 text-blue-700 px-3 py-1">
                {issue}
              </span>
            ))}
          </div>
        </div>
      )}

      {pref.electionCharacteristics && (
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <h2 className="font-bold mb-2">選挙の特徴</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{pref.electionCharacteristics}</p>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-bold">選挙区一覧（{pref.districts.length}区）</h2>
        {pref.districts.map(d => (
          <DistrictSection key={d.number} district={d} />
        ))}
      </div>
    </div>
  );
}
