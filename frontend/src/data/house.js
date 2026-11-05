// 집 등록에 쓰는 고정 데이터

export const HOUSE_TYPES = ["아파트", "단독주택", "빌라", "기타"];

// 전개도 격자 크기 (원본과 동일)
export const GRID = { cols: 20, rows: 10 };

// 전개도 도구: 방 6개 + 지우개 (원본 색상 유지)
export const ROOM_TOOLS = [
  { key: "room1", label: "거실", color: "#FFBEBE" },
  { key: "room2", label: "방 2", color: "#FFBC6F" },
  { key: "room3", label: "방 3", color: "#FFF697" },
  { key: "room4", label: "방 4", color: "#86E5AA" },
  { key: "room5", label: "방 5", color: "#C2C1FF" },
  { key: "room6", label: "방 6", color: "#DD9EFF" },
];
export const ERASER = { key: "eraser", label: "지우개", color: "#f1f3f5" };
export const roomColor = (key) => ROOM_TOOLS.find((t) => t.key === key)?.color ?? "#fff";
export const defaultRoomName = (key) => ROOM_TOOLS.find((t) => t.key === key)?.label ?? key;

// 전개도를 그리지 않았을 때 쓰는 예시 (원본 HouseStep3 기본값)
export const SAMPLE_ROOM_MAP = (() => {
  const map = {};
  const fill = (key, x1, y1, x2, y2) => {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) map[`${x},${y}`] = key;
  };
  fill("room1", 2, 2, 8, 6);
  fill("room2", 10, 2, 13, 4);
  fill("room3", 10, 5, 13, 6);
  fill("room4", 2, 7, 5, 8);
  return map;
})();

// 데모 모드: 방마다 샘플 집의 360° 화면을 순서대로 연결
export const SAMPLE_ROOM_ORDER = ["livingRoom", "mainRoom", "kitchen", "hamzzyRoom", "entrance", "entranceOpen"];

// 데모 모드: 거실에서 인식된 문 (해커톤 당시 실제 탐지 결과에서 발췌)
export const SAMPLE_DOORS = [1, 2, 3, 4].map((i) => `/images/sample-doors/door${i}.jpg`);

// 탐지 모델 클래스 → 화재 요인 이름 (문은 제외)
export const HAZARDS = [
  { key: "powersocket", label: "콘센트" },
  { key: "powerstrip", label: "멀티탭" },
  { key: "gasstove", label: "가스레인지" },
  { key: "microwave", label: "전자레인지" },
  { key: "electricfan", label: "선풍기" },
  { key: "fireextinguisher", label: "소화기" },
];
export const SAMPLE_HAZARDS = ["powersocket", "gasstove", "microwave", "electricfan"];

export const DOOR_DESTINATIONS = ["현관", "화장실", "베란다", "기타"];
