#!/usr/bin/env python3
"""
banner_4500_generate.py
正式イベント情報に基づくバナー4500枚生成スクリプト
イベント: 100万大義軍「第一の呼吸」愛と勇義の出陣式 in 福岡
"""

import os
import json
import csv
import time
import threading
import logging
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

from google import genai
from google.genai import types

# ── 設定 ──────────────────────────────────────────────
API_KEY      = os.environ.get("GEMINI_API_KEY", "AIzaSyAXS5lYsFLny3JqA3-wfZOGlgO72vtkdHs")
PROMPT_MODEL = "gemini-2.0-flash"
IMAGE_MODEL  = "gemini-3.1-flash-image-preview"
OUTPUT_DIR   = Path("/Users/takuma/workspace/AI-Marketing/banner-gemini31")
PROGRESS_FILE = Path("/Users/takuma/banner_4500_progress.json")
LOG_FILE     = Path("/Users/takuma/workspace/AI-Marketing/banner_4500_log.csv")
MAX_WORKERS  = 4

ASPECT_RATIOS = ["9:16", "16:9"]

# ── 確定情報（正本: 公式LP + Peatix） ───────────────────────
EVENT_FACTS = {
    "name":         "100万大義軍「第一の呼吸」愛と勇義の出陣式 in 福岡",
    "short_name":   "第一の呼吸 福岡",
    "date":         "2026年4月29日（水・祝）",
    "date_short":   "4.29",
    "venue":        "福岡国際会議場 多目的ホール",
    "address":      "福岡市博多区石城町2-1",
    "reception":    "受付 8:30〜",
    "day_session":  "Day Session 9:00〜17:00",
    "night_session":"Night Session 18:30〜21:00",
    "lecturer":     "Noh Jesu（ノ・ジェス）",
    "price_general":"33,000円",
    "price_premium":"110,000円",
    "official_url": "https://www.event.noh-jesu.com/20260429",
    "peatix_url":   "https://peatix.com/event/4715669",
    "deadline":     "2026年4月22日 0:00",
}

# ── コピー原子（公式LP由来・断定使用可） ─────────────────────
COPY_ATOMS = [
    "人間は変われない時代から人間は変われる時代へ",
    "AIのペットになるか　尊厳ある主役に戻るか",
    "7万年の「脳の牢獄」に終止符を打つ",
    "人間、やっとはじまる。",
    "人生の主導権を取り戻す",
    "福岡で最初の一歩が始まる",
    "認識が変われば、世界の見え方が変わる",
    "JAPAN MISSION",
    "第一の呼吸",
    "Human Error を終わらせる",
]

# ── トーン定義 ────────────────────────────────────────
TONES = {
    "t1": "危機喚起型 — AI時代に埋もれる恐怖・緊迫感",
    "t2": "希望提示型 — 変われる時代・人間の可能性",
    "t3": "哲学/思索型 — 認識・脳・意識への問い",
    "t4": "行動喚起型 — 今すぐ申込・締切・残席",
    "t5": "儀式/歴史性型 — 出陣式・大義・使命感",
    "t6": "未来社会ビジョン型 — nTech・AI共存・人間価値",
}

# ── サイズ定義 ────────────────────────────────────────
SIZES = {
    "s1": {"w": 1080, "h": 1920, "label": "縦型_1080x1920", "note": "日付を大きく、コピーを1本に絞る"},
    "s2": {"w": 1200, "h": 628,  "label": "横型_1200x628",  "note": "日付・会場・CTAを3点配置"},
    "s3": {"w": 1080, "h": 1080, "label": "正方形_1080x1080","note": "テキストは短く"},
    "s4": {"w": 960,  "h": 540,  "label": "横型_960x540",   "note": "4.29 福岡を最優先表示"},
}

# ── ビジュアル方向性 ─────────────────────────────────────
COLOR_THEMES = {
    "gold_black":  "黒×金 — 儀式感・格式・出陣式",
    "red_black":   "黒×赤 — 緊迫感・出陣式感",
    "white_black": "白×黒 — 思想性・知性",
    "navy_light":  "深紺×光 — 未来/認識OS・宇宙的",
    "warm_grad":   "暖色グラデーション — 歓喜・希望・夜明け",
}

