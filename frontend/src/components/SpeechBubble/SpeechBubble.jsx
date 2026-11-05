import styles from "./SpeechBubble.module.css";

/**
 * 소방곰 말풍선. 원본의 꼬리 PNG 대신 CSS로 꼬리를 그립니다.
 * tail: bottom-left | bottom | none
 */
export default function SpeechBubble({ tail = "bottom-left", className = "", children }) {
  return (
    <div className={[styles.bubble, styles[`tail-${tail}`], className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
