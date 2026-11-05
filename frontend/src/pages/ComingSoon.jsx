import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { isCompleted } from "../lib/progress";

// 임시 첫 화면 — 메인 페이지를 옮기기 전까지 훈련 체험으로 바로 연결
export default function ComingSoon() {
  const navigate = useNavigate();
  const done = isCompleted("outlet");

  return (
    <main
      className="screen"
      style={{ display: "grid", placeItems: "center", padding: "var(--space-page)", textAlign: "center" }}
    >
      <div style={{ display: "grid", gap: 16, justifyItems: "center", maxWidth: 480 }}>
        <img src="/images/곰/인사소방곰.png" alt="인사하는 소방곰" style={{ width: "min(240px, 50vw)" }} />
        <h1 style={{ fontSize: "var(--fs-hero)", margin: 0 }}>곰곰소방단</h1>
        <p style={{ fontSize: "var(--fs-body)", margin: 0, color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
          우리 집 360° 화면 속에서 소방곰과 함께 화재 대피를 연습해요.
          <br />
          지금은 샘플 집으로 체험할 수 있어요.
        </p>
        <Button size="lg" onClick={() => navigate("/training/outlet")}>
          {done ? "콘센트 화재 훈련 다시 하기" : "콘센트 화재 훈련 시작하기"}
        </Button>
      </div>
    </main>
  );
}
