import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComingSoon from "../pages/ComingSoon";

// 페이지는 단계별로 새 반응형 구조로 옮기면서 여기에 추가합니다.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}
