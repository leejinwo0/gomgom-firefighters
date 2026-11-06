import { useState } from "react";
import { Button, Modal, ProfileChip, RoomViewer } from "../../components";
import { ROOMS } from "../../data/rooms";
import { StageLayout } from "../../layouts";

// 개발용: 360° 뷰어 + 탭 판정 확인 (/ui/viewer). 주황 점 = 탐지 영역 중심
export default function ViewerPreview() {
  const keys = Object.keys(ROOMS);
  const [key, setKey] = useState("livingRoom");
  const [tapped, setTapped] = useState(null);

  return (
    <StageLayout
      background={
        <RoomViewer room={ROOMS[key]} debug onTap={(box, at) => setTapped({ box, at })} />
      }
      title={`${ROOMS[key].name} 둘러보기`}
      step="테스트"
      stepText="주황 점이 있는 곳을 눌러보세요"
      profile={<ProfileChip collapsible />}
      character="/images/시나리오/소방곰/404돋보기소방곰.webp"
      message="어디서 불이 났는지 찾아봐!"
      actions={
        <Button size="lg" onClick={() => setKey(keys[(keys.indexOf(key) + 1) % keys.length])}>
          다른 방 →
        </Button>
      }
    >
      <Modal
        open={!!tapped}
        onClose={() => setTapped(null)}
        title={tapped?.box ? `class ${tapped.box.cls} 영역을 찾았어요` : "여기는 아무것도 없어요"}
        actions={<Button onClick={() => setTapped(null)}>확인</Button>}
      >
        {tapped && `yaw ${tapped.at.yaw.toFixed(1)}°, pitch ${tapped.at.pitch.toFixed(1)}°`}
      </Modal>
    </StageLayout>
  );
}
