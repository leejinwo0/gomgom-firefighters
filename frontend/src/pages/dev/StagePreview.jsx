import { useState } from "react";
import { Button, Modal, ProfileChip } from "../../components";
import { StageLayout } from "../../layouts";

// 개발용: 시나리오 화면 틀 확인 (/ui/stage)
export default function StagePreview() {
  const [open, setOpen] = useState(false);

  return (
    <StageLayout
      background={<img src="/images/시나리오/배경/콘센트시나리오기본배경.webp" alt="" />}
      title="거실 콘센트에서 불이 났어요!"
      step="1단계"
      stepText="어디서 불이 났는지 알아볼까?"
      profile={<ProfileChip collapsible />}
      character="/images/시나리오/소방곰/404돋보기소방곰.webp"
      message="연기가 나는 곳을 눌러서 찾아봐!"
      actions={
        <>
          <Button variant="secondary" size="lg" onClick={() => history.back()}>
            이전
          </Button>
          <Button size="lg" onClick={() => setOpen(true)}>
            다음 →
          </Button>
        </>
      }
    >
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="잘 찾았어!"
        actions={<Button onClick={() => setOpen(false)}>확인</Button>}
      >
        콘센트에서 불이 났구나.
      </Modal>
    </StageLayout>
  );
}
