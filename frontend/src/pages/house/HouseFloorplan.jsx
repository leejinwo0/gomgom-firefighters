import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FloorplanGrid } from "../../components";
import { ERASER, ROOM_TOOLS, SAMPLE_ROOM_MAP } from "../../data/house";
import { HouseLayout } from "../../layouts";
import { getHouse, roomKeysOf, saveHouse } from "../../lib/house";
import styles from "./House.module.css";

// 2/4 원본 HouseStep2
export default function HouseFloorplan() {
  const navigate = useNavigate();
  const [map, setMap] = useState(() => getHouse().roomMap ?? {});
  const [tool, setTool] = useState("room1");
  const hasLiving = Object.values(map).includes("room1");
  const names = Object.fromEntries(ROOM_TOOLS.map((t) => [t.key, t.label]));

  const next = () => {
    saveHouse({ roomMap: map });
    navigate("/house/scan");
  };

  return (
    <HouseLayout
      step={2}
      title="집의 전개도를 그려주세요"
      desc="* 방을 고른 뒤 격자 위를 드래그해서 사각형으로 칠해주세요. 거실은 꼭 있어야 해요."
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={() => navigate("/house/address")}>
            ← 이전
          </Button>
          <Button size="lg" disabled={!hasLiving} onClick={next}>
            다음 →
          </Button>
        </>
      }
    >
      <div className={styles.tools} role="radiogroup" aria-label="칠할 방">
        {[...ROOM_TOOLS, ERASER].map((t) => (
          <button
            key={t.key}
            type="button"
            role="radio"
            aria-checked={tool === t.key}
            className={`${styles.tool} ${tool === t.key ? styles.toolOn : ""}`}
            style={{ "--tool": t.color }}
            onClick={() => setTool(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <FloorplanGrid value={map} onChange={setMap} tool={tool} names={names} />

      <div className={styles.gridActions}>
        <span className={styles.muted}>방 {roomKeysOf(map).length}개</span>
        <Button variant="ghost" onClick={() => setMap(SAMPLE_ROOM_MAP)}>
          예시로 채우기
        </Button>
        <Button variant="ghost" onClick={() => setMap({})} disabled={!Object.keys(map).length}>
          모두 지우기
        </Button>
      </div>
    </HouseLayout>
  );
}
