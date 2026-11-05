import styles from "./ScenarioPanels.module.css";

/**
 * 선택지 카드 3개
 * selected: 고른 항목 번호 / result: 결과 화면이면 고른 항목 번호(나머지는 흐리게, 선택 불가)
 */
export default function ChoicePanel({ choice, selected, onSelect }) {
  const isResult = choice.result !== undefined;
  const active = isResult ? choice.result : selected;

  return (
    <div className={styles.choice}>
      {choice.prompt && <p className={styles.prompt}>{choice.prompt}</p>}
      <div className={styles.options} role={isResult ? undefined : "radiogroup"}>
        {choice.options.map((opt, i) => {
          const state = active === i ? styles.selected : isResult ? styles.dimmed : "";
          return (
            <button
              key={opt.label}
              type="button"
              role={isResult ? undefined : "radio"}
              aria-checked={isResult ? undefined : active === i}
              className={`${styles.option} ${state}`}
              onClick={isResult ? undefined : () => onSelect(i)}
              disabled={isResult}
            >
              <img className={styles.optionImage} src={opt.image} alt="" />
              <span className={styles.optionLabel}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
