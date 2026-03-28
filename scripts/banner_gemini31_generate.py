#!/usr/bin/env python3
"""
Gemini 3.1 Flash Image Preview バナー生成スクリプト
- model: gemini-3.1-flash-image-preview
- generateContent API (response_modalities=['IMAGE'])
- アスペクト比はプロンプトで指示
- サイズ: 9:16 / 16:9
"""
import os, csv, json, time, threading, concurrent.futures
from datetime import datetime
from google import genai
from google.genai import types

GEMINI_API_KEY = "AIzaSyAXS5lYsFLny3JqA3-wfZOGlgO72vtkdHs"
MODEL          = "gemini-3.1-flash-image-preview"
PROMPT_CSV     = "/Users/takuma/workspace/AI-Marketing/ntech-lp-production/output-banner-ultra/banner_imagen4_prompts_v2.csv"
OUTPUT_DIR     = "/Users/takuma/workspace/AI-Marketing/banner-gemini31"
LOG_CSV        = os.path.join(OUTPUT_DIR, "generation_log.csv")
PROGRESS_FILE  = os.path.join(OUTPUT_DIR, "progress.json")

MAX_WORKERS = 3
RETRY_MAX   = 3
RETRY_WAIT  = 12

ASPECT_RATIOS = [
    {
        "id": "9x16",
        "ratio": "9:16",
        "prompt_instruction": "Create this as a VERTICAL portrait-orientation banner. The image must be taller than wide, approximately 9:16 aspect ratio (like a smartphone screen or Instagram Story). Portrait format.",
    },
    {
        "id": "16x9",
        "ratio": "16:9",
        "prompt_instruction": "Create this as a HORIZONTAL landscape-orientation banner. The image must be wider than tall, approximately 16:9 aspect ratio (like a widescreen display or YouTube thumbnail). Landscape format.",
    },
]

lock = threading.Lock()
progress = {"done": 0, "failed": 0, "total": 0}

# ── ログ・進捗 ────────────────────────────────────────────────────────
def init_log():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if not os.path.exists(LOG_CSV):
        with open(LOG_CSV, "w", encoding="utf-8", newline="") as f:
            csv.writer(f).writerow([
                "task_id","persona_label","tone_label","aspect_ratio",
                "headline_text","sub_text","output_path","file_size_kb",
                "status","generated_at","error"
            ])

def append_log(uid, persona, tone, ratio, hl, sub, out_path, size_kb, status, error=""):
    with lock:
        with open(LOG_CSV, "a", encoding="utf-8", newline="") as f:
            csv.writer(f).writerow([
                uid, persona, tone, ratio, hl, sub, out_path,
                size_kb, status, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), error
            ])

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return set(json.load(f).get("done_ids", []))
    return set()

def save_progress(done_ids):
    with open(PROGRESS_FILE, "w") as f:
        json.dump({"done_ids": list(done_ids)}, f)

# ── Gemini 3.1 Flash Image 生成 ───────────────────────────────────────
def generate_image(base_prompt, aspect_config, out_path):
    client = genai.Client(api_key=GEMINI_API_KEY)

    # アスペクト比指示をプロンプトの先頭に注入
    full_prompt = f"""{aspect_config['prompt_instruction']}

{base_prompt}

IMPORTANT: Generate ONLY the image. No text explanation needed."""

    for attempt in range(RETRY_MAX):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"],
                )
            )
            # 画像パートを取得
            img_bytes = None
            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.mime_type.startswith("image/"):
                    img_bytes = part.inline_data.data
                    break

            if img_bytes is None:
                raise ValueError("画像パートが見つかりません")

            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, "wb") as f:
                f.write(img_bytes)
            return len(img_bytes)

        except Exception as e:
            err = str(e)
            if "RESOURCE_EXHAUSTED" in err or "429" in err or "quota" in err.lower():
                wait = RETRY_WAIT * (attempt + 1)
                print(f"  ⏳ レート制限 → {wait}秒待機 (attempt {attempt+1})")
                time.sleep(wait)
            elif "RECITATION" in err or "SAFETY" in err:
                # セーフティブロック → スキップ
                raise ValueError(f"SAFETY_BLOCK: {err[:80]}")
            elif attempt < RETRY_MAX - 1:
                time.sleep(6)
            else:
                raise

# ── 1行処理（1プロンプト × 2アスペクト比） ──────────────────────────
def process_one(row, done_ids):
    task_id = row["task_id"]
    persona = row["persona_label"]
    tone    = row["tone_label"]
    hl      = row.get("headline_text", "")
    sub     = row.get("sub_text", "")
    prompt  = row["imagen4_prompt"]
    results = []

    for ac in ASPECT_RATIOS:
        uid = f"{task_id}_{ac['id']}"
        if uid in done_ids:
            continue

        out_path = os.path.join(
            OUTPUT_DIR,
            row["persona_id"], row["tone_id"], ac["id"],
            f"banner_{task_id}.jpg"
        )
        try:
            size_bytes = generate_image(prompt, ac, out_path)
            size_kb    = round(size_bytes / 1024, 1)

            with lock:
                progress["done"] += 1
                print(f"✅ [{progress['done']}/{progress['total']}] {persona} × {tone} [{ac['ratio']}]  {size_kb}KB")

            append_log(uid, persona, tone, ac["ratio"], hl, sub, out_path, size_kb, "done")
            results.append(uid)

        except Exception as e:
            with lock:
                progress["failed"] += 1
            print(f"❌ {uid}: {e}")
            append_log(uid, persona, tone, ac["ratio"], hl, sub, "", 0, "failed", str(e))

    return results

# ── メイン ────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print(f"Gemini 3.1 Flash Image バナー生成")
    print(f"model: {MODEL}")
    print(f"サイズ: 9:16 / 16:9")
    print("=" * 60)

    rows = []
    with open(PROMPT_CSV, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["status"] == "done" and row["imagen4_prompt"].strip():
                rows.append(row)

    done_ids    = load_progress()
    unique_rows = [r for r in rows
                   if any(f"{r['task_id']}_{ac['id']}" not in done_ids
                          for ac in ASPECT_RATIOS)]

    progress["total"] = len(unique_rows) * len(ASPECT_RATIOS)
    print(f"📊 プロンプト: {len(rows)}件 × 2サイズ = {len(rows)*2}枚")
    print(f"📊 完了済み: {len(done_ids)}枚  残り: {progress['total']}枚\n")

    init_log()
    finished_ids = set(done_ids)

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(process_one, row, finished_ids): row
                   for row in unique_rows}
        for future in concurrent.futures.as_completed(futures):
            new_ids = future.result()
            with lock:
                finished_ids.update(new_ids)
            save_progress(finished_ids)

    print("\n" + "=" * 60)
    print(f"🎉 完了！  生成: {progress['done']}枚  失敗: {progress['failed']}枚")
    print(f"📁 出力: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
