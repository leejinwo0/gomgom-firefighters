// 세션 ID는 이 함수 하나로만 만듭니다. (예전 sessionId / session_id 두 키 혼용 문제 해결)
const KEY = "sessionId";

export function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      const d = new Date();
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      id = `session_${ymd}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "session_demo";
  }
}

export function resetSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 저장소를 쓸 수 없는 환경 */
  }
}
