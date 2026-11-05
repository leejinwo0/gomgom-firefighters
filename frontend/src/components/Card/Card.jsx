import styles from "./Card.module.css";

export default function Card({ as: Tag = "div", padded = true, className = "", children, ...rest }) {
  return (
    <Tag className={[styles.card, padded && styles.padded, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
