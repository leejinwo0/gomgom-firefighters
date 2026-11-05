import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { CenterLayout } from "../layouts";
import styles from "./Pages.module.css";

// 임시: 집 등록 화면은 다음 단계(6단계)에서 옮깁니다
export default function HousePlaceholder() {
  const navigate = useNavigate();
  return (
    <CenterLayout
      footer={
        <Button size="lg" onClick={() => navigate("/generating")}>
          샘플 집으로 계속하기 →
        </Button>
      }
    >
      <div className={styles.generating}>
        <img src="/images/곰/촬영소방곰.png" alt="" />
        <h1 className={styles.formTitle}>우리 집 등록은 준비 중이에요</h1>
        <p className={styles.formDesc}>지금은 샘플 집으로 훈련을 체험할 수 있어요.</p>
      </div>
    </CenterLayout>
  );
}
