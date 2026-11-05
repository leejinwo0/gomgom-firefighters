import os
import sys
import subprocess

def run(script, args=None):
    script_path = os.path.abspath(os.path.join("backend/scripts", script))
    print(f"[PIPELINE] Running {script_path}...")
    command = [sys.executable, script_path]
    if args:
        command += args

    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[ERROR] {script} failed:")
        print(result.stdout)
        print(result.stderr)
        raise subprocess.CalledProcessError(result.returncode, script_path)

# ▶ Step 1: extract_frames with args
video_path = os.environ["PIPELINE_INPUT_VIDEO"]
frame_dir = os.environ["PIPELINE_FRAME_DIR"]
interval = os.environ.get("FRAME_INTERVAL", "15")
run("extract_frames.py", [video_path, frame_dir, interval])

# 👉 Check frames folder
if not os.path.isdir(frame_dir) or len(os.listdir(frame_dir)) == 0:
    raise RuntimeError(f"[ERROR] No frames found in {frame_dir}")

# ▶ Step 2: stitch (no args, env 사용)
run("stitcher.py")

# 👉 Check if result_image.jpg created
stitched = os.environ["PIPELINE_STITCH_RESULT"]
if not os.path.isfile(stitched):
    raise RuntimeError(f"[ERROR] Stitched result not found: {stitched}")

# ▶ Step 3: to_equirect
run("to_equirect.py")

# ▶ Step 4: yolo
equi_img_path = os.environ.get("PIPELINE_EQUI_RESULT")
if not equi_img_path or not os.path.exists(equi_img_path):
    raise RuntimeError(f"[ERROR] Equirect image not found: {equi_img_path}")

result_dir = os.path.dirname(equi_img_path)  # ✅ equi_img_path 정의 후 사용
yolo_model = os.environ.get("YOLO_MODEL_PATH", os.path.abspath("backend/best_250723.pt"))
yolo_output_dir = os.path.join(result_dir, "yolo_output")

print("[PIPELINE] Running YOLO detection...")

subprocess.run([
    sys.executable, "backend/scripts/yolo.py",
    equi_img_path, yolo_model, yolo_output_dir
], check=True)

# ▶ Step 5: extract class 0 objects


# 세션 디렉토리 추정: equi 이미지 경로 기준 (room1 까지 올라감)
session_dir = os.environ.get("PIPELINE_SESSION_DIR")
if not session_dir:
    # equi_img_path = .../session_xxx/room1/result_equi.jpg
    session_dir = os.path.dirname(equi_img_path)
# 실행: extract_class0_objects.py
run("extract_class0_objects.py", [session_dir])