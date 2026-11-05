import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComingSoon from "../pages/ComingSoon";
import ScenarioRoute from "../features/scenario/ScenarioPage";
import UiPreview from "../pages/dev/UiPreview";
import StagePreview from "../pages/dev/StagePreview";
import SplitPreview from "../pages/dev/SplitPreview";
import ViewerPreview from "../pages/dev/ViewerPreview";

// 페이지는 단계별로 새 반응형 구조로 옮기면서 여기에 추가합니다.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/training/:scenarioId/:stepId?" element={<ScenarioRoute />} />

        {import.meta.env.DEV && (
          <>
            <Route path="/ui" element={<UiPreview />} />
            <Route path="/ui/stage" element={<StagePreview />} />
            <Route path="/ui/split" element={<SplitPreview />} />
            <Route path="/ui/viewer" element={<ViewerPreview />} />
          </>
        )}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}
