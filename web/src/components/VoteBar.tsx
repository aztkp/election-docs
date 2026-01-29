"use client";

import { getPartyColor } from "@/lib/types";

interface VoteBarProps {
  name: string;
  party: string;
  percentage: number;
  votes?: number;
  status?: "elected" | "proportional" | "lost";
}

export default function VoteBar({ name, party, percentage, votes, status }: VoteBarProps) {
  const color = getPartyColor(party);
  const statusLabel = status === "elected" ? "✅ 当選"
    : status === "proportional" ? "🔄 比例"
    : "";

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-24 shrink-0 font-medium truncate">{name}</div>
      <div className="w-16 shrink-0 text-xs rounded-full px-2 py-0.5 text-white text-center" style={{ backgroundColor: color }}>
        {party}
      </div>
      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-12 text-right text-xs text-gray-600">{percentage}%</div>
      {votes !== undefined && (
        <div className="w-20 text-right text-xs text-gray-400">{votes.toLocaleString()}票</div>
      )}
      {statusLabel && (
        <div className="w-16 text-xs">{statusLabel}</div>
      )}
    </div>
  );
}
