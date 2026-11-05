import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field } from "../../components";
import { HOUSE_TYPES } from "../../data/house";
import { HouseLayout } from "../../layouts";
import { getHouse, saveHouse } from "../../lib/house";
import styles from "./House.module.css";

// 1/4 원본 HouseStep1
export default function HouseAddress() {
  const navigate = useNavigate();
  const saved = getHouse();
  const [address, setAddress] = useState(saved.address ?? "");
  const [floor, setFloor] = useState(saved.floor ?? "");
  const [type, setType] = useState(saved.type ?? "");
  const valid = address.trim() && String(floor).trim() && type;

  const next = (e) => {
    e.preventDefault();
    if (!valid) return;
    saveHouse({ address: address.trim(), floor: String(floor).trim(), type });
    navigate("/house/floorplan");
  };

  return (
    <HouseLayout
      step={1}
      bear="/images/곰/인사소방곰.png"
      title="집 정보를 입력해주세요"
      desc="입력한 주소는 119 신고 연습에서 '우리 집 주소 말하기'에 사용돼요."
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={() => navigate("/onboarding")}>
            ← 이전
          </Button>
          <Button type="submit" form="house-address" size="lg" disabled={!valid}>
            다음 →
          </Button>
        </>
      }
    >
      <form id="house-address" className={styles.form} onSubmit={next}>
        <Field
          label="집 주소"
          autoComplete="street-address"
          placeholder="예) 서울특별시 중구 퇴계로 173"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className={styles.row}>
          <Field
            label="층 수"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="숫자만 입력해주세요"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
          />
          <Field as="select" label="집의 형태" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" disabled>
              집 형태를 선택해주세요
            </option>
            {HOUSE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Field>
        </div>
      </form>
    </HouseLayout>
  );
}
