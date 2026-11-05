import styles from "./SplitLayout.module.css";

/**
 * 메인·로그인·집 구성 화면 틀
 * 데스크톱·태블릿: 왼쪽 안내 패널 + 오른쪽 콘텐츠
 * 스마트폰 세로: 안내 패널이 위로, 콘텐츠가 아래로 쌓임
 */
export default function SplitLayout({ aside, children }) {
  return (
    <div className={styles.split}>
      <aside className={styles.aside}>{aside}</aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
