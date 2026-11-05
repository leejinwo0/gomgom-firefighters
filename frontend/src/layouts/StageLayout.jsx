import { useEffect, useRef } from "react";
import { SpeechBubble } from "../components";
import styles from "./StageLayout.module.css";

/**
 * 시나리오 화면 틀: 화면 전체에 배경(VR 뷰어 또는 이미지)이 깔리고 그 위에 안내 UI가 뜹니다.
 *
 * 데스크톱·태블릿: 왼쪽 위 제목 / 오른쪽 위 프로필 / 왼쪽 아래 소방곰+말풍선 / 오른쪽 아래 버튼
 * 스마트폰 세로:   위쪽 제목+작은 프로필 / 아래쪽 하단 시트(말풍선 내용+버튼), 소방곰은 시트 위에 작게
 *
 * center: 가운데 영역(선택지 카드, 신고 카드 등)
 * 배경은 UI 아래에서 드래그·터치를 그대로 받을 수 있게 둡니다.
 */
export default function StageLayout({
  background,
  title,
  step,
  stepText,
  profile,
  character,
  message,
  actions,
  center,
  children,
}) {
  const stageRef = useRef(null);
  const bottomRef = useRef(null);

  // 하단 시트 높이를 CSS 변수로 넘김 → 모바일에서 VR이 시트 뒤로 숨지 않게
  useEffect(() => {
    const stage = stageRef.current;
    const bottom = bottomRef.current;
    if (!stage || !bottom) return;
    const ro = new ResizeObserver(() => {
      stage.style.setProperty("--sheet-h", `${bottom.offsetHeight}px`);
    });
    ro.observe(bottom);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={stageRef} className={styles.stage}>
      <div className={styles.background}>{background}</div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.overlay}>
        <header className={styles.top}>
          <div className={styles.heading}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {(step || stepText) && (
              <p className={styles.step}>
                {step && <span className={styles.stepBadge}>{step}</span>}
                {stepText}
              </p>
            )}
          </div>
          {profile && <div className={styles.profile}>{profile}</div>}
        </header>

        {center && <div className={styles.center}>{center}</div>}

        <div ref={bottomRef} className={styles.bottom}>
          <div className={styles.guide}>
            {message && (
              <SpeechBubble className={styles.bubble} tail="bottom-left">
                {message}
              </SpeechBubble>
            )}
            {character && <img className={styles.character} src={character} alt="" />}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </div>

      {children}
    </div>
  );
}
