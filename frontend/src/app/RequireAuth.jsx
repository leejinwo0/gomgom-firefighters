import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";

// 로그인하지 않았으면 첫 화면으로
export default function RequireAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}
