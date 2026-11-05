import styles from "./Tag.module.css";

/** 상태·난이도 표시용 작은 라벨. tone: neutral | primary | success */
export default function Tag({ tone = "neutral", children }) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}
