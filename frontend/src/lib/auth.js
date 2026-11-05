/**
 * 데모용 로그인 상태 (서버 없이 브라우저에만 저장)
 * 비밀번호·휴대폰 번호는 저장하지 않습니다. 화면 표시에 필요한 정보만 남깁니다.
 */
const KEY = "gomgom.user";

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function save(user) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* 저장소를 쓸 수 없는 환경 */
  }
  return user;
}

export const login = (username) => save({ ...getUser(), username });

export const loginAsGuest = () => save({ username: "guest", guest: true });

export const signup = ({ username, childName, childAge, guardianName, relationship }) =>
  save({ username, childName, childAge, guardianName, relationship });

export function logout() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}

export const isLoggedIn = () => Boolean(getUser());

// 프로필에 보여줄 이름 — 가입 시 입력한 어린이 이름 > 아이디 > 기본값
export function getDisplayName() {
  const user = getUser();
  if (user?.childName) return user.childName;
  if (user?.username && !user.guest) return user.username;
  return "우리집 햄찌";
}

// 아이디·비밀번호 규칙 (가입 화면 안내와 동일)
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/;
