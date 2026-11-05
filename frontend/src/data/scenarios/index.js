import outlet from "./outlet";

// 시나리오를 추가할 때 여기에 등록 (선풍기·가스레인지·화재 안내 방송 등)
export const SCENARIOS = { [outlet.id]: outlet };

export const getScenario = (id) => SCENARIOS[id] ?? null;
