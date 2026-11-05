import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FloorplanGrid, Modal, Tag } from "../../components";
import { defaultRoomName, roomColor, SAMPLE_ROOM_MAP, SAMPLE_ROOM_ORDER } from "../../data/house";
import { ROOMS } from "../../data/rooms";
import { HouseLayout } from "../../layouts";
import { uploadRoomVideo } from "../../lib/api";
import { IS_DEMO } from "../../lib/config";
import { getHouse, roomKeysOf, saveHouse, saveRoom } from "../../lib/house";
import { getOrCreateSessionId } from "../../lib/session";
import styles from "./House.module.css";

// 3/4 원본 HouseStep3·HouseStep5 (방 이름 + 영상 업로드 + VR 보기)
export default function HouseScan() {
  const navigate = useNavigate();
  const [house, setHouse] = useState(() => {
    const h = getHouse();
    return h.roomMap && Object.keys(h.roomMap).length ? h : saveHouse({ roomMap: SAMPLE_ROOM_MAP });
  });
  const [status, setStatus] = useState({}); // { room2: { progress, error } }
  const [notice, setNotice] = useState(null);
  const inputs = useRef({});
  const sessionId = getOrCreateSessionId();

  const keys = roomKeysOf(house.roomMap);
  const rooms = house.rooms ?? {};
  const nameOf = (k) => rooms[k]?.name || (k === "room1" ? "거실" : "");
  const names = Object.fromEntries(keys.map((k) => [k, nameOf(k) || defaultRoomName(k)]));
  const ready = (k) => Boolean(rooms[k]?.source);
  const readyCount = keys.filter(ready).length;

  const update = (k, patch) => setHouse(saveRoom(k, patch));

  const applySample = (k) => update(k, { source: "sample", sampleRoom: SAMPLE_ROOM_ORDER[keys.indexOf(k) % SAMPLE_ROOM_ORDER.length] });
  const applySampleAll = () => keys.filter((k) => !ready(k)).forEach(applySample);

  const upload = async (k, file) => {
    if (!file) return;
    setStatus((s) => ({ ...s, [k]: { progress: 0 } }));
    try {
      const res = await uploadRoomVideo({
        file,
        roomType: k,
        sessionId,
        onProgress: (p) => setStatus((s) => ({ ...s, [k]: { progress: p } })),
      });
      update(k, { source: "server", panorama: res.panorama, labels: res.labels ?? [], doors: res.doors ?? [] });
      setStatus((s) => ({ ...s, [k]: null }));
    } catch (err) {
      setStatus((s) => ({ ...s, [k]: { error: err.message } }));
    }
  };

  const next = () => {
    const missing = keys.filter((k) => !nameOf(k).trim());
    if (missing.length) return setNotice("방 이름을 모두 입력해주세요!");
    navigate("/house/hazards");
  };

  return (
    <HouseLayout
      step={3}
      title="방마다 이름을 정하고 360° 화면을 만들어주세요"
      desc={
        IS_DEMO
          ? "* 지금은 데모 모드라 영상 업로드 대신 샘플 집의 360° 화면을 사용해요."
          : "* 방 가운데에 서서 휴대폰을 들고 천천히 한 바퀴 돌며 촬영한 영상을 올려주세요."
      }
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={() => navigate("/house/floorplan")}>
            ← 이전
          </Button>
          <Button size="lg" disabled={readyCount === 0} onClick={next}>
            다음 →
          </Button>
        </>
      }
    >
      <FloorplanGrid value={house.roomMap} names={names} readOnly />

      <ul className={styles.roomList}>
        {keys.map((k) => {
          const st = status[k];
          const busy = st && st.error === undefined;
          return (
            <li key={k} className={styles.roomCard}>
              <span className={styles.swatch} style={{ background: roomColor(k) }} />
              {k === "room1" ? (
                <strong className={styles.roomName}>거실</strong>
              ) : (
                <input
                  className={styles.roomInput}
                  placeholder={`예) 안방, 부엌 (${defaultRoomName(k)})`}
                  aria-label={`${defaultRoomName(k)} 이름`}
                  value={nameOf(k)}
                  onChange={(e) => update(k, { name: e.target.value })}
                />
              )}

              <div className={styles.roomState}>
                {busy ? (
                  <Tag tone="primary">
                    {st.progress < 1 ? `업로드 ${Math.round(st.progress * 100)}%` : "360° 화면 만드는 중…"}
                  </Tag>
                ) : st?.error ? (
                  <Tag>{st.error}</Tag>
                ) : ready(k) ? (
                  <Tag tone="success">{rooms[k].source === "sample" ? `샘플: ${ROOMS[rooms[k].sampleRoom]?.name}` : "완료"}</Tag>
                ) : (
                  <Tag>대기</Tag>
                )}
              </div>

              <div className={styles.roomActions}>
                {ready(k) && (
                  <Button variant="ghost" onClick={() => navigate(`/house/preview/${k}`)}>
                    VR 보기
                  </Button>
                )}
                {IS_DEMO ? (
                  !ready(k) && <Button onClick={() => applySample(k)}>샘플 사용</Button>
                ) : (
                  <>
                    <Button disabled={busy} onClick={() => inputs.current[k]?.click()}>
                      {ready(k) ? "다시 올리기" : "영상 선택"}
                    </Button>
                    <input
                      ref={(el) => (inputs.current[k] = el)}
                      type="file"
                      accept="video/*,image/*"
                      hidden
                      onChange={(e) => upload(k, e.target.files[0])}
                    />
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {IS_DEMO && readyCount < keys.length && (
        <Button variant="ghost" onClick={applySampleAll}>
          남은 방 모두 샘플로 채우기
        </Button>
      )}

      <Modal
        open={!!notice}
        onClose={() => setNotice(null)}
        title={notice}
        actions={<Button onClick={() => setNotice(null)}>확인</Button>}
      />
    </HouseLayout>
  );
}
