import * as fs from "fs";
import * as path from "path";

const PROJECT_ROOT = path.resolve(process.cwd());
const DOCS_DIR = path.resolve(PROJECT_ROOT, "../election-docs");
const OUT_DIR = path.resolve(PROJECT_ROOT, "src/data/generated");

interface Candidate {
  name: string;
  party: string;
  percentage?: number;
  votes?: number;
  status?: "elected" | "proportional" | "lost";
}

interface Candidate2026 {
  name: string;
  party: string;
  status: string;
  age?: number;
  title?: string;
  wins?: number;
}

interface District {
  number: number;
  regionDescription: string;
  characteristics: string;
  result2024: { candidates: Candidate[]; turnout?: number; margin?: number; marginPt?: number };
  candidates2026: Candidate2026[];
  analysis2026: string;
}

interface Prefecture {
  code: string;
  name: string;
  blockCode: string;
  blockName: string;
  basicInfo: string;
  issues: string[];
  electionCharacteristics: string;
  districts: District[];
  mapImage?: string;
}

interface BlockSeat {
  party: string;
  seats: number;
}

interface Block {
  code: string;
  dirName: string;
  name: string;
  composition: string;
  seats: number;
  results2024: BlockSeat[];
  situation2026: string;
  partyLists: Record<string, string[]>;
}

const BLOCKS = [
  { code: "01", dirName: "01_hokkaido", name: "北海道" },
  { code: "02", dirName: "02_tohoku", name: "東北" },
  { code: "03", dirName: "03_kitakanto", name: "北関東" },
  { code: "04", dirName: "04_minamikanto", name: "南関東" },
  { code: "05", dirName: "05_tokyo", name: "東京" },
  { code: "06", dirName: "06_hokuriku_shinetsu", name: "北陸信越" },
  { code: "07", dirName: "07_tokai", name: "東海" },
  { code: "08", dirName: "08_kinki", name: "近畿" },
  { code: "09", dirName: "09_chugoku", name: "中国" },
  { code: "10", dirName: "10_shikoku", name: "四国" },
  { code: "11", dirName: "11_kyushu_okinawa", name: "九州・沖縄" },
];

const PREF_TO_BLOCK: Record<string, string> = {
  "01": "01", "02": "02", "03": "02", "04": "02", "05": "02", "06": "02", "07": "02",
  "08": "03", "09": "03", "10": "03", "11": "03",
  "12": "04", "14": "04", "19": "04",
  "13": "05",
  "15": "06", "16": "06", "17": "06", "18": "06", "20": "06",
  "21": "07", "22": "07", "23": "07", "24": "07",
  "25": "08", "26": "08", "27": "08", "28": "08", "29": "08", "30": "08",
  "31": "09", "32": "09", "33": "09", "34": "09", "35": "09",
  "36": "10", "37": "10", "38": "10", "39": "10",
  "40": "11", "41": "11", "42": "11", "43": "11", "44": "11", "45": "11", "46": "11", "47": "11",
};

const BLOCK_NAMES: Record<string, string> = {};
BLOCKS.forEach(b => BLOCK_NAMES[b.code] = b.name);

function parseResult2024(block: string): { candidates: Candidate[]; turnout?: number; margin?: number; marginPt?: number } {
  const lines = block.split("\n").filter(l => l.trim());
  const candidates: Candidate[] = [];
  let turnout: number | undefined;
  let margin: number | undefined;
  let marginPt: number | undefined;

  for (const line of lines) {
    // Match candidate line: name（party）  bars  XX.X%  票数 [status]
    const candidateMatch = line.match(/^(.+?)（(.+?)）\s+[█░]+\s+([\d.]+)%\s+([\d,]+)票\s*(.*)/);
    if (candidateMatch) {
      const status = candidateMatch[5].includes("当選") ? "elected" as const
        : candidateMatch[5].includes("比例") ? "proportional" as const
        : "lost" as const;
      candidates.push({
        name: candidateMatch[1].trim(),
        party: candidateMatch[2].trim(),
        percentage: parseFloat(candidateMatch[3]),
        votes: parseInt(candidateMatch[4].replace(/,/g, "")),
        status,
      });
      continue;
    }

    // Match turnout line
    const turnoutMatch = line.match(/投票率:\s*([\d.]+)%/);
    if (turnoutMatch) {
      turnout = parseFloat(turnoutMatch[1]);
    }
    const marginMatch = line.match(/票差:\s*([\d,]+)票/);
    if (marginMatch) {
      margin = parseInt(marginMatch[1].replace(/,/g, ""));
    }
    const ptMatch = line.match(/([\d.]+)pt差/);
    if (ptMatch) {
      marginPt = parseFloat(ptMatch[1]);
    }
  }

  return { candidates, turnout, margin, marginPt };
}

