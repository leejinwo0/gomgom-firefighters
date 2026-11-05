import { useEffect, useRef, useState } from "react";
// CDN 대신 npm 패키지로 번들 (버전 고정, 외부 CDN 장애 영향 없음). 실행되면 window.pannellum이 생김
import "pannellum/build/pannellum.js";
import "pannellum/build/pannellum.css";
import { findBoxAt, parseLabels } from "../../lib/labels";
import styles from "./RoomViewer.module.css";

const TAP_MAX_MOVE = 10; // px — 이보다 많이 움직이면 드래그(둘러보기)로 간주
const TAP_MAX_TIME = 600; // ms
const TARGET_VFOV = 83; // 세로 시야각(도). 스티칭 이미지 위아래의 빈(검은) 영역이 안 보이도록

// 화면 비율에 맞춰 가로 시야각 계산 → 세로로 긴 폰 화면에서도 위아래 빈 영역이 안 보임
function fitHfov(el, maxHfov) {
  const aspect = el.clientWidth / Math.max(el.clientHeight, 1);
  const rad = (d) => (d * Math.PI) / 180;
  const hfov = (2 * Math.atan(Math.tan(rad(TARGET_VFOV / 2)) * aspect) * 180) / Math.PI;
  return Math.max(40, Math.min(maxHfov, hfov));
}

/**
 * 360° 방 뷰어 (기존 VR 모듈 12개를 하나로 통합)
 *
 * room: { panorama, labels, yaw }  — labels는 파일 URL 또는 이미 파싱된 배열
 * onTap(box | null, coords): 화면을 "탭"했을 때 호출. 영역 안이면 box, 밖이면 null
 *   예전 코드는 mousedown/mouseup만 들어서 폰 터치가 안 먹고, 드래그 끝에도 클릭으로 처리됐는데
 *   포인터 이벤트로 마우스·터치를 함께 받고, 움직임이 작을 때만 탭으로 판정합니다.
 * debug: 탐지 영역 위치에 표시 점을 찍어 확인 (개발용)
 */
export default function RoomViewer({ room, onTap, debug = false, hfov = 110, className = "" }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const onTapRef = useRef(onTap);
  const [boxes, setBoxes] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [showHint, setShowHint] = useState(true);

  onTapRef.current = onTap;

  // 라벨 불러오기
  useEffect(() => {
    let alive = true;
    if (Array.isArray(room.labels)) {
      setBoxes(room.labels);
      return;
    }
    if (!room.labels) {
      setBoxes([]);
      return;
    }
    fetch(room.labels)
      .then((res) => (res.ok ? res.text() : ""))
      .then((text) => alive && setBoxes(parseLabels(text)))
      .catch(() => alive && setBoxes([]));
    return () => {
      alive = false;
    };
  }, [room.labels]);

  // 뷰어 생성 — 방(이미지)이 바뀔 때만 다시 만듦
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!window.pannellum) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    const viewer = window.pannellum.viewer(el, {
      type: "equirectangular",
      panorama: room.panorama,
      autoLoad: true,
      yaw: room.yaw ?? 0,
      pitch: 0,
      hfov: fitHfov(el, hfov),
      minHfov: 35,
      maxHfov: 120,
      minPitch: -50,
      maxPitch: 50,
      showControls: false,
      compass: false,
      keyboardZoom: false,
      mouseZoom: true,
    });
    viewer.on("load", () => setStatus("ready"));
    viewer.on("error", () => setStatus("error"));
    viewerRef.current = viewer;
    if (import.meta.env.DEV) window.__roomViewer = viewer;

    // 창 크기뿐 아니라 영역 크기가 바뀔 때도(모바일 하단 시트 등) 다시 맞춤
    const ro = new ResizeObserver(() => {
      viewer.resize();
      viewer.setHfov(fitHfov(el, hfov), false);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [room.panorama, room.yaw, hfov]);

  // 탭 판정: 캡처 단계에서 포인터 이벤트를 먼저 받음 (Pannellum이 mouse 이벤트를 막아도 동작)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let start = null;

    const down = (e) => {
      if (!e.isPrimary) return;
      start = { x: e.clientX, y: e.clientY, t: performance.now() };
      setShowHint(false);
    };
    const up = (e) => {
      if (!e.isPrimary || !start) return;
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      const elapsed = performance.now() - start.t;
      start = null;
      if (moved > TAP_MAX_MOVE || elapsed > TAP_MAX_TIME) return;

      const viewer = viewerRef.current;
      if (!viewer) return;
      const [pitch, yaw] = viewer.mouseEventToCoords(e);
      onTapRef.current?.(findBoxAt(yaw, pitch, boxes), { yaw, pitch });
    };
    const cancel = () => {
      start = null;
    };

    el.addEventListener("pointerdown", down, true);
    el.addEventListener("pointerup", up, true);
    el.addEventListener("pointercancel", cancel, true);
    return () => {
      el.removeEventListener("pointerdown", down, true);
      el.removeEventListener("pointerup", up, true);
      el.removeEventListener("pointercancel", cancel, true);
    };
  }, [boxes]);

  // 개발용: 탐지 영역 중심에 점 표시
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !debug || status !== "ready") return;
    const ids = boxes.map((b, i) => {
      const id = `debug-${i}`;
      viewer.addHotSpot({ id, pitch: b.pitch, yaw: b.yaw, cssClass: styles.debugDot, text: `class ${b.cls}` });
      return id;
    });
    return () => ids.forEach((id) => viewer.removeHotSpot(id));
  }, [boxes, debug, status]);

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div ref={containerRef} className={styles.viewer} />

      {status === "loading" && <div className={styles.status}>방을 불러오는 중…</div>}
      {status === "error" && (
        <div className={styles.status}>360° 화면을 불러오지 못했어요. 새로고침해 주세요.</div>
      )}
      {status === "ready" && showHint && (
        <div className={styles.hint} aria-hidden="true">
          <span className={styles.hintIcon}>↔</span> 드래그해서 둘러보세요
        </div>
      )}
    </div>
  );
}
