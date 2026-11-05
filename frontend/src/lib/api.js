import { apiUrl, IS_DEMO } from "./config";

// 방 영상 업로드 → 서버에서 스티칭·YOLO 처리 후 결과 반환
export async function uploadRoomVideo({ file, roomType, sessionId }) {
  if (IS_DEMO) throw new Error("데모 모드에서는 업로드를 사용할 수 없습니다.");

  const body = new FormData();
  body.append("file", file);
  body.append("roomType", roomType);
  body.append("sessionId", sessionId);

  const res = await fetch(apiUrl("/api/upload"), { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || "업로드에 실패했습니다.");
  return { ...data, panoramaUrl: apiUrl(data.panorama) };
}
