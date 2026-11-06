import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { CenterLayout } from "../layouts";
import styles from "./Pages.module.css";

// 원본 Loading2: 집 등록을 마친 뒤 시나리오 생성 대기 화면
export default function Generating() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <CenterLayout
      footer={
        <Button size="lg" disabled={!done} onClick={() => navigate("/main")}>
          {done ? "훈련하러 가기 →" : "만드는 중…"}
        </Button>
      }
    >
      <div className={styles.generating}>
        <img src="/images/곰/생성중인소방곰.webp" alt="" className={done ? "" : styles.bounce} />
        <h1 className={styles.formTitle}>{done ? "시나리오가 준비됐어요!" : "잠시만 기다려주세요!"}</h1>
        <p className={styles.formDesc}>
          소방곰이 우리 집에 딱 맞는 화재 대피 훈련 시나리오를 {done ? "만들었어요." : "만들고 있어요."}
        </p>
        <div className={styles.progress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={done ? 100 : undefined}>
          <span className={done ? styles.progressDone : styles.progressRun} />
        </div>
      </div>
    </CenterLayout>
  );
}
