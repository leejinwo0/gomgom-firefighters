// 메인 화면 훈련 목록. scenarioId가 있는 것만 실제로 진행 가능 (나머지는 준비 중)
export const TRAININGS = [
  {
    id: "outlet",
    scenarioId: "outlet",
    title: "콘센트에서 불이 났어요!",
    level: "하",
    minutes: 3,
    badge: { earned: "/images/뱃지/콘센트뱃지획득.png", locked: "/images/뱃지/콘센트뱃지미획득.png" },
  },
  {
    id: "fan",
    title: "선풍기에서 불이 났어요!",
    level: "하",
    minutes: 4,
    badge: { earned: "/images/뱃지/선풍기뱃지획득.png", locked: "/images/뱃지/선풍기뱃지미획득.png" },
  },
  {
    id: "broadcast",
    title: "화재 안내 방송이 나오고 있어요!",
    level: "중",
    minutes: 2,
    badge: { earned: "/images/뱃지/화재안내방송뱃지획득.png", locked: "/images/뱃지/화재안내방송뱃지미획득.png" },
  },
  {
    id: "gasstove",
    title: "가스레인지에서 화재가 발생했어요!",
    level: "상",
    minutes: 5,
    badge: { earned: "/images/뱃지/가스레인지뱃지획득.png", locked: "/images/뱃지/가스레인지뱃지미획득.png" },
  },
];
