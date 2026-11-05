"""곰곰소방단 백엔드 API

영상 업로드 → 프레임 추출 → 스티칭 → 등장방형(360°) 변환 → YOLOv5 객체 탐지
파이프라인을 실행하고, 결과 파일을 /uploads 경로로 제공합니다.

프론트엔드는 별도(Vercel)로 배포하므로 이 서버는 API만 담당합니다.
"""
import os
import sys
import shutil
import subprocess
import traceback
import uuid
from datetime import datetime

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

# 실행 위치(cwd)와 상관없이 항상 같은 경로를 쓰도록 이 파일 기준으로 계산
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(BACKEND_DIR)
UPLOAD_DIR = os.path.join(BACKEND_DIR, "uploads")
MODEL_PATH = os.path.join(BACKEND_DIR, "best_250723.pt")
PIPELINE_PATH = os.path.join(BACKEND_DIR, "run_pipeline.py")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# 학습 모델(best_250723.pt)의 클래스 순서
CLASS_NAMES = ["door", "powersocket", "gasstove", "fireextinguisher", "microwave", "powerstrip", "electricfan"]


def read_labels_360(room_dir):
    """YOLO 결과(등장방형 이미지 기준 정규화 좌표)를 360° 뷰어용 각도로 변환
    x_c,y_c,w,h (0~1) → yaw,pitch,w,h (도). 프론트 RoomViewer의 라벨 형식과 동일"""
    path = os.path.join(room_dir, "yolo_output", "labels", "result_equi.txt")
    labels = []
    if not os.path.isfile(path):
        return labels
    with open(path, encoding="utf-8") as f:
        for line in f:
            parts = line.split()
            if len(parts) < 5:
                continue
            cls = int(float(parts[0]))
            x, y, w, h = map(float, parts[1:5])
            labels.append({
                "cls": cls,
                "name": CLASS_NAMES[cls] if cls < len(CLASS_NAMES) else str(cls),
                "yaw": round((x - 0.5) * 360, 3),
                "pitch": round((0.5 - y) * 180, 3),
                "w": round(w * 360, 3),
                "h": round(h * 180, 3),
            })
    return labels


def list_doors(room_dir, session_id, room_type):
    """문으로 탐지되어 잘라낸 이미지 목록(URL)"""
    door_dir = os.path.join(room_dir, "doors")
    if not os.path.isdir(door_dir):
        return []
    files = sorted(
        (f for f in os.listdir(door_dir) if f.endswith(".jpg")),
        key=lambda f: int("".join(c for c in f if c.isdigit()) or 0),
    )
    return [f"/uploads/{session_id}/{room_type}/doors/{f}" for f in files]

app = Flask(__name__)

# 허용할 프론트엔드 주소 (쉼표로 구분). 지정하지 않으면 전체 허용
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*")
CORS(app, origins=allowed_origins.split(",") if allowed_origins != "*" else "*")


@app.get("/api/health")
def health():
    return jsonify(status="ok")


@app.post("/api/upload")
def upload_and_process():
    try:
        file = request.files.get("file")
        room_type = secure_filename(request.form.get("roomType", "room")) or "room"
        session_id = secure_filename(request.form.get("sessionId", ""))

        if not file:
            return jsonify(success=False, error="파일이 없습니다."), 400

        if not session_id:
            session_id = f"session_{datetime.now():%Y%m%d}_{uuid.uuid4().hex[:6]}"

        # 같은 방을 다시 올리면 기존 결과를 지우고 새로 처리
        room_dir = os.path.join(UPLOAD_DIR, session_id, room_type)
        if os.path.exists(room_dir):
            shutil.rmtree(room_dir)
        os.makedirs(room_dir, exist_ok=True)

        filename = secure_filename(file.filename) or "video.mp4"
        video_path = os.path.join(room_dir, filename)
        file.save(video_path)

        env = os.environ.copy()
        env.update(
            PIPELINE_INPUT_VIDEO=video_path,
            PIPELINE_FRAME_DIR=os.path.join(room_dir, "frames"),
            PIPELINE_STITCH_RESULT=os.path.join(room_dir, "result_image.jpg"),
            PIPELINE_EQUI_RESULT=os.path.join(room_dir, "result_equi.jpg"),
            PIPELINE_SESSION_DIR=room_dir,
            YOLO_MODEL_PATH=MODEL_PATH,
            YOLO_OUTPUT_DIR=os.path.join(room_dir, "yolo_output"),
            FRAME_INTERVAL=os.environ.get("FRAME_INTERVAL", "30"),
        )

        # 파이프라인 스크립트들이 "backend/..." 상대경로를 쓰므로 cwd를 레포 루트로 고정
        subprocess.run(
            [sys.executable, PIPELINE_PATH],
            env=env,
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )

        return jsonify(
            success=True,
            session_id=session_id,
            room=room_type,
            filename=filename,
            panorama=f"/uploads/{session_id}/{room_type}/result_equi.jpg",
            labels=read_labels_360(room_dir),
            doors=list_doors(room_dir, session_id, room_type),
        )

    except subprocess.CalledProcessError as e:
        print("[파이프라인 실패]\n", e.stdout, "\n", e.stderr)
        return jsonify(success=False, error="파이프라인 실패"), 500
    except Exception as e:  # noqa: BLE001
        traceback.print_exc()
        return jsonify(success=False, error="서버 오류", message=str(e)), 500


@app.get("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    debug = os.environ.get("FLASK_DEBUG") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
