import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScenarioRoute from "../features/scenario/ScenarioPage";
import Generating from "../pages/Generating";
import HousePlaceholder from "../pages/HousePlaceholder";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Main from "../pages/Main";
import Onboarding from "../pages/Onboarding";
import Signup from "../pages/Signup";
import SplitPreview from "../pages/dev/SplitPreview";
import StagePreview from "../pages/dev/StagePreview";
import UiPreview from "../pages/dev/UiPreview";
import ViewerPreview from "../pages/dev/ViewerPreview";
import RequireAuth from "./RequireAuth";

const auth = (el) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/main" element={auth(<Main />)} />
        <Route path="/onboarding" element={auth(<Onboarding />)} />
        <Route path="/house" element={auth(<HousePlaceholder />)} />
        <Route path="/generating" element={auth(<Generating />)} />
        <Route path="/training/:scenarioId/:stepId?" element={<ScenarioRoute />} />

        {import.meta.env.DEV && (
          <>
            <Route path="/ui" element={<UiPreview />} />
            <Route path="/ui/stage" element={<StagePreview />} />
            <Route path="/ui/split" element={<SplitPreview />} />
            <Route path="/ui/viewer" element={<ViewerPreview />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
