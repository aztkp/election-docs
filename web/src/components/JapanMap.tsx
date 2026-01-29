"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Prefecture data: code, name, grid position (col, row)
const prefectures: {
  code: string;
  name: string;
  col: number;
  row: number;
}[] = [
  // Hokkaido
  { code: "01", name: "北海道", col: 9, row: 0 },
  // Tohoku
  { code: "02", name: "青森県", col: 9, row: 2 },
  { code: "03", name: "岩手県", col: 9, row: 3 },
  { code: "04", name: "宮城県", col: 9, row: 4 },
  { code: "05", name: "秋田県", col: 8, row: 3 },
  { code: "06", name: "山形県", col: 8, row: 4 },
  { code: "07", name: "福島県", col: 8, row: 5 },
  // Kita-Kanto
  { code: "08", name: "茨城県", col: 9, row: 6 },
  { code: "09", name: "栃木県", col: 9, row: 5 },
  { code: "10", name: "群馬県", col: 8, row: 6 },
  { code: "11", name: "埼玉県", col: 8, row: 7 },
  // Minami-Kanto
  { code: "12", name: "千葉県", col: 9, row: 7 },
  { code: "13", name: "東京都", col: 8, row: 8 },
  { code: "14", name: "神奈川県", col: 9, row: 8 },
  // Hokuriku-Shinetsu
  { code: "15", name: "新潟県", col: 7, row: 4 },
  { code: "16", name: "富山県", col: 6, row: 5 },
  { code: "17", name: "石川県", col: 6, row: 4 },
  { code: "18", name: "福井県", col: 5, row: 5 },
  { code: "19", name: "山梨県", col: 7, row: 7 },
  { code: "20", name: "長野県", col: 7, row: 6 },
  // Tokai
  { code: "21", name: "岐阜県", col: 6, row: 6 },
  { code: "22", name: "静岡県", col: 7, row: 8 },
  { code: "23", name: "愛知県", col: 6, row: 7 },
  { code: "24", name: "三重県", col: 5, row: 7 },
  // Kinki
  { code: "25", name: "滋賀県", col: 5, row: 6 },
  { code: "26", name: "京都府", col: 4, row: 5 },
  { code: "27", name: "大阪府", col: 4, row: 7 },
  { code: "28", name: "兵庫県", col: 3, row: 6 },
  { code: "29", name: "奈良県", col: 5, row: 8 },
  { code: "30", name: "和歌山県", col: 4, row: 8 },
  // Chugoku
  { code: "31", name: "鳥取県", col: 3, row: 5 },
  { code: "32", name: "島根県", col: 2, row: 5 },
  { code: "33", name: "岡山県", col: 3, row: 7 },
  { code: "34", name: "広島県", col: 2, row: 7 },
  { code: "35", name: "山口県", col: 1, row: 7 },
  // Shikoku
  { code: "36", name: "徳島県", col: 4, row: 9 },
  { code: "37", name: "香川県", col: 3, row: 8 },
  { code: "38", name: "愛媛県", col: 2, row: 9 },
  { code: "39", name: "高知県", col: 3, row: 9 },
  // Kyushu-Okinawa
  { code: "40", name: "福岡県", col: 1, row: 8 },
  { code: "41", name: "佐賀県", col: 0, row: 8 },
  { code: "42", name: "長崎県", col: 0, row: 9 },
  { code: "43", name: "熊本県", col: 1, row: 9 },
  { code: "44", name: "大分県", col: 2, row: 8 },
  { code: "45", name: "宮崎県", col: 2, row: 10 },
  { code: "46", name: "鹿児島県", col: 1, row: 10 },
  { code: "47", name: "沖縄県", col: 0, row: 12 },
];

