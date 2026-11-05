import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { DOOR_DESTINATIONS, HAZARDS, SAMPLE_DOORS, SAMPLE_HAZARDS } from "../../data/house";
import { HouseLayout } from "../../layouts";
import { getHouse, roomKeysOf, saveHouse } from "../../lib/house";
import styles from "./House.module.css";

// 4/4 원본 HouseStep4 (거실 문 연결) + 화재 요인 확인
export default function HouseHazards() {
  const navigate = useNavigate();
  const house = getHouse();
  const rooms = house.rooms ?? {};
  const living = rooms.room1;

  // 서버로 처리한 거실이면 실제 탐지된 문, 아니면 샘플 문
  const doors = living?.source === "server" ? living.doors ?? [] : SAMPLE_DOORS;

  // 서버 결과에서 탐지된 화재 요인들 (없으면 샘플 기본값)
  const detected = new Set(
    Object.values(rooms)
      .flatMap((r) => r.labels ?? [])
      .map((l) => l.name)
  );
  const initialHazards = house.hazards ?? (detected.size ? HAZARDS.filter((h) => detected.has(h.key)).map((h) => h.key) : SAMPLE_HAZARDS);

  const [links, setLinks] = useState(house.doorLinks ?? {});
  const [hazards, setHazards] = useState(new Set(initialHazards));

  const destinations = [
    ...roomKeysOf(house.roomMap)
      .filter((k) => k !== "room1")
      .map((k) => rooms[k]?.name)
      .filter(Boolean),
    ...DOOR_DESTINATIONS,
  ];

  const toggle = (key) =>
    setHazards((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const finish = () => {
    saveHouse({ doorLinks: links, hazards: [...hazards], completed: true });
    navigate("/generating");
  };

  return (
    <HouseLayout
      step={4}
      title="문 연결과 화재 요인을 확인해주세요"
      desc="* 화재 위험 요소나 소화기가 잘 보이도록 정리한 뒤 촬영하면 더 정확하게 인식돼요."
      guide={`거실에서 ${doors.length}개의 문이 인식되었어요! 각 문이 어느 방과 연결되어 있는지 선택해주세요.`}
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={() => navigate("/house/scan")}>
            ← 이전
          </Button>
          <Button size="lg" onClick={finish}>
            완료 →
          </Button>
        </>
      }
    >
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>거실 문이 어디로 연결되나요?</h2>
        {doors.length ? (
          <ul className={styles.doorGrid}>
            {doors.map((src, i) => (
              <li key={src} className={styles.door}>
                <img src={src} alt={`인식된 문 ${i + 1}`} />
                <select
                  className={styles.doorSelect}
                  aria-label={`문 ${i + 1} 연결된 방`}
                  value={links[i] ?? ""}
                  onChange={(e) => setLinks((l) => ({ ...l, [i]: e.target.value }))}
                >
                  <option value="">연결된 방 선택</option>
                  {destinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>거실 영상에서 문이 인식되지 않았어요. 문이 잘 보이도록 다시 촬영해보세요.</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>우리 집에 있는 화재 요인을 골라주세요</h2>
        <div className={styles.chips}>
          {HAZARDS.map((h) => (
            <button
              key={h.key}
              type="button"
              aria-pressed={hazards.has(h.key)}
              className={`${styles.chip} ${hazards.has(h.key) ? styles.chipOn : ""}`}
              onClick={() => toggle(h.key)}
            >
              {hazards.has(h.key) ? "✓ " : ""}
              {h.label}
            </button>
          ))}
        </div>
        {detected.size > 0 && <p className={styles.muted}>영상에서 인식된 항목을 미리 선택해뒀어요.</p>}
      </section>
    </HouseLayout>
  );
}
