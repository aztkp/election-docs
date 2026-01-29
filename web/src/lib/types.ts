export interface Candidate {
  name: string;
  party: string;
  percentage?: number;
  votes?: number;
  status?: "elected" | "proportional" | "lost";
}

export interface Candidate2026 {
  name: string;
  party: string;
  status: string; // e.g. "現職", "前職", "新人", "元職"
  age?: number;
  title?: string;
  wins?: number;
}

export interface ElectionResult {
  candidates: Candidate[];
  turnout?: number;
  margin?: number;
  marginPt?: number;
}

export interface District {
  number: number;
  regionDescription: string;
  characteristics: string;
  result2024: ElectionResult;
  candidates2026: Candidate2026[];
  analysis2026: string;
}

export interface Prefecture {
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

export interface BlockSeat {
  party: string;
  seats: number;
}

export interface Block {
  code: string;
  dirName: string;
  name: string;
  composition: string;
  seats: number;
  results2024: BlockSeat[];
  situation2026: string;
  partyLists: Record<string, string[]>;
}

export const PARTY_COLORS: Record<string, string> = {
  "自民": "#2563eb",
  "立憲": "#dc2626",
  "維新": "#16a34a",
  "国民": "#f97316",
  "共産": "#991b1b",
  "れいわ": "#7c3aed",
  "参政": "#ca8a04",
  "中道改革連合": "#0891b2",
  "中道": "#0891b2",
  "公明": "#f59e0b",
  "無所属": "#6b7280",
};

export function getPartyColor(party: string): string {
  for (const [key, color] of Object.entries(PARTY_COLORS)) {
    if (party.includes(key)) return color;
  }
  return "#6b7280";
}

export const BLOCKS: { code: string; dirName: string; name: string }[] = [
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

export const PREFECTURE_TO_BLOCK: Record<string, string> = {
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

export const PREFECTURE_NAMES: Record<string, string> = {
  "01": "北海道", "02": "青森県", "03": "岩手県", "04": "宮城県", "05": "秋田県",
  "06": "山形県", "07": "福島県", "08": "茨城県", "09": "栃木県", "10": "群馬県",
  "11": "埼玉県", "12": "千葉県", "13": "東京都", "14": "神奈川県", "15": "新潟県",
  "16": "富山県", "17": "石川県", "18": "福井県", "19": "山梨県", "20": "長野県",
  "21": "岐阜県", "22": "静岡県", "23": "愛知県", "24": "三重県", "25": "滋賀県",
  "26": "京都府", "27": "大阪府", "28": "兵庫県", "29": "奈良県", "30": "和歌山県",
  "31": "鳥取県", "32": "島根県", "33": "岡山県", "34": "広島県", "35": "山口県",
  "36": "徳島県", "37": "香川県", "38": "愛媛県", "39": "高知県", "40": "福岡県",
  "41": "佐賀県", "42": "長崎県", "43": "熊本県", "44": "大分県", "45": "宮崎県",
  "46": "鹿児島県", "47": "沖縄県",
};
