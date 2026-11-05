import { useId } from "react";
import styles from "./Field.module.css";

/** 라벨 + 입력칸 + 안내/오류 문구. as="select"면 드롭다운 */
export default function Field({ label, hint, error, as = "input", children, ...rest }) {
  const id = useId();
  const Control = as;
  const describedBy = error || hint ? `${id}-desc` : undefined;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <Control
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </Control>
      {(error || hint) && (
        <p id={describedBy} className={error ? styles.error : styles.hint}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