function parseCandidates2026(block: string): Candidate2026[] {
  const lines = block.split("\n").filter(l => l.trim());
  const candidates: Candidate2026[] = [];

  for (const line of lines) {
    // Match: name（party・status、age歳）  title、当選X回
    const match = line.match(/^(.+?)（(.+?)・(.+?)(?:、(\d+)歳)?）\s+(.*)/);
    if (match) {
      const title = match[5].trim();
      const winsMatch = title.match(/当選(\d+)回/);
      candidates.push({
        name: match[1].trim(),
        party: match[2].trim(),
        status: match[3].trim(),
        age: match[4] ? parseInt(match[4]) : undefined,
        title: title.replace(/、?当選\d+回/, "").trim() || undefined,
        wins: winsMatch ? parseInt(winsMatch[1]) : undefined,
      });
    }
  }

  return candidates;
}

function parsePrefecture(content: string, code: string, blockCode: string): Prefecture {
  const nameMatch = content.match(/^# (.+)$/m);
  const name = nameMatch ? nameMatch[1] : "";

  const mapMatch = content.match(/!\[区割り図\]\(\.\.\/images\/(.+?)\)/);
  const mapImage = mapMatch ? mapMatch[1] : undefined;

  // Basic info - text between ## 基本情報 and next ---
  const basicInfoMatch = content.match(/## 基本情報\n\n([\s\S]*?)(?=\n---)/);
  const basicInfo = basicInfoMatch ? basicInfoMatch[1].trim() : "";

  // Issues
  const issuesSection = content.match(/## .+?政治的争点\n\n([\s\S]*?)(?=\n---)/);
  const issues: string[] = [];
  if (issuesSection) {
    const issueMatches = issuesSection[1].matchAll(/### (.+)/g);
    for (const m of issueMatches) {
      issues.push(m[1]);
    }
  }

  // Election characteristics
  const charMatch = content.match(/## 選挙の特徴\n\n([\s\S]*?)(?=\n---)/);
  const electionCharacteristics = charMatch ? charMatch[1].trim() : "";

  // Districts
  const districts: District[] = [];
  const districtPattern = /## 第(\d+)区/g;
  let districtMatch;
  const districtStarts: { number: number; index: number }[] = [];

  while ((districtMatch = districtPattern.exec(content)) !== null) {
    districtStarts.push({ number: parseInt(districtMatch[1]), index: districtMatch.index });
  }

  for (let i = 0; i < districtStarts.length; i++) {
    const start = districtStarts[i].index;
    const end = i + 1 < districtStarts.length ? districtStarts[i + 1].index : content.length;
    const section = content.slice(start, end);

    // Region description
    const regionMatch = section.match(/### 地域構成\n\n([\s\S]*?)(?=\n### )/);
    const regionDescription = regionMatch ? regionMatch[1].trim() : "";

    // Characteristics
    const charMatch2 = section.match(/### 選挙区の特徴\n\n([\s\S]*?)(?=\n### )/);
    const characteristics = charMatch2 ? charMatch2[1].trim() : "";

    // 2024 results
    const resultBlock = section.match(/### 2024年選挙結果\n\n```\n([\s\S]*?)```/);
    const result2024 = resultBlock ? parseResult2024(resultBlock[1]) : { candidates: [] };

    // 2026 candidates
    const candidates2026Block = section.match(/### 2026年選挙の構図\n\n```\n([\s\S]*?)```/);
    const candidates2026 = candidates2026Block ? parseCandidates2026(candidates2026Block[1]) : [];

    // 2026 analysis - text after the 2026 code block
    const analysisMatch = section.match(/### 2026年選挙の構図\n\n```[\s\S]*?```\n\n([\s\S]*?)(?=\n---|\n## |$)/);
    const analysis2026 = analysisMatch ? analysisMatch[1].trim() : "";

    districts.push({
      number: districtStarts[i].number,
      regionDescription,
      characteristics,
      result2024,
      candidates2026,
      analysis2026,
    });
  }

  return {
    code,
    name,
    blockCode,
    blockName: BLOCK_NAMES[blockCode] || "",
    basicInfo,
    issues,
    electionCharacteristics,
    districts,
    mapImage,
  };
}

function parseBlock(content: string, block: typeof BLOCKS[0]): Block {
  const compositionMatch = content.match(/構成:\s*(.+)/);
  const seatsMatch = content.match(/定数:\s*(\d+)議席/);

  const results2024: BlockSeat[] = [];
  const tableMatch = content.match(/## 2024年選挙結果\n\|[\s\S]*?\n((?:\|.*\n)+)/);
  if (tableMatch) {
    const rows = tableMatch[1].trim().split("\n");
    for (const row of rows) {
      const cols = row.split("|").map(c => c.trim()).filter(Boolean);
      if (cols.length >= 2 && cols[0] !== "合計") {
        results2024.push({ party: cols[0], seats: parseInt(cols[1]) || 0 });
      }
    }
  }

  const situationMatch = content.match(/## 2026年選挙の構図\n([\s\S]*?)(?=\n## |$)/);
  const situation2026 = situationMatch ? situationMatch[1].trim() : "";

  const partyLists: Record<string, string[]> = {};
  const listsSection = content.match(/## 各党の比例名簿[\s\S]*$/);
  if (listsSection) {
    let currentParty = "";
    for (const line of listsSection[0].split("\n")) {
      const partyMatch = line.match(/^### (.+)/);
      if (partyMatch) {
        currentParty = partyMatch[1];
        partyLists[currentParty] = [];
        continue;
      }
      if (currentParty && line.trim() && !line.startsWith("#")) {
        partyLists[currentParty].push(line.trim());
      }
    }
  }

  return {
    code: block.code,
    dirName: block.dirName,
    name: block.name,
    composition: compositionMatch ? compositionMatch[1] : "",
    seats: seatsMatch ? parseInt(seatsMatch[1]) : 0,
    results2024,
    situation2026,
    partyLists,
  };
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, "districts"), { recursive: true });

  const allPrefectures: { code: string; name: string; blockCode: string; blockName: string; districtCount: number }[] = [];
  const allBlocks: Block[] = [];

  for (const block of BLOCKS) {
    const blockDir = path.join(DOCS_DIR, block.dirName);
    if (!fs.existsSync(blockDir)) continue;

    // Parse block file
    const blockFiles = fs.readdirSync(blockDir).filter(f => f.startsWith("00_hirei_"));
    if (blockFiles.length > 0) {
      const blockContent = fs.readFileSync(path.join(blockDir, blockFiles[0]), "utf-8");
      allBlocks.push(parseBlock(blockContent, block));
    }

    // Parse prefecture files
    const files = fs.readdirSync(blockDir).filter(f => f.match(/^\d{2}_/) && !f.startsWith("00_") && f.endsWith(".md"));
    for (const file of files) {
      const code = file.match(/^(\d{2})_/)?.[1];
      if (!code) continue;

      const content = fs.readFileSync(path.join(blockDir, file), "utf-8");
      const prefecture = parsePrefecture(content, code, block.code);

      allPrefectures.push({
        code: prefecture.code,
        name: prefecture.name,
        blockCode: prefecture.blockCode,
        blockName: prefecture.blockName,
        districtCount: prefecture.districts.length,
      });

      fs.writeFileSync(
        path.join(OUT_DIR, "districts", `${code}.json`),
        JSON.stringify(prefecture, null, 2)
      );
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "prefectures.json"), JSON.stringify(allPrefectures, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "blocks.json"), JSON.stringify(allBlocks, null, 2));

  console.log(`Parsed ${allPrefectures.length} prefectures, ${allBlocks.length} blocks`);
  console.log(`Total districts: ${allPrefectures.reduce((s, p) => s + p.districtCount, 0)}`);
}

main();
