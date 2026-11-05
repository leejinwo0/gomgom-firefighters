import styles from "./CenterLayout.module.css";

/**
 * 첫 화면·로그인·가입·안내 화면 틀: 가운데 정렬된 카드
 * step: "1/2" 같은 진행 표시, footer: 아래 버튼 영역(폰에서는 화면 하단에 고정)
 */
export default function CenterLayout({ step, wide = false, children, footer }) {
  return (
    <div className={styles.page}>
      <main className={`${styles.card} ${wide ? styles.wide : ""}`}>
        {step && (
          <p className={styles.step}>
            <b>{step.current}</b>/{step.total}
          </p>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </main>
    </div>
  );
}