// Block definitions
const blocks: { id: string; name: string; color: string; codes: Set<string> }[] = [
  { id: "01", name: "北海道", color: "#3b82f6", codes: new Set(["01"]) },
  { id: "02", name: "東北", color: "#ef4444", codes: new Set(["02", "03", "04", "05", "06", "07"]) },
  { id: "03", name: "北関東", color: "#f97316", codes: new Set(["08", "09", "10", "11"]) },
  { id: "04", name: "南関東", color: "#eab308", codes: new Set(["12", "14", "19"]) },
  { id: "05", name: "東京", color: "#a855f7", codes: new Set(["13"]) },
  { id: "06", name: "北陸信越", color: "#06b6d4", codes: new Set(["15", "16", "17", "18", "20"]) },
  { id: "07", name: "東海", color: "#22c55e", codes: new Set(["21", "22", "23", "24"]) },
  { id: "08", name: "近畿", color: "#ec4899", codes: new Set(["25", "26", "27", "28", "29", "30"]) },
  { id: "09", name: "中国", color: "#14b8a6", codes: new Set(["31", "32", "33", "34", "35"]) },
  { id: "10", name: "四国", color: "#f59e0b", codes: new Set(["36", "37", "38", "39"]) },
  { id: "11", name: "九州・沖縄", color: "#8b5cf6", codes: new Set(["40", "41", "42", "43", "44", "45", "46", "47"]) },
];

function getBlockColor(code: string): string {
  for (const block of blocks) {
    if (block.codes.has(code)) return block.color;
  }
  return "#94a3b8";
}

function getBlockName(code: string): string {
  for (const block of blocks) {
    if (block.codes.has(code)) return block.name;
  }
  return "";
}

const TILE_SIZE = 80;
const GAP = 6;
const PADDING = 40;
const RADIUS = 8;

export default function JapanMap() {
  const router = useRouter();
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const maxCol = Math.max(...prefectures.map((p) => p.col));
  const maxRow = Math.max(...prefectures.map((p) => p.row));
  const svgWidth = PADDING * 2 + (maxCol + 1) * (TILE_SIZE + GAP);
  const svgHeight = PADDING * 2 + (maxRow + 1) * (TILE_SIZE + GAP);

  const tileX = (col: number) => PADDING + col * (TILE_SIZE + GAP);
  const tileY = (row: number) => PADDING + row * (TILE_SIZE + GAP);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label="日本地図"
      >
        {prefectures.map((pref) => {
          const x = tileX(pref.col);
          const y = tileY(pref.row);
          const color = getBlockColor(pref.code);
          const isHovered = hoveredCode === pref.code;

          return (
            <g
              key={pref.code}
              onClick={() => router.push(`/prefecture/${pref.code}`)}
              onMouseEnter={(e) => {
                setHoveredCode(pref.code);
                const svg = e.currentTarget.closest("svg");
                if (svg) {
                  const pt = svg.createSVGPoint();
                  pt.x = x + TILE_SIZE / 2;
                  pt.y = y;
                  setTooltipPos({ x: pt.x, y: pt.y });
                }
              }}
              onMouseLeave={() => setHoveredCode(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={TILE_SIZE}
                height={TILE_SIZE}
                rx={RADIUS}
                ry={RADIUS}
                fill={color}
                opacity={isHovered ? 0.7 : 1}
                stroke={isHovered ? "#fff" : "rgba(255,255,255,0.3)"}
                strokeWidth={isHovered ? 3 : 1}
              />
              <text
                x={x + TILE_SIZE / 2}
                y={y + TILE_SIZE / 2 - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
              >
                {pref.code}
              </text>
              <text
                x={x + TILE_SIZE / 2}
                y={y + TILE_SIZE / 2 + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="12"
              >
                {pref.name.replace("県", "").replace("府", "").replace("都", "")}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredCode && (() => {
          const pref = prefectures.find((p) => p.code === hoveredCode);
          if (!pref) return null;
          const blockName = getBlockName(pref.code);
          const label = `${pref.name}（${blockName}ブロック）`;
          const tx = tooltipPos.x;
          const ty = tooltipPos.y - 12;
          const textWidth = label.length * 13 + 16;
          return (
            <g pointerEvents="none">
              <rect
                x={tx - textWidth / 2}
                y={ty - 24}
                width={textWidth}
                height={30}
                rx={6}
                fill="rgba(0,0,0,0.85)"
              />
              <text
                x={tx}
                y={ty - 9}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="13"
              >
                {label}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {blocks.map((block) => (
          <div key={block.id} className="flex items-center gap-1.5 text-sm">
            <span
              className="inline-block w-4 h-4 rounded"
              style={{ backgroundColor: block.color }}
            />
            <span>{block.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
