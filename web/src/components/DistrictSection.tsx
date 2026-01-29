"use client";

import { useState } from "react";
import type { District } from "@/lib/types";
import VoteBar from "./VoteBar";
import CandidateCard from "./CandidateCard";

export default function DistrictSection({ district }: { district: District }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-600">{district.number}</span>
          <span className="font-medium">第{district.number}区</span>
          {district.result2024.candidates.length > 0 && (
            <span className="text-xs text-gray-400">
              {district.result2024.candidates.length}候補
            </span>
          )}
        </div>
        <span className="text-gray-400">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {district.characteristics && (
            <p className="text-sm text-gray-600">{district.characteristics}</p>
          )}

          {district.result2024.candidates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-700">2024年結果</h4>
              <div className="space-y-1.5">
                {district.result2024.candidates.map((c, i) => (
                  <VoteBar
                    key={i}
                    name={c.name}
                    party={c.party}
                    percentage={c.percentage ?? 0}
                    votes={c.votes}
                    status={c.status}
                  />
                ))}
              </div>
              {district.result2024.turnout !== undefined && (
                <div className="text-xs text-gray-400 mt-1">
                  投票率: {district.result2024.turnout}%
                  {district.result2024.margin !== undefined && (
                    <> · 票差: {district.result2024.margin.toLocaleString()}票</>
                  )}
                  {district.result2024.marginPt !== undefined && (
                    <> ({district.result2024.marginPt}pt差)</>
                  )}
                </div>
              )}
            </div>
          )}

          {district.candidates2026.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-700">2026年の構図</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {district.candidates2026.map((c, i) => (
                  <CandidateCard key={i} candidate={c} />
                ))}
              </div>
              {district.analysis2026 && (
                <p className="text-sm text-gray-600 mt-2">{district.analysis2026}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
