import { IS_DEMO } from "../lib/config";

export default function ComingSoon() {
  return (
    <main
      className="screen"
      style={{ display: "grid", placeItems: "center", padding: "var(--space-page)", textAlign: "center" }}
    >
      <div style={{ display: "grid", gap: 16, justifyItems: "center" }}>
        <img src="/images/곰/인사소방곰.png" alt="인사하는 소방곰" style={{ width: "min(240px, 50vw)" }} />
        <h1 style={{ fontSize: "var(--fs-hero)", margin: 0 }}>곰곰소방단</h1>
        <p style={{ fontSize: "var(--fs-body)", margin: 0, color: "var(--color-ink-soft)" }}>
          반응형 리뉴얼 작업 중이에요. {IS_DEMO ? "(데모 모드)" : "(API 연결됨)"}
        </p>
      </div>
    </main>
  );
}
