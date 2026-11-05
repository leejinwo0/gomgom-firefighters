import styles from "./Button.module.css";

/**
 * 공통 버튼
 * variant: primary(주황) | secondary(회색) | ghost(테두리) | inverse(어두운 배경 위 흰 버튼)
 * size: md | lg
 */
export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
  ...rest
}) {
  const cls = [styles.button, styles[variant], styles[size], block && styles.block, className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
