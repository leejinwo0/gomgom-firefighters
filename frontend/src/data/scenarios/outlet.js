import { BACKGROUNDS, CHARACTERS, CHOICE_IMAGES, FIGURES } from "../assets";

/**
 * 콘센트 화재 대피 시나리오 (원본 Scenario01~24, CompleteScenario 31개 페이지 → 데이터 1개)
 *
 * 단계(step) 필드
 *   stage      몇 단계인지 (머리말 "N단계 + 질문")
 *   room       ROOMS 키 → 360° 뷰어 배경 / background → 이미지 배경
 *   taps       { 라벨클래스: 다음 단계 } — 360° 화면에서 해당 영역을 누르면 이동
 *   character  소방곰 이미지 키
 *   message    말풍선 내용
 *   figure     가운데에 크게 보여줄 이미지
 *   choice     선택지 { prompt, mode, options[] }
 *              mode "answer": 정답(correct)을 골라야 다음으로 / "branch": 고른 항목의 to로 이동
 *              result: 결과 화면에서 고른 항목만 강조 (선택 불가)
 *   report     신고 연습 카드 { readAloud: [...] }
 *   hint       회색 "힌트" 버튼 → 안내창
 *   back       회색 버튼으로 이전 단계 이동 { label, to }
 *   next       주황 버튼 { label, to } (to가 없으면 confirm 안내창만)
 */
