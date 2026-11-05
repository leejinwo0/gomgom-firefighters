/**
 * 데모(샘플 집)용 360° 방 데이터
 * - panorama: 등장방형 360° 이미지
 * - labels:   탐지 영역 라벨 파일 (클래스 yaw pitch w h)
 * - yaw:      처음 바라보는 방향
 *
 * 라벨의 클래스 번호는 방마다 시나리오에서 의미를 정합니다. (예: 거실 4번 = 불난 위치)
 * 업로드 모드에서는 서버 결과로 같은 형태의 객체를 만들어 RoomViewer에 넘기면 됩니다.
 */
export const ROOMS = {
  livingRoom: {
    name: "거실",
    panorama: "/result/living_room_1.jpg",
    labels: "/result/living_room_360.txt",
    yaw: 170,
  },
  livingRoomFire: {
    name: "거실 (화재)",
    panorama: "/result/living_room_fire.jpg",
    labels: "/result/living_room_360.txt",
    yaw: 170,
  },
  mainRoom: {
    name: "안방",
    panorama: "/result/main_room.jpg",
    labels: "/result/main_room_360.txt",
    yaw: 0,
  },
  kitchen: {
    name: "부엌",
    panorama: "/result/kitchen.jpg",
    labels: "/result/kitchen_360.txt",
    yaw: 0,
  },
  hamzzyRoom: {
    name: "햄찌 방",
    panorama: "/result/hamzzy_room.jpg",
    labels: "/result/hamzzy_room_360.txt",
    yaw: 0,
  },
  entrance: {
    name: "현관",
    panorama: "/result/entrance_1.jpg",
    labels: "/result/entrance_360.txt",
    yaw: 250,
  },
  entranceOpen: {
    name: "현관 (문 앞)",
    panorama: "/result/entrance2.jpg",
    labels: "/result/entrance_360.txt",
    yaw: 250,
  },
};
