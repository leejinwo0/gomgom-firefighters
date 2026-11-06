import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, RoomViewer } from "../../components";
import { HAZARDS } from "../../data/house";
import { ROOMS } from "../../data/rooms";
import { StageLayout } from "../../layouts";
import { getHouse } from "../../lib/house";

const LABEL_NAMES = { door: "문", ...Object.fromEntries(HAZARDS.map((h) => [h.key, h.label])) };

// 원본 HouseStep501: 방 하나의 360° 미리보기
export default function HousePreview() {
  const { roomKey } = useParams();
  const navigate = useNavigate();
  const [found, setFound] = useState(null);
  const room = getHouse().rooms?.[roomKey];
  if (!room?.source) return <Navigate to="/house/scan" replace />;

  const viewerRoom =
    room.source === "server" ? { panorama: room.panorama, labels: room.labels ?? [], yaw: 0 } : ROOMS[room.sampleRoom];
  const name = room.name || (roomKey === "room1" ? "거실" : roomKey);

  return (
    <StageLayout
      background={
        <RoomViewer
          room={viewerRoom}
          // 서버 결과는 클래스 이름이 있어서 누르면 무엇인지 알려줌
          onTap={(box) => box?.name && setFound(LABEL_NAMES[box.name] ?? box.name)}
        />
      }
      title="VR 미리보기 체험"
      step="미리보기"
      stepText={`${name} 360° 화면`}
      character="/images/시나리오/소방곰/404돋보기소방곰.webp"
      message={`${name} 화면을 드래그해서 둘러보세요!`}
      actions={
        <Button size="lg" onClick={() => navigate("/house/scan")}>
          ← 돌아가기
        </Button>
      }
    >
      <Modal
        open={!!found}
        onClose={() => setFound(null)}
        title={`인식된 물건: ${found}`}
        actions={<Button onClick={() => setFound(null)}>확인</Button>}
      />
    </StageLayout>
  );
}
