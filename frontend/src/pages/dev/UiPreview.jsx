import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Modal, ProfileChip, SpeechBubble, Tag } from "../../components";

// 개발용: 공통 컴포넌트 모음 (npm run dev 에서만 /ui 로 열림)
export default function UiPreview() {
  const [open, setOpen] = useState(false);

  return (
    <main className="screen" style={{ padding: "var(--space-page)", display: "grid", gap: 32, alignContent: "start" }}>
      <header style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "baseline" }}>
        <h1 style={{ margin: 0, fontSize: "var(--fs-hero)" }}>UI 미리보기</h1>
        <Link to="/ui/stage">시나리오 레이아웃 →</Link>
        <Link to="/ui/split">메인 레이아웃 →</Link>
      </header>

      <Section title="Button">
        <Button>다음 →</Button>
        <Button variant="secondary">이전</Button>
        <Button variant="ghost">잘 모르겠어요</Button>
        <Button size="lg">훈련하기</Button>
        <Button disabled>비활성</Button>
      </Section>

      <Section title="Tag">
        <Tag tone="primary">진행중</Tag>
        <Tag>미완료</Tag>
        <Tag tone="success">완료</Tag>
        <Tag>난이도 하</Tag>
      </Section>

      <Section title="ProfileChip">
        <ProfileChip />
        <ProfileChip compact />
      </Section>

      <Section title="SpeechBubble" dark>
        <SpeechBubble>어디서 불이 났는지 찾아볼까?</SpeechBubble>
      </Section>

      <Section title="Card · Modal">
        <Card style={{ width: "min(320px, 100%)" }}>
          <Tag tone="primary">01</Tag>
          <p style={{ margin: "12px 0 16px", fontWeight: 700 }}>거실 콘센트 화재 대피 훈련하기</p>
          <Button block onClick={() => setOpen(true)}>
            모달 열기
          </Button>
        </Card>
      </Section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="다시 한번 찾아볼까?"
        actions={<Button onClick={() => setOpen(false)}>확인</Button>}
      >
        콘센트 주변을 잘 살펴봐!
      </Modal>
    </main>
  );
}

function Section({ title, dark, children }) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: "var(--fs-body)", color: "var(--color-ink-soft)" }}>{title}</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          padding: dark ? 24 : 0,
          borderRadius: 12,
          background: dark ? "var(--color-ink)" : "transparent",
        }}
      >
        {children}
      </div>
    </section>
  );
}
