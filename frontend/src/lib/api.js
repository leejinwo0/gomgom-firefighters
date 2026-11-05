import { apiUrl, IS_DEMO } from "./config";

/**
 * 방 영상 업로드 → 서버에서 프레임 추출·스티칭·360° 변환·YOLO 탐지
 * onProgress(0~1): 업로드 진행률 (fetch는 업로드 진행률을 못 받아서 XHR 사용)
 * 업로드가 끝나면 서버 처리 중에는 진행률 1로 유지됩니다.
 */
export function uploadRoomVideo({ file, roomType, sessionId, onProgress }) {
  if (IS_DEMO) return Promise.reject(new Error("데모 모드에서는 업로드를 사용할 수 없어요."));

  const body = new FormData();
  body.append("file", file);
  body.append("roomType", roomType);
  body.append("sessionId", sessionId);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl("/api/upload"));
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onerror = () => reject(new Error("서버에 연결하지 못했어요."));
    xhr.onload = () => {
      const data = xhr.response ?? {};
      if (xhr.status !== 200 || !data.success) return reject(new Error(data.error || "처리에 실패했어요."));
      resolve({
        ...data,
        panorama: apiUrl(data.panorama),
        doors: (data.doors ?? []).map(apiUrl),
      });
    };
    xhr.send(body);
  });
}
