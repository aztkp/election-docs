import { getPartyColor } from "@/lib/types";
import type { Candidate2026 } from "@/lib/types";

export default function CandidateCard({ candidate }: { candidate: Candidate2026 }) {
  const color = getPartyColor(candidate.party);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
        style={{ backgroundColor: color }}
      >
        {candidate.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm">{candidate.name}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          <span
            className="text-xs rounded-full px-2 py-0.5 text-white"
            style={{ backgroundColor: color }}
          >
            {candidate.party}
          </span>
          <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100 text-gray-600">
            {candidate.status}
          </span>
          {candidate.age && (
            <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100 text-gray-600">
              {candidate.age}歳
            </span>
          )}
          {candidate.wins !== undefined && candidate.wins > 0 && (
            <span className="text-xs rounded-full px-2 py-0.5 bg-amber-100 text-amber-700">
              当選{candidate.wins}回
            </span>
          )}
        </div>
        {candidate.title && (
          <div className="text-xs text-gray-400 mt-1">{candidate.title}</div>
        )}
      </div>
    </div>
  );
}
