/**
 * 우리 집 등록 정보 (브라우저에 저장)
 * { address, floor, type, roomMap, rooms: { room1: { name, source, sampleRoom, panorama, labels, doors } },
 *   doorLinks: { 0: "방 2" }, hazards: ["powersocket"], completed }
 */
const KEY = "gomgom.house";

export function getHouse() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveHouse(patch) {
  const next = { ...getHouse(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* 저장소를 쓸 수 없는 환경 */
  }
  return next;
}

export function saveRoom(key, patch) {
  const house = getHouse();
  return saveHouse({ rooms: { ...house.rooms, [key]: { ...house.rooms?.[key], ...patch } } });
}

// 전개도에 그려진 방 목록 (room1, room2 … 순서)
export const roomKeysOf = (roomMap = {}) => [...new Set(Object.values(roomMap))].sort();

// 방의 격자 범위와 중심 (라벨 위치 계산용)
export function roomBounds(roomMap = {}) {
  const out = {};
  for (const [cell, key] of Object.entries(roomMap)) {
    const [x, y] = cell.split(",").map(Number);
    const b = (out[key] ??= { minX: x, maxX: x, minY: y, maxY: y, sx: 0, sy: 0, n: 0 });
    b.minX = Math.min(b.minX, x);
    b.maxX = Math.max(b.maxX, x);
    b.minY = Math.min(b.minY, y);
    b.maxY = Math.max(b.maxY, y);
    b.sx += x;
    b.sy += y;
    b.n += 1;
  }
  for (const b of Object.values(out)) {
    b.cx = b.sx / b.n;
    b.cy = b.sy / b.n;
  }
  return out;
}