const scenario = {
  id: "outlet",
  title: "거실 콘센트에서 불이 났어요!",
  level: "하",
  minutes: 3,
  badge: {
    earned: "/images/뱃지/콘센트뱃지획득.png",
    locked: "/images/뱃지/콘센트뱃지미획득.png",
  },
  // 신고 연습 카드에 보여줄 화재 정보
  report: { location: "거실", type: "콘센트" },
  start: "intro",
  stages: {
    1: "어디서 불이 났는지 알아볼까?",
    2: "불이 나면 어떻게 해야할까?",
    3: "어디로 대피해야할까?",
    4: "대피 후엔 어떻게 해야할까?",
    5: "화재 신고는 어떻게 해야할까?",
  },

  steps: {
    // ───────── 1단계: 햄찌 위치 → 불난 곳 찾기 ─────────
    intro: {
      stage: 1,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.laptop,
      message: "화재가 났을 땐 어디서 불이 나고 있는지 확인해야 해. 먼저 햄찌의 위치를 알려줄래?",
      next: { label: "준비 됐어! →", to: "find-living" },
      startTimer: true,
    },

    // 집 안을 돌아다니며 햄찌방 찾기 (문을 누르면 그 방으로 이동)
    "find-living": findHamzzy("livingRoom", { 1: "find-main", 2: "find-kitchen", 3: "find-hamzzy" }),
    "find-main": findHamzzy("mainRoom", { 1: "find-living" }),
    "find-kitchen": findHamzzy("kitchen", { 1: "find-living", 2: "find-entrance" }),
    "find-entrance": findHamzzy("entrance", { 2: "find-kitchen" }),
    "find-hamzzy": {
      ...findHamzzy("hamzzyRoom", { 1: "find-living" }),
      next: { label: "난 여기야! →", to: "smoke-intro" },
    },

    "smoke-intro": {
      stage: 1,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.laptop,
      message:
        "햄찌는 햄찌방에 있구나! 알려줘서 고마워. 지금 집에서 나는 연기가 어디서 나는 건지 함께 찾아볼까?",
      next: { label: "다음 →", to: "leave-room" },
    },
    "leave-room": {
      stage: 1,
      room: "hamzzyRoom",
      taps: { 1: "find-fire" },
      character: CHARACTERS.magnifier,
      message: "우선, 방 밖으로 나가야 해. 문을 눌러서 거실로 나가보자!",
    },
    "find-fire": {
      stage: 1,
      room: "livingRoomFire",
      taps: { 4: "fire-found" },
      character: CHARACTERS.magnifier,
      message: "지금 불이 난 곳은 거실 콘센트야. 불이 난 콘센트를 찾아서 눌러줘.",
      hint: "선풍기 근처를 확인해보자!",
    },

    // ───────── 2단계: 어떻게 해야 할까 ─────────
    "fire-found": {
      stage: 2,
      background: BACKGROUNDS.outlet,
      figure: FIGURES.fireSpotted,
      character: CHARACTERS.magnifier,
      message: "정말 잘 찾았는걸~! 역시 햄찌야!! 불이 얼마나 크게 났는지 확인해볼까?",
      next: { label: "다음 →", to: "fire-spreading" },
    },
    "fire-spreading": {
      stage: 2,
      background: BACKGROUNDS.outlet,
      figure: FIGURES.fireSpotted,
      character: CHARACTERS.magnifier,
      message: "이런! 불이 번지고 있어. 이럴 땐 어떻게 해야 할까?",
      next: { label: "다음 →", to: "what-to-do" },
    },
    "what-to-do": {
      stage: 2,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.magnifier,
      message: "이런, 불이 번지고 있어. 이럴 땐 어떻게 해야 할까?",
      choice: {
        prompt: "세 가지 중에 햄찌가 해야 할 행동을 골라볼까?",
        mode: "answer",
        options: [
          { label: "당장 대피하기", image: FIGURES.evacuateBear, correct: true },
          { label: "부모님께 전화하기", image: FIGURES.callBear },
          { label: "불 끄기", image: FIGURES.extinguishBear },
        ],
      },
      hint: "불을 끄려다 다칠 수 있으니까 먼저 피하는 게 중요해!",
      next: { label: "다음 →", to: "evacuate-now" },
    },
    "evacuate-now": {
      stage: 2,
      background: BACKGROUNDS.outlet,
      figure: FIGURES.evacuateBear,
      character: CHARACTERS.thumbsUp,
      message: "너무 잘했어! 이렇게 불이 번지고 있을 땐 당장 대피해야 해.",
      next: { label: "다음 →", to: "where-to" },
    },

    // ───────── 3단계: 어디로 대피할까 ─────────
    "where-to": {
      stage: 3,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "그럼 어디로 대피해야 할까?",
      choice: {
        prompt: "세 가지 중에 햄찌가 대피할 곳을 골라볼까?",
        mode: "answer",
        options: [
          { label: "햄찌방", image: CHOICE_IMAGES.hamzzyRoom },
          { label: "화장실", image: CHOICE_IMAGES.bathroom },
          { label: "현관문 밖", image: CHOICE_IMAGES.frontDoor, correct: true },
        ],
      },
      hint: "집 안에서 불이 났으니까 안전하게 집 밖으로 나가자!",
      next: { label: "다음 →", to: "go-entrance" },
    },

    // 현관까지 직접 이동하기
    "go-entrance": goEntrance("livingRoom", { 1: "go-entrance-main", 2: "go-entrance-kitchen", 3: "go-entrance-hamzzy" }),
    "go-entrance-main": goEntrance("mainRoom", { 1: "go-entrance" }),
    "go-entrance-kitchen": goEntrance("kitchen", { 1: "go-entrance", 2: "at-entrance" }),
    "go-entrance-hamzzy": goEntrance("hamzzyRoom", { 1: "go-entrance" }),
    "at-entrance": {
      ...goEntrance("entranceOpen", { 1: "how-down" }),
      message: "현관에 도착했어! 현관문을 눌러서 밖으로 나가자.",
    },

    "how-down": {
      stage: 3,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "1층으로 어떻게 대피해야 할까?",
      choice: {
        prompt: "세 가지 중에 햄찌가 해야 할 행동을 골라볼까?",
        mode: "answer",
        options: [
          { label: "엘리베이터", image: CHOICE_IMAGES.elevator },
          { label: "계단", image: CHOICE_IMAGES.stairs, correct: true },
          { label: "창문", image: CHOICE_IMAGES.window },
        ],
      },
      hint: "불이 나면 전기가 끊겨 엘리베이터가 멈출 수 있고, 창문으로 뛰어내리면 높아서 다칠 수 있어!",
      next: { label: "다음 →", to: "use-stairs" },
    },
    "use-stairs": {
      stage: 3,
      background: BACKGROUNDS.stairs,
      character: CHARACTERS.thumbsUp,
      message: "천재 소방관 햄찌! 불이 나면 꼭 계단을 이용해야 해.",
      next: { label: "다음 →", to: "after-escape" },
    },

    // ───────── 4단계: 대피한 뒤 ─────────
    "after-escape": {
      stage: 4,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "계단을 이용해서 건물 밖으로 대피한 뒤엔 어떻게 해야 할까?",
      choice: {
        prompt: "세 가지 중에 햄찌가 해야 할 행동을 골라볼까?",
        mode: "branch",
        options: afterEscapeOptions().map((o, i) => ({ ...o, to: ["call-119", "shout-fire", "ask-help"][i] })),
      },
      hint: "밖으로 안전하게 대피했다면, 이제 주변에 알리고 119에 신고하거나 어른들에게 도움을 요청해야 해!",
      next: { label: "다음 →" },
    },
    "call-119": afterEscapeResult(0, "맞아! 대피한 뒤에 휴대폰이 있다면 119에 신고하면 돼!"),
    "shout-fire": afterEscapeResult(1, "잘했어! 먼저 밖에 나가면 '불이야' 하고 크게 외쳐서 사람들에게 알려야 해."),
    "ask-help": afterEscapeResult(2, "역시 우리집 소방관이야. 다른 어른들에게 우리집 상황을 알리면 도와주실 거야."),

    // ───────── 5단계: 119 신고 연습 ─────────
    "report-where": {
      stage: 5,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "신고할 때에는 불이 난 상황을 정확하게 알려야 해. 먼저, 어디서 불이 났는지 차근차근 말해보자!",
      report: { readAloud: [] },
      next: { label: "다음 →", to: "report-read" },
    },
    "report-read": {
      stage: 5,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "신고할 때에는 불이 난 상황을 정확하게 알려야 해. 먼저, 어디서 불이 났는지 차근차근 말해보자!",
      report: { readAloud: ["거실 콘센트에서 불이 났어요!"] },
      back: { label: "이전", to: "report-where" },
      next: { label: "다음 →", to: "report-address" },
    },
    "report-address": {
      stage: 5,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "잘했어! 소방관들이 도와주려면 우리집의 주소를 알려줘야 해. 같이 읽어볼까?",
      // 데모용 가상 주소
      report: { readAloud: ["거실 콘센트에서 불이 났어요!", "저희 집 주소는 곰곰시 안전구 소방동 곰곰아파트 1동 202호예요!"] },
      back: { label: "이전", to: "report-read" },
      next: { label: "다음 →", to: "complete" },
    },

    complete: {
      complete: true,
      background: BACKGROUNDS.outlet,
      character: CHARACTERS.thumbsUp,
      message: "잘했어, 햄찌야! 이제 콘센트에서 불이 나면 어떻게 해야 하는지 알겠지? 우리 다음에 또 보자~ 그럼 안녕!",
      next: { label: "종료 →", to: "/main" },
    },
  },
};