# ── ペルソナ定義（10軸） ──────────────────────────────────
BASE_PERSONAS = {
    "p01": {"name": "AI時代の価値不安ビジネス層",   "desc": "AIに仕事を奪われる不安を持つ会社員・経営者", "temp": "cold"},
    "p02": {"name": "自己変容・自己理解を求める層", "desc": "自分を変えたい・人生を根本から見直したい人",   "temp": "warm"},
    "p03": {"name": "教育関係者",                   "desc": "AI時代の教育・人間形成を模索する教員・親",    "temp": "warm"},
    "p04": {"name": "社会課題関心層",               "desc": "日本・人類の未来に危機感を持つ思慮深い人",    "temp": "cold"},
    "p05": {"name": "哲学・心理・意識に関心層",     "desc": "意識・認識・存在論に興味を持つ探究者",       "temp": "neutral"},
    "p06": {"name": "既存nTech接触者",              "desc": "nTechを知っているが深めていない人・再接触層", "temp": "hot"},
    "p07": {"name": "地方/福岡起点に反応する層",   "desc": "福岡在住・九州・地方からの参加を検討する人",  "temp": "neutral"},
    "p08": {"name": "コミュニティ参加に慎重な層",   "desc": "団体・組織への不安を持つが内容に興味ある人",  "temp": "cold"},
    "p09": {"name": "長期課題を解決したい層",       "desc": "何年も変わらない悩みを根本解決したい人",      "temp": "warm"},
    "p10": {"name": "未来社会ビジョンに惹かれる層", "desc": "AIと人間が共存する新時代のビジョンに共鳴する人","temp": "warm"},
}

# ── 新規90ペルソナ（p11〜p100） ───────────────────────────
EXTENDED_PERSONAS = {}
subsegments = [
    ("製造業経営者",   "工場・製造業でAIと人間の価値を問い直したい経営者"),
    ("医療従事者",     "医療現場でAIが広がる中、人間の本質的価値を探る医師・看護師"),
    ("スタートアップ", "AIスタートアップを立ち上げ、人間とAIの関係を考える起業家"),
    ("地方公務員",     "地域社会の変革を模索し、人間の尊厳を守りたい公務員"),
    ("フリーランサー", "AIに仕事を奪われる不安を抱えながら独自価値を模索するフリーランス"),
    ("副業志望会社員", "会社員として将来不安を感じ、人生の主導権を取り戻したい人"),
    ("高校・大学生",   "AI時代を生きていく若い世代。自分の価値と生き方を探している"),
    ("主婦・主夫",     "家族のために社会変化を理解し、子供の未来を真剣に考える親"),
    ("シニア層",       "人生の総括として、人間とは何かを深く問いたいシニア世代"),
]

pid = 11
for base_key, base_val in BASE_PERSONAS.items():
    for sub_name, sub_desc in subsegments:
        key = f"p{pid:02d}"
        EXTENDED_PERSONAS[key] = {
            "name": f"{base_val['name']}×{sub_name}",
            "desc": sub_desc,
            "parent": base_key,
            "temp": base_val["temp"],
        }
        pid += 1

ALL_PERSONAS = {**BASE_PERSONAS, **EXTENDED_PERSONAS}

# ── デザイナー定義（10人） ────────────────────────────────
DESIGNERS = {
    "d01": {"name": "Kenji Nakamura",  "style": "モダンミニマリスト。余白と大きなタイポグラフィで威厳を表現"},
    "d02": {"name": "Yuki Tanaka",     "style": "大胆なカラーブロックとコントラスト。出陣式の力強さを体現"},
    "d03": {"name": "Sora Hayashi",    "style": "サイバーパンク×和。金と黒のグラデーションで儀式感を演出"},
    "d04": {"name": "Mika Suzuki",     "style": "人間中心。温かみある写真コラージュで変容ストーリーを表現"},
    "d05": {"name": "Ryo Yamamoto",    "style": "和モダン。伝統的な力強さと現代的な洗練を融合させる"},
    "d06": {"name": "Ami Kobayashi",   "style": "エネルギッシュで感情的。赤・金の炎のような熱量を表現"},
    "d07": {"name": "Taro Watanabe",   "style": "格式高い知的デザイン。深紺と金で信頼と権威を演出"},
    "d08": {"name": "Nana Ito",        "style": "宇宙的・深遠。意識・認識の広がりを光と暗闇で表現"},
    "d09": {"name": "Ken Matsumoto",   "style": "感情ストーリーテリング。人物の表情と言葉で魂を揺さぶる"},
    "d10": {"name": "Haru Kimura",     "style": "思想ビジュアライゼーション。哲学的概念を図像化する"},
}

