import styles from "./ProfileChip.module.css";

export default function ProfileChip({
  name = "우리집 햄찌",
  mode = "초보 소방관 모드",
  avatar = "/images/시나리오/객체/프로필사진.png",
  compact = false,
  collapsible = false, // 스마트폰에서는 사진만 남김
}) {
  return (
    <div className={[styles.chip, compact && styles.compact, collapsible && styles.collapsible].filter(Boolean).join(" ")}
      title={`${name} · ${mode}`}>
      <img className={styles.avatar} src={avatar} alt="" />
      <div className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.mode}>{mode}</span>
      </div>
    </div>
  );
}
