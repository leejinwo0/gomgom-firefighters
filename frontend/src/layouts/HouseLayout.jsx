import { Link } from "react-router-dom";
import { Tag } from "../components";
import styles from "./HouseLayout.module.css";

export const HOUSE_STEPS = [
  { path: "/house/address", label: "집 주소 입력하기" },
  { path: "/house/floorplan", label: "집 전개도 등록하기" },
  { path: "/house/scan", label: "집 공간 스캔하기" },
  { path: "/house/hazards", label: "화재 요인 등록하기" },
];

/**
 * 우리 집 등록 화면 틀 (원본 HouseStep 1~5 공통 사이드바)
 * 데스크톱·태블릿: 왼쪽 안내(소방곰 + 4단계 진행 상태) / 오른쪽 입력
 * 스마트폰: 위쪽에 진행 막대만, 버튼은 아래 고정
 */
export default function HouseLayout({ step, title, desc, guide, bear = "/images/곰/촬영소방곰.webp", footer, children }) {
  return (
    <div className={styles.page}>
      <aside className={styles.aside}>
        <Link to="/main" className={styles.home}>
          ← 홈으로
        </Link>
        <p className={styles.guide}>{guide ?? "화재 대피 훈련을 진행할 장소에 대해 곰곰소방단에게 알려주세요!"}</p>
        <img className={styles.bear} src={bear} alt="" />
        <ol className={styles.steps}>
          {HOUSE_STEPS.map((s, i) => {
            const state = i + 1 < step ? "done" : i + 1 === step ? "active" : "todo";
            return (
              <li key={s.path} className={styles[state]}>
                <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.label}>{s.label}</span>
                <Tag tone={state === "done" ? "success" : state === "active" ? "primary" : "neutral"}>
                  {state === "done" ? "완료" : state === "active" ? "진행중" : "미완료"}
                </Tag>
              </li>
            );
          })}
        </ol>
      </aside>

      <main className={styles.main}>
        <div className={styles.mobileBar}>
          <Link to="/main" className={styles.home}>
            ← 홈
          </Link>
          <div className={styles.progress} aria-hidden="true">
            {HOUSE_STEPS.map((s, i) => (
              <span key={s.path} className={i < step ? styles.progressOn : ""} />
            ))}
          </div>
        </div>

        <header className={styles.header}>
          <p className={styles.count}>
            <b>{step}</b>/{HOUSE_STEPS.length}
            <span className={styles.countLabel}>{HOUSE_STEPS[step - 1]?.label}</span>
          </p>
          <h1 className={styles.title}>{title}</h1>
          {desc && <p className={styles.desc}>{desc}</p>}
        </header>

        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </main>
    </div>
  );
}
