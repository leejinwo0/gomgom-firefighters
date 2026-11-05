import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field } from "../components";
import { CenterLayout } from "../layouts";
import { login } from "../lib/auth";
import styles from "./Pages.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const canSubmit = username.trim() && password.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    login(username.trim());
    navigate("/main");
  };

  return (
    <CenterLayout>
      <form className={styles.form} onSubmit={submit} id="login-form">
        <div>
          <h1 className={styles.formTitle}>로그인</h1>
          <p className={styles.formDesc}>아이디와 비밀번호를 입력해주세요</p>
        </div>
        <Field
          label="아이디"
          placeholder="아이디 입력"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Field
          label="비밀번호"
          type="password"
          placeholder="영어, 숫자 포함 8-20자 이내"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className={styles.demoNote}>데모 버전이라 서버 확인 없이 어떤 아이디로도 로그인돼요.</p>
        <Button type="submit" size="lg" block disabled={!canSubmit}>
          로그인
        </Button>
        <p className={styles.linkRow}>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </CenterLayout>
  );
}
