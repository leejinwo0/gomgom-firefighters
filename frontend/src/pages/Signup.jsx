import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field } from "../components";
import { CenterLayout } from "../layouts";
import { PASSWORD_RULE, signup } from "../lib/auth";
import styles from "./Pages.module.css";

const RELATIONSHIPS = ["부모", "조부모", "보호자", "기타"];

// 원본 LoginStep1·LoginStep2 두 화면을 하나의 2단계 폼으로
export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    phone: "",
    username: "",
    password: "",
    confirm: "",
    childName: "",
    childAge: "",
    childFeatures: "",
    guardianName: "",
    relationship: "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const touch = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const errors = {
    phone: form.phone && !/^\d{10,11}$/.test(form.phone) ? "숫자만 10~11자리로 입력해주세요" : "",
    password: form.password && !PASSWORD_RULE.test(form.password) ? "영어와 숫자를 포함해 8~20자로 입력해주세요" : "",
    confirm: form.confirm && form.confirm !== form.password ? "비밀번호가 일치하지 않아요" : "",
  };
  const show = (key) => (touched[key] ? errors[key] : "");

  const step1Valid =
    form.phone && form.username.trim() && form.password && form.confirm && !errors.phone && !errors.password && !errors.confirm;
  const step2Valid =
    form.childName.trim() && form.childAge.trim() && form.childFeatures.trim() && form.guardianName.trim() && form.relationship;

  const next = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (step1Valid) setStep(2);
      else setTouched({ phone: true, password: true, confirm: true });
      return;
    }
    if (!step2Valid) return;
    signup({
      username: form.username.trim(),
      childName: form.childName.trim(),
      childAge: form.childAge.trim(),
      guardianName: form.guardianName.trim(),
      relationship: form.relationship,
    });
    navigate("/onboarding");
  };

  const back = () => (step === 1 ? navigate("/") : setStep(1));

  return (
    <CenterLayout
      step={{ current: step, total: 2 }}
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={back}>
            ← 이전
          </Button>
          <Button type="submit" form="signup-form" size="lg" disabled={step === 1 ? !step1Valid : !step2Valid}>
            다음 →
          </Button>
        </>
      }
    >
      <div>
        <h1 className={styles.formTitle}>
          {step === 1 ? "회원가입을 위해 기본 정보를 입력해주세요" : "서비스를 사용할 어린이와 보호자 정보를 입력해주세요"}
        </h1>
        <p className={styles.formDesc}>* 어린이의 경우, 부모님과 함께 회원가입을 진행해주세요</p>
      </div>

      <form id="signup-form" className={styles.form} onSubmit={next}>
        {step === 1 ? (
          <>
            <Field
              label="휴대폰 번호"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="-를 제외하고 숫자만 입력해주세요"
              value={form.phone}
              onChange={set("phone")}
              onBlur={touch("phone")}
              error={show("phone")}
            />
            <Field
              label="아이디"
              autoComplete="username"
              placeholder="아이디를 입력해주세요"
              value={form.username}
              onChange={set("username")}
            />
            <Field
              label="비밀번호"
              type="password"
              autoComplete="new-password"
              placeholder="영어, 숫자 포함 8-20자 이내"
              value={form.password}
              onChange={set("password")}
              onBlur={touch("password")}
              error={show("password")}
            />
            <Field
              label="비밀번호 확인"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={form.confirm}
              onChange={set("confirm")}
              onBlur={touch("confirm")}
              error={show("confirm")}
            />
          </>
        ) : (
          <>
            <div className={styles.row}>
              <Field label="어린이 이름" placeholder="예) 김소방" value={form.childName} onChange={set("childName")} />
              <Field label="어린이 나이" placeholder="예) 7세" value={form.childAge} onChange={set("childAge")} />
            </div>
            <Field
              label="특징"
              placeholder="어린이의 성격 / 취미 / 관심사 등에 대해서 알려주세요"
              value={form.childFeatures}
              onChange={set("childFeatures")}
            />
            <div className={styles.row}>
              <Field label="보호자 이름" placeholder="예) 홍길동" value={form.guardianName} onChange={set("guardianName")} />
              <Field as="select" label="어린이와의 관계" value={form.relationship} onChange={set("relationship")}>
                <option value="">관계를 선택해주세요</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Field>
            </div>
          </>
        )}
        <p className={styles.demoNote}>데모 버전이라 비밀번호와 휴대폰 번호는 저장하지 않아요.</p>
      </form>
    </CenterLayout>
  );
}