# ── タスク構築 ─────────────────────────────────────────
def build_tasks():
    tasks = []

    # フェーズ1: 新規90ペルソナ × 6トーン × 4サイズ × 2アスペクト比
    import itertools
    for pid, persona in EXTENDED_PERSONAS.items():
        for tid, tone in TONES.items():
            for sid, size_info in SIZES.items():
                for ar in ASPECT_RATIOS:
                    ar_tag = ar.replace(":", "x")
                    tasks.append({
                        "task_id":    f"{pid}_{tid}_{sid}_{ar_tag}",
                        "phase":      1,
                        "persona_id": pid,
                        "persona":    persona,
                        "tone_id":    tid,
                        "tone":       tone,
                        "size_id":    sid,
                        "size":       size_info,
                        "aspect_ratio": ar,
                        "designer":   None,
                    })

    # フェーズ2: 既存10ペルソナ × 10デザイナー × 2サイズ × 2アスペクト比
    for pid, persona in BASE_PERSONAS.items():
        for did, designer in DESIGNERS.items():
            for sid in ["s1", "s2"]:
                for ar in ASPECT_RATIOS:
                    ar_tag = ar.replace(":", "x")
                    tasks.append({
                        "task_id":    f"{pid}_{did}_{sid}_{ar_tag}",
                        "phase":      2,
                        "persona_id": pid,
                        "persona":    persona,
                        "tone_id":    "t5",
                        "tone":       TONES["t5"],
                        "size_id":    sid,
                        "size":       SIZES[sid],
                        "aspect_ratio": ar,
                        "designer":   designer,
                    })

    return tasks

# ── プロンプト生成 ─────────────────────────────────────
def generate_prompt(task, client):
    f = EVENT_FACTS
    persona = task["persona"]
    tone    = task["tone"]
    size    = task["size"]
    ar      = task["aspect_ratio"]

    designer_block = ""
    if task["designer"]:
        d = task["designer"]
        designer_block = f"\nデザイナー: {d['name']} / スタイル: {d['style']}"

    # コピー原子からランダムに2〜3個選ぶ
    import random
    selected_copies = random.sample(COPY_ATOMS, min(3, len(COPY_ATOMS)))
    copies_str = "\n".join([f"  - {c}" for c in selected_copies])

    prompt = f"""
あなたはプロのバナーデザイナーです。以下の確定情報を元に、バナー設計仕様をJSONで出力してください。

【確定イベント情報（必ず正確に使用すること）】
正式名称: {f['name']}
開催日: {f['date']}
会場: {f['venue']}
住所: {f['address']}
講師: {f['lecturer']}
公式URL: {f['official_url']}
申込: {f['peatix_url']}
販売期限: {f['deadline']}

【ターゲット】
ペルソナ: {persona['name']}
ペルソナ詳細: {persona['desc']}

【デザインディレクション】
トーン: {tone}
サイズ: {size['label']}（{size['w']}x{size['h']}px）
アスペクト比: {ar}
サイズ注意: {size['note']}{designer_block}

【使用推奨コピー原子（公式LP由来）】
{copies_str}

【NG事項】
- 未確認の登壇者名を入れない
- 条件付き価格（11,000円）は条件なしで表示しない
- 団体加入を強制するような表現禁止
- 正本未確認の情報を断定しない

以下JSONスキーマのみ出力（コードブロック、説明不要）:
{{
  "visual_scene": "メインビジュアルの描写（50字以内）",
  "lighting": "ライティング指示",
  "color_theme": "使用カラーテーマと配色（黒×金など）",
  "composition": "構図・レイアウト指示",
  "typography": {{
    "headline": "メインキャッチコピー（公式コピー原子を活用・日本語20字以内）",
    "subheadline": "サブコピー（日本語30字以内）",
    "date_display": "日付表示文言（例: 2026.4.29 福岡）",
    "cta_text": "CTAボタン文言",
    "font_style": "フォントの雰囲気"
  }},
  "mood": "全体の雰囲気・ムード",
  "negative_prompt": "生成AIへの除外指示"
}}
"""
    resp = client.models.generate_content(model=PROMPT_MODEL, contents=prompt)
    text = resp.text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return json.loads(text)

