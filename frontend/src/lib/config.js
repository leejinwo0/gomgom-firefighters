// 백엔드 주소는 이 파일에서만 읽습니다. (예전 코드의 localhost:5050 하드코딩 제거)
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// 백엔드가 연결되지 않으면 샘플 집 데이터로 체험하는 데모 모드
export const IS_DEMO = !API_URL;

export const apiUrl = (path) => `${API_URL}${path}`;
