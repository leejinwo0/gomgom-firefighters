# 곰곰소방단 🐻‍❄️🔥

> 우리 집을 영상으로 찍으면 360° VR 공간이 만들어지고, 그 안에서 아이와 함께 화재 대피 훈련을 하는 웹 서비스

**2025 세종 DX해커톤 대상** 수상작을 리팩터링·반응형으로 재구성하고 배포한 버전입니다.
해커톤 당시 원본 코드는 [vr-fire-evacuation-simulation-hackathon](https://github.com/leejinwo0/vr-fire-evacuation-simulation-hackathon)에 보존되어 있습니다.

- 데모: _배포 후 추가_

## 서비스 흐름

1. 집 안 각 방을 휴대폰으로 천천히 돌며 촬영
2. 서버에서 프레임 추출 → 이미지 스티칭 → 등장방형(360°) 변환
3. YOLOv5로 가스레인지·전자레인지·콘센트·전기코드 등 화재 위험 요소 탐지
4. "우리 집에서 불이 났다" 시나리오로 대피 훈련 진행, 단계별 뱃지 획득

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Frontend | React 19, React Router 7, Vite, Pannellum(360° 뷰어) |
| Backend | Flask, OpenCV, YOLOv5(PyTorch) |
| 배포 | Vercel(프론트), Hugging Face Spaces(백엔드, 예정) |

## 폴더 구조

```
frontend/   React 앱 (Vercel 배포)
  src/app         라우팅
  src/pages       페이지
  src/components  공통 컴포넌트
  src/data        시나리오 데이터
  src/lib         API·세션·설정
  public/         이미지, 샘플 집 360° 결과물
backend/    Flask API + 영상 처리 파이프라인
  app.py          업로드 API
  run_pipeline.py 프레임 추출 → 스티칭 → 변환 → 탐지
  scripts/        파이프라인 단계별 스크립트
  yolov5/         YOLOv5 (Ultralytics)
  best_250723.pt  학습된 탐지 모델
```

## 로컬 실행

**프론트엔드**

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL을 비워두면 데모 모드
npm run dev            # http://localhost:5173
```

**백엔드** (선택, 업로드 기능을 쓸 때)

```bash
pip install -r backend/requirements.txt
python backend/app.py  # http://localhost:5050
```

프론트 `.env`에 `VITE_API_URL=http://localhost:5050`을 넣으면 실제 업로드가 동작합니다.

## 리팩터링 내용

- 1194×834 고정 캔버스 레이아웃 → 데스크톱·태블릿·스마트폰 반응형
- 시나리오 페이지를 데이터 기반 컴포넌트로 통합 _(진행 중)_
- API 주소 하드코딩 제거, 세션 ID 관리 일원화
- 백엔드 실행 경로 버그 수정, 프론트·백엔드 분리 배포
- CRA → Vite 전환

## 팀

6인 팀(개발 4, 디자인 2) · 이진우 — 팀장, React 프론트엔드, 이미지 스티칭·YOLOv5 통합

## 라이선스

`backend/yolov5`는 [Ultralytics YOLOv5](https://github.com/ultralytics/yolov5)로 AGPL-3.0 라이선스를 따릅니다.
