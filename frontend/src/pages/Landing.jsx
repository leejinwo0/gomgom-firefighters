import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { isLoggedIn, loginAsGuest } from "../lib/auth";
import styles from "./Pages.module.css";

const BEARS = ["메인왼쪽소방곰", "메인중간소방곰", "메인오른쪽소방곰"];

export default function Landing() {
  const navigate = useNavigate();
  if (isLoggedIn()) return <Navigate to="/main" replace />;

  const tryAsGuest = () => {
    loginAsGuest();
    navigate("/main");
  };

  return (
    <main className={styles.landing}>
      <div className={styles.bears}>
        {BEARS.map((name) => (
          <img key={name} src={`/images/곰/${name}.webp`} alt="" />
        ))}
      </div>
      <div className={styles.landingText}>
        <h1>안녕하세요, 곰곰소방단입니다</h1>
        <p>우리 집 360° 화면 속에서 소방곰과 함께 화재 대피를 연습해요.</p>
      </div>
      <div className={styles.landingActions}>
        <Button size="lg" block onClick={() => navigate("/login")}>
          로그인하기
        </Button>
        <Button size="lg" variant="ghost" block onClick={tryAsGuest}>
          로그인 없이 체험하기
        </Button>
        <p className={styles.linkRow}>
          처음이신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </main>
  );
}
