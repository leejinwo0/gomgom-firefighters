import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { CenterLayout } from "../layouts";
import styles from "./Pages.module.css";

export const HOUSE_STEPS = ["집 주소 입력하기", "집 전개도 등록하기", "집 공간 스캔하기", "화재 요인 등록하기"];

// 원본 Loading1: 우리 집 등록 4단계 안내
export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <CenterLayout
      wide
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={() => navigate("/main")}>
            나중에 할게요
          </Button>
          <Button size="lg" onClick={() => navigate("/house")}>
            시작하기 →
          </Button>
        </>
      }
    >
      <div className={styles.onboarding}>
        <img className={styles.onboardingBear} src="/images/곰/기다려소방곰.png" alt="" />
        <div>
          <h1 className={styles.formTitle}>우리 집에 대해 먼저 알려주세요!</h1>
          <p className={styles.formDesc}>
            소방곰이 딱 맞는 화재 대피 시나리오를 만들 수 있도록 우리 집 정보를 입력해요. 앞으로 4단계를 진행할 예정이에요.
          </p>
        </div>
      </div>
      <ol className={styles.stepList}>
        {HOUSE_STEPS.map((label, i) => (
          <li key={label}>
            <span className={styles.stepNo}>{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
    </CenterLayout>
  );
}
