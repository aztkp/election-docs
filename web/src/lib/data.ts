import prefecturesData from "@/data/generated/prefectures.json";
import blocksData from "@/data/generated/blocks.json";
import type { Prefecture, Block } from "./types";

export interface PrefectureSummary {
  code: string;
  name: string;
  blockCode: string;
  blockName: string;
  districtCount: number;
}

export function getPrefectures(): PrefectureSummary[] {
  return prefecturesData as PrefectureSummary[];
}

export function getBlocks(): Block[] {
  return blocksData as Block[];
}

export async function getPrefectureDetail(code: string): Promise<Prefecture | null> {
  try {
    const data = await import(`@/data/generated/districts/${code}.json`);
    return data.default as Prefecture;
  } catch {
    return null;
  }
}

export function getBlock(code: string): Block | undefined {
  return (blocksData as Block[]).find(b => b.code === code);
}
