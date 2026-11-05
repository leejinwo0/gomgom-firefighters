import { FIGURES } from "../../data/assets";
import styles from "./ScenarioPanels.module.css";

// 119 신고 연습: 화재 위치·종류 카드 + "따라 읽어보세요" 문장들
export default function ReportPanel({ info, readAloud = [] }) {
  return (
    <div className={styles.report}>
      <div className={styles.reportCard}>
        <img className={styles.reportImage} src={FIGURES.fireSpotted} alt="" />
        <dl className={styles.reportInfo}>
          <div>
            <dt>화재 위치</dt>
            <dd>{info.location}</dd>
          </div>
          <div>
            <dt>화재 종류</dt>
            <dd>{info.type}</dd>
          </div>
        </dl>
      </div>
      {readAloud.map((line) => (
        <div key={line} className={styles.readAloud}>
          <span className={styles.readAloudLabel}>따라 읽어보세요</span>
          <strong>{line}</strong>
        </div>
      ))}
    </div>
  );
}
