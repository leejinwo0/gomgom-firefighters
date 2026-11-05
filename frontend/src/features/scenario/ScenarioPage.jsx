import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, ProfileChip, RoomViewer } from "../../components";
import { ROOMS } from "../../data/rooms";
import { getScenario } from "../../data/scenarios";
import { StageLayout } from "../../layouts";
import { completeScenario, startScenario } from "../../lib/progress";
import ChoicePanel from "./ChoicePanel";
import CompletePanel from "./CompletePanel";
import ReportPanel from "./ReportPanel";
import styles from "./ScenarioPanels.module.css";

const MSG_PICK_ONE = "행동상자를 선택해줘!";
const MSG_WRONG = "다시 생각해보자!";

/** 라우트: /training/:scenarioId/:stepId — 단계가 바뀌면 key로 상태를 새로 시작 */
export default function ScenarioRoute() {
  const { scenarioId, stepId } = useParams();
  const scenario = getScenario(scenarioId);
  if (!scenario) return <Navigate to="/" replace />;
  if (!stepId || !scenario.steps[stepId]) {
    return <Navigate to={`/training/${scenarioId}/${scenario.start}`} replace />;
  }
  return <ScenarioStep key={stepId} scenario={scenario} stepId={stepId} />;
}

function ScenarioStep({ scenario, stepId }) {
  const step = scenario.steps[stepId];
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState(null);
  const [result, setResult] = useState(null);

  const go = (to) => navigate(to.startsWith("/") ? to : `/training/${scenario.id}/${to}`);

  useEffect(() => {
    if (step.startTimer) startScenario(scenario.id);
    if (step.complete) setResult(completeScenario(scenario.id));
  }, [scenario.id, step.startTimer, step.complete]);

  // 360° 화면에서 영역을 눌렀을 때
  const handleTap = (box) => {
    const to = box && step.taps?.[box.cls];
    if (to) go(to);
  };

  const handleSelect = (i) => {
    const { mode, options } = step.choice;
    if (mode === "answer" && !options[i].correct) {
      setNotice(MSG_WRONG);
      return;
    }
    setSelected(i);
  };

  const handleNext = () => {
    const { choice, next } = step;
    if (choice && choice.result === undefined) {
      if (selected === null) return setNotice(MSG_PICK_ONE);
      if (choice.mode === "branch") return go(choice.options[selected].to);
    }
    if (next.confirm) return setNotice(next.confirm);
    if (next.to) go(next.to);
  };

  const background = useMemo(
    () =>
      step.room ? (
        <RoomViewer room={ROOMS[step.room]} onTap={handleTap} />
      ) : (
        <img src={step.background} alt="" />
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stepId]
  );

  let center = null;
  if (step.complete) center = <CompletePanel scenario={scenario} result={result} />;
  else if (step.choice) center = <ChoicePanel choice={step.choice} selected={selected} onSelect={handleSelect} />;
  else if (step.report) center = <ReportPanel info={scenario.report} readAloud={step.report.readAloud} />;
  else if (step.figure) center = <img className={styles.figure} src={step.figure} alt="" />;

  return (
    <StageLayout
      background={background}
      title={scenario.title}
      step={step.complete ? "완료" : `${step.stage}단계`}
      stepText={step.complete ? "시나리오를 모두 마쳤어요!" : scenario.stages[step.stage]}
      profile={<ProfileChip collapsible />}
      character={step.character}
      message={step.message}
      center={center}
      actions={
        <>
          {step.hint && (
            <Button variant="secondary" size="lg" onClick={() => setNotice(step.hint)}>
              힌트
            </Button>
          )}
          {step.back && (
            <Button variant="secondary" size="lg" onClick={() => go(step.back.to)}>
              {step.back.label}
            </Button>
          )}
          {step.next && (
            <Button size="lg" onClick={handleNext}>
              {step.next.label}
            </Button>
          )}
        </>
      }
    >
      <Modal
        open={!!notice}
        onClose={() => setNotice(null)}
        title={notice}
        actions={<Button onClick={() => setNotice(null)}>확인</Button>}
      />
    </StageLayout>
  );
}
