import { Button, Card, ProfileChip, Tag } from "../../components";
import { SplitLayout } from "../../layouts";

// 개발용: 메인 화면 틀 확인 (/ui/split)
const missions = [
  { no: "01", title: "거실 콘센트 화재 대피 훈련하기", state: "진행중" },
  { no: "02", title: "명예 소방관 뱃지 자랑하기", state: "미완료" },
  { no: "03", title: "소방 퀴즈왕 도전하기", state: "미완료" },
];

const trainings = [
  { badge: "콘센트뱃지미획득", title: "콘센트에서 불이 났어요!", level: "하", time: "3분" },
  { badge: "선풍기뱃지미획득", title: "선풍기에서 불이 났어요!", level: "하", time: "4분" },
  { badge: "화재안내방송뱃지미획득", title: "화재 안내 방송이 나오고 있어요!", level: "중", time: "2분" },
  { badge: "가스레인지뱃지미획득", title: "가스레인지에서 화재가 발생했어요!", level: "상", time: "5분" },
];

export default function SplitPreview() {
  return (
    <SplitLayout
      aside={
        <>
          <span style={{ fontWeight: 500 }}>화재 대피 훈련</span>
          <h1 style={{ margin: 0, fontSize: "var(--fs-title)", lineHeight: 1.35 }}>
            불이 나면 어떻게 해야 할까? 지금부터 소방곰과 함께 훈련하며 알아보자!
          </h1>
          <img src="/images/곰/인사소방곰.webp" alt="" style={{ width: "min(240px, 60%)", alignSelf: "center" }} />
          <div style={{ display: "grid", gap: 8 }}>
            <strong>오늘의 미션</strong>
            {missions.map((m) => (
              <Card key={m.no} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Tag tone="primary">{m.no}</Tag>
                <span style={{ flex: 1, fontWeight: 600 }}>{m.title}</span>
                <Tag tone={m.state === "진행중" ? "primary" : "neutral"}>{m.state}</Tag>
              </Card>
            ))}
          </div>
        </>
      }
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: "var(--fs-title)" }}>화재 대피 훈련 시나리오</h2>
        <ProfileChip />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {trainings.map((t) => (
          <Card key={t.badge} style={{ display: "grid", gap: 12 }}>
            <img src={`/images/뱃지/${t.badge}.webp`} alt="" style={{ width: 96, height: 96, objectFit: "contain" }} />
            <strong style={{ fontSize: "var(--fs-body)" }}>{t.title}</strong>
            <div style={{ display: "flex", gap: 6 }}>
              <Tag>난이도 {t.level}</Tag>
              <Tag>예상 시간 {t.time}</Tag>
            </div>
            <Button block>훈련하기</Button>
          </Card>
        ))}
      </div>
    </SplitLayout>
  );
}
