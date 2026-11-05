// 훈련 진행 상태 저장 (브라우저 localStorage). 저장소를 못 쓰는 환경에서도 앱은 동작
const KEY = "gomgom.progress";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}
function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 무시 */
  }
}

export function startScenario(id) {
  const data = read();
  data[id] = { ...data[id], startedAt: Date.now() };
  write(data);
}

export function completeScenario(id) {
  const data = read();
  const prev = data[id] ?? {};
  const completedAt = Date.now();
  data[id] = { ...prev, completedAt, durationMs: prev.startedAt ? completedAt - prev.startedAt : null };
  write(data);
  return data[id];
}

export function getProgress(id) {
  return read()[id] ?? {};
}

export const isCompleted = (id) => Boolean(getProgress(id).completedAt);

export function formatDuration(ms) {
  if (!ms && ms !== 0) return null;
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}분 ${s % 60}초`;
}

export function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
