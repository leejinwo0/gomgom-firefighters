/**
 * 360° 라벨 파일 파싱 — 한 줄에 "클래스 yaw pitch 너비 높이" (단위: 도)
 * 예) 1 143.19 10.15 26.75 14.97
 */
export function parseLabels(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/).map(Number))
    .filter((v) => v.length >= 5 && v.slice(0, 5).every(Number.isFinite))
    .map(([cls, yaw, pitch, w, h]) => ({ cls, yaw, pitch, w, h }));
}

// -180°/180° 경계를 넘는 박스도 맞게 판정하도록 yaw 차이를 -180~180으로 정규화
const yawDiff = (a, b) => ((a - b + 540) % 360) - 180;

export function isInsideBox(yaw, pitch, box) {
  return Math.abs(yawDiff(yaw, box.yaw)) < box.w / 2 && Math.abs(pitch - box.pitch) < box.h / 2;
}

export function findBoxAt(yaw, pitch, boxes) {
  return boxes.find((box) => isInsideBox(yaw, pitch, box)) ?? null;
}
