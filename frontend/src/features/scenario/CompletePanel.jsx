import { formatDate, formatDuration } from "../../lib/progress";
import styles from "./ScenarioPanels.module.css";

export default function CompletePanel({ scenario, result }) {
  const duration = formatDuration(result?.durationMs);
  return (
    <div className={styles.complete}>
      <img className={styles.badge} src={scenario.badge.earned} alt="콘센트 화재 대피 뱃지" />
      <strong className={styles.completeTitle}>명예 소방관 뱃지 획득!</strong>
      <span className={styles.completeDate}>{formatDate(result?.completedAt ?? Date.now())} 완료</span>
      <p className={styles.completeMeta}>
        시나리오: {scenario.title}
        <br />
        난이도 {scenario.level}
        {duration && ` · 완료 시간 ${duration}`}
      </p>
    </div>
  );
}