// ───────── 반복되는 단계 만들기 ─────────
function findHamzzy(room, taps) {
  return {
    stage: 1,
    room,
    taps,
    character: CHARACTERS.magnifier,
    message: "문을 눌러 다른 방으로 이동하면서 햄찌가 있는 곳을 찾아보자!",
    hint: "화면을 드래그해서 둘러보고, 문을 눌러 햄찌방으로 들어가자!",
    next: { label: "난 여기야! →", confirm: "여기는 햄찌방이 아니야. 다른 방도 찾아볼까?" },
  };
}

function goEntrance(room, taps) {
  return {
    stage: 3,
    room,
    taps,
    character: CHARACTERS.thumbsUp,
    message: "역시 햄찌야. 집에서 불이 나면 현관문 밖으로 대피해야 해. 현관으로 가보자!",
    hint: "부엌을 지나면 현관이 있어!",
  };
}

function afterEscapeOptions() {
  return [
    { label: "119 신고하기", image: CHOICE_IMAGES.call119 },
    { label: "불이야 크게 외치기", image: CHOICE_IMAGES.shout },
    { label: "도움 요청하기", image: CHOICE_IMAGES.askHelp },
  ];
}

function afterEscapeResult(index, message) {
  return {
    stage: 4,
    background: BACKGROUNDS.outlet,
    character: CHARACTERS.thumbsUp,
    message,
    choice: { mode: "branch", options: afterEscapeOptions(), result: index },
    back: { label: "다시 선택하기", to: "after-escape" },
    next: { label: "다음 →", to: "report-where" },
  };
}


export default scenario;