# ── 画像生成 ───────────────────────────────────────────
def generate_image(task, spec, client):
    ar = task["aspect_ratio"]
    if ar == "9:16":
        ar_instruction = "縦長9:16アスペクト比。縦長構成。スマートフォン画面・Instagram Story向け。"
    else:
        ar_instruction = "横長16:9アスペクト比。ワイドスクリーン構成。SNS広告・YouTube向け。"

    full_prompt = f"""{ar_instruction}

日本語テキストを含む高品質な広告バナーをデザインしてください。

【ビジュアル】{spec['visual_scene']}
【ライティング】{spec['lighting']}
【カラーテーマ】{spec['color_theme']}
【構図】{spec['composition']}
【ムード】{spec['mood']}

【必ず画像内に含める日本語テキスト（鮮明・大きく・読みやすく）】
メインキャッチコピー（最も目立つ位置・大きく）: 「{spec['typography']['headline']}」
サブコピー: 「{spec['typography']['subheadline']}」
日付・場所（必須・視認性最優先）: 「{spec['typography']['date_display']}」
CTAボタン: 「{spec['typography']['cta_text']}」
講師名（小さく）: 「Noh Jesu」

【フォント】{spec['typography']['font_style']}
【除外】{spec['negative_prompt']}

プロフェッショナルなイベント広告バナー。日本語テキストは全て鮮明に読める品質で。
"""
    response = client.models.generate_content(
        model=IMAGE_MODEL,
        contents=full_prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"]
        ),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            return part.inline_data.data
    return None

# ── 進捗管理 ───────────────────────────────────────────
def load_progress():
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return set(json.load(f).get("completed", []))
    return set()

def save_progress(completed_ids, lock):
    with lock:
        with open(PROGRESS_FILE, "w") as f:
            json.dump({"completed": list(completed_ids), "updated": datetime.now().isoformat()}, f)

def append_log(row, lock):
    with lock:
        with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow(row)

# ── 1タスク処理 ────────────────────────────────────────
def process_one(task, client, completed_ids, lock, stats):
    task_id = task["task_id"]
    if task_id in completed_ids:
        return "skipped"

    out_dir = OUTPUT_DIR / f"phase{task['phase']}" / task["persona_id"]
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{task_id}.png"

    try:
        spec = generate_prompt(task, client)
        time.sleep(0.5)
        img_data = generate_image(task, spec, client)
        if img_data is None:
            raise ValueError("画像データなし")

        with open(out_path, "wb") as f:
            f.write(img_data)

        with lock:
            completed_ids.add(task_id)
            stats["success"] += 1

        save_progress(completed_ids, lock)
        append_log([
            task_id, task["phase"], task["persona_id"], task["persona"]["name"],
            task["tone"], task["size"]["label"], task["aspect_ratio"],
            spec["typography"]["headline"], spec["typography"]["date_display"],
            str(out_path), "success", ""
        ], lock)
        logging.info(f"✅ {task_id} → {out_path.name}")
        return "success"

    except Exception as e:
        with lock:
            stats["fail"] += 1
        append_log([
            task_id, task["phase"], task["persona_id"], task["persona"]["name"],
            task["tone"], task["size"]["label"], task["aspect_ratio"],
            "", "", "", "fail", str(e)
        ], lock)
        logging.warning(f"❌ {task_id}: {e}")
        return "fail"

# ── メイン ─────────────────────────────────────────────
def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler("/Users/takuma/banner_4500_run.log", encoding="utf-8"),
        ]
    )
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not LOG_FILE.exists():
        with open(LOG_FILE, "w", newline="", encoding="utf-8") as f:
            csv.writer(f).writerow([
                "task_id","phase","persona_id","persona_name","tone","size",
                "aspect_ratio","headline","date_display","output_path","status","error"
            ])

    client = genai.Client(api_key=API_KEY)
    tasks  = build_tasks()
    completed_ids = load_progress()
    lock   = threading.Lock()
    stats  = {"success": 0, "fail": 0}

    pending = [t for t in tasks if t["task_id"] not in completed_ids]
    logging.info(f"=== バナー生成 開始 ===")
    logging.info(f"総タスク: {len(tasks)} | 完了済み: {len(completed_ids)} | 残り: {len(pending)}")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_one, t, client, completed_ids, lock, stats): t for t in pending}
        for i, future in enumerate(as_completed(futures), 1):
            future.result()
            if i % 50 == 0:
                logging.info(f"--- 進捗: {len(completed_ids)}/{len(tasks)} | 成功:{stats['success']} 失敗:{stats['fail']} ---")

    logging.info(f"=== 完了 === 成功:{stats['success']} 失敗:{stats['fail']}")

if __name__ == "__main__":
    main()
