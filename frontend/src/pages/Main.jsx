import { useNavigate } from "react-router-dom";
import { Button, Card, ProfileChip, Tag } from "../components";
import { TRAININGS } from "../data/trainings";
import { SplitLayout } from "../layouts";
import { logout } from "../lib/auth";
import { isCompleted } from "../lib/progress";
import styles from "./Pages.module.css";

// 원본 SecondMain: 왼쪽 오늘의 미션 + 오른쪽 훈련 목록
export default function Main() {
  const navigate = useNavigate();
  const outletDone = isCompleted("outlet");

  const missions = [
    { no: "01", title: "거실 콘센트 화재 대피 훈련하기", done: outletDone, active: !outletDone },
    { no: "02", title: "명예 소방관 뱃지 자랑하기", done: false, active: outletDone },
    { no: "03", title: "소방 퀴즈왕 도전하기", done: false },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <SplitLayout
      aside={
        <>
          <span className={styles.eyebrow}>화재 대피 훈련</span>
          <h1 className={styles.asideTitle}>불이 나면 어떻게 해야 할까? 지금부터 소방곰과 함께 훈련하며 알아보자!</h1>
          <img className={styles.asideBear} src="/images/곰/인사소방곰.png" alt="" />
          <section className={styles.missions}>
            <h2>오늘의 미션</h2>
            {missions.map((m) => (
              <Card key={m.no} className={styles.mission}>
                <Tag tone="primary">{m.no}</Tag>
                <span>{m.title}</span>
                <Tag tone={m.done ? "success" : m.active ? "primary" : "neutral"}>
                  {m.done ? "완료" : m.active ? "진행중" : "미완료"}
                </Tag>
              </Card>
            ))}
          </section>
        </>
      }
    >
      <header className={styles.mainHeader}>
        <h2>화재 대피 훈련 시나리오</h2>
        <div className={styles.mainHeaderRight}>
          <ProfileChip />
          <Button variant="ghost" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </header>

      <div className={styles.trainingGrid}>
        {TRAININGS.map((t) => {
          const done = t.scenarioId && isCompleted(t.scenarioId);
          const ready = Boolean(t.scenarioId);
          return (
            <Card key={t.id} className={`${styles.training} ${ready ? "" : styles.trainingLocked}`}>
              <img className={styles.trainingBadge} src={done ? t.badge.earned : t.badge.locked} alt="" />
              <strong className={styles.trainingTitle}>{t.title}</strong>
              <div className={styles.tags}>
                <Tag>난이도 {t.level}</Tag>
                <Tag>예상 시간 {t.minutes}분</Tag>
                {done && <Tag tone="success">뱃지 획득</Tag>}
              </div>
              <Button block variant={ready ? "primary" : "secondary"} disabled={!ready} onClick={() => navigate(`/training/${t.scenarioId}`)}>
                {!ready ? "준비 중" : done ? "다시 훈련하기" : "훈련하기"}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className={styles.houseCta}>
        <img src="/images/곰/촬영소방곰.png" alt="" />
        <div>
          <strong>우리 집으로 훈련하고 싶다면?</strong>
          <p>집 안을 영상으로 찍어 올리면 우리 집 360° 화면으로 훈련할 수 있어요.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/onboarding")}>
          우리 집 등록하기 →
        </Button>
      </Card>
    </SplitLayout>
  );
}
