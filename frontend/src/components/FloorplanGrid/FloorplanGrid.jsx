import { useRef, useState } from "react";
import { GRID, roomColor } from "../../data/house";
import { roomBounds } from "../../lib/house";
import styles from "./FloorplanGrid.module.css";

const cellKey = (x, y) => `${x},${y}`;

function rectCells(a, b) {
  const cells = [];
  for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++)
    for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++) cells.push(cellKey(x, y));
  return cells;
}

/**
 * 집 전개도 격자 (20×10)
 * 드래그한 사각형 범위를 선택한 방으로 칠함 / tool="eraser"면 지움
 * 원본은 칸마다 mouse 이벤트를 달아 터치가 안 됐는데, 격자 전체에서 포인터 좌표로 칸을 계산
 * readOnly: 결과 확인용 / names: 방 이름 표시
 */
export default function FloorplanGrid({ value = {}, onChange, tool, names = {}, readOnly = false }) {
  const ref = useRef(null);
  const [start, setStart] = useState(null);
  const [preview, setPreview] = useState([]);

  const cellAt = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * GRID.cols);
    const y = Math.floor(((e.clientY - r.top) / r.height) * GRID.rows);
    return { x: Math.max(0, Math.min(GRID.cols - 1, x)), y: Math.max(0, Math.min(GRID.rows - 1, y)) };
  };

  const down = (e) => {
    if (readOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const c = cellAt(e);
    setStart(c);
    setPreview([cellKey(c.x, c.y)]);
  };
  const move = (e) => {
    if (!start) return;
    setPreview(rectCells(start, cellAt(e)));
  };
  const up = (e) => {
    if (!start) return;
    const next = { ...value };
    for (const k of rectCells(start, cellAt(e))) {
      if (tool === "eraser") delete next[k];
      else next[k] = tool;
    }
    setStart(null);
    setPreview([]);
    onChange?.(next);
  };

  const previewSet = new Set(preview);
  const bounds = roomBounds(value);

  return (
    <div
      ref={ref}
      className={`${styles.grid} ${readOnly ? styles.readOnly : ""}`}
      style={{ "--cols": GRID.cols, "--rows": GRID.rows }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => {
        setStart(null);
        setPreview([]);
      }}
      role={readOnly ? "img" : "application"}
      aria-label="집 전개도"
    >
      {Array.from({ length: GRID.rows * GRID.cols }, (_, i) => {
        const k = cellKey(i % GRID.cols, Math.floor(i / GRID.cols));
        const isPreview = previewSet.has(k);
        const bg = isPreview ? (tool === "eraser" ? "#ffe3e3" : roomColor(tool)) : value[k] ? roomColor(value[k]) : undefined;
        return <div key={k} className={`${styles.cell} ${isPreview ? styles.preview : ""}`} style={{ background: bg }} />;
      })}

      {/* 방 이름은 칸마다가 아니라 방 가운데에 한 번만 */}
      {Object.entries(bounds).map(([key, b]) => (
        <span
          key={key}
          className={styles.label}
          style={{
            left: `${((b.cx + 0.5) / GRID.cols) * 100}%`,
            top: `${((b.cy + 0.5) / GRID.rows) * 100}%`,
          }}
        >
          {names[key]}
        </span>
      ))}
    </div>
  );
}
