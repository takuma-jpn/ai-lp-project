#!/usr/bin/env python3
"""
Imagen 4 バナープロンプト v2
- 日本語ベースのプロンプト設計
- JSONスキーマでデザイナー目線の構造化仕様
- lp_templates_config.json のカラー・コピーを直接参照
- 出力: 240件 (10ペルソナ × 6トーン × 4サイズ → 実在テンプレ軸)
"""
import os, csv, json, time, threading, concurrent.futures
from datetime import datetime
from google import genai

GEMINI_API_KEY  = "AIzaSyAXS5lYsFLny3JqA3-wfZOGlgO72vtkdHs"
CONFIRMED_FACTS = "/Users/takuma/workspace/AI-Marketing/ntech-lp-production/data/confirmed_facts.json"
COPY_LIBRARY    = "/Users/takuma/workspace/AI-Marketing/ntech-lp-production/data/copy_library.json"
TEMPLATES_CFG   = "/Users/takuma/workspace/AI-Marketing/ntech-lp-production/data/lp_templates_config.json"
OUTPUT_CSV      = "/Users/takuma/workspace/AI-Marketing/ntech-lp-production/output-banner-ultra/banner_imagen4_prompts_v2.csv"

MAX_WORKERS = 5
lock = threading.Lock()
progress = {"done": 0, "total": 0}

# ── サイズ定義（Imagen 4サポート比率のみ）────────────────────────────
SIZES = [
    {
        "id": "9x16",
        "ratio": "9:16",
        "desc": "縦型ストーリーズ・リール広告",
        "canvas_w": 1080, "canvas_h": 1920,
        "layout_rule": "上1/3にビジュアル要素、中央にメインコピー大字、下1/4にCTAバッジと日付",
        "text_density": "1コピーに絞る。余白を広く取る。",
    },
    {
        "id": "16x9",
        "ratio": "16:9",
        "desc": "横型ディスプレイ・YouTube広告",
        "canvas_w": 1920, "canvas_h": 1080,
        "layout_rule": "左40%にタイポグラフィ、右60%にビジュアル。左端に縦ライン区切り。",
        "text_density": "ヘッドライン2行＋サブコピー1行＋イベント情報バッジ",
    },
    {
        "id": "1x1",
        "ratio": "1:1",
        "desc": "SNS投稿・フィード広告",
        "canvas_w": 1080, "canvas_h": 1080,
        "layout_rule": "中央揃え構成。ヘッドライン大字中心。四隅に余白。下部にCTAライン。",
        "text_density": "コピー2行まで。日付・会場をコンパクトに下部配置。",
    },
    {
        "id": "3x4",
        "ratio": "3:4",
        "desc": "Instagram縦型フィード広告",
        "canvas_w": 1080, "canvas_h": 1440,
        "layout_rule": "上半分ビジュアル、下半分テキストゾーン。区切りラインあり。",
        "text_density": "ヘッドライン1〜2行＋サブコピー短め＋CTAボタン風バッジ",
    },
]

# ── トーン定義（デザイナー視点）────────────────────────────────────
TONES = [
    {
        "id": "bt01", "label": "危機喚起型",
        "atmosphere": "漆黒の空間に深紅の光が差し込む緊張感。影と光の強いコントラスト。",
        "color_spec": {"bg": "#0a0a0a", "accent": "#CC2200", "text": "#FFFFFF", "sub": "#999999"},
        "visual_motif": "闇の中で一点の赤い光源。人物は逆光で輪郭だけが浮かぶシルエット表現。",
        "typography_mood": "太字ゴシック・圧縮体。文字間詰め。緊張感ある配置。",
        "persona_visual_map": {
            "AI時代価値不安ビジネス層": "暗闇の十字路に立つスーツ姿の男性シルエット、深紅の後光",
            "自己変容探求層": "鏡の前で自分と向き合う人物、鏡が割れかけている表現",
            "教育関係者": "本が燃える暗い書斎、窓から赤い光が差し込む",
            "社会課題関心層": "都市の夜景を見下ろす人物の背中、遠くに赤い炎",
            "哲学心理意識層": "無限に続く暗い廊下、突き当たりだけに赤い光",
            "nTech既接触者": "回路基板パターンが赤く発光、中心が崩壊し始める抽象表現",
            "地方福岡反応層": "博多の夜の港、嵐の前の重い空、遠くに赤い灯台",
            "コミュニティ慎重層": "霧の中で立ち止まる人物の後ろ姿、前方に赤い光",
            "長期課題解決層": "山の稜線に立つシルエット、空が血のように赤い夕焼け",
            "未来社会ビジョン層": "廃墟化した未来都市の夜、赤い月と煙",
        },
    },
    {
        "id": "bt02", "label": "希望提示型",
        "atmosphere": "暖かな金色の光が霧を貫くような、夜明けのグラデーション。柔らかく前向き。",
        "color_spec": {"bg": "#1a0e00", "accent": "#FFD700", "text": "#FFFFFF", "sub": "#FFE8A0"},
        "visual_motif": "地平線から射し込む金色の光。霧・朝靄・光の粒子。",
        "typography_mood": "明朝体系のエレガントな太字。文字間ゆったり。光に包まれる表現。",
        "persona_visual_map": {
            "AI時代価値不安ビジネス層": "夜明けの高層ビル街を歩くビジネスマン、金色の朝日が差し込む",
            "自己変容探求層": "森の中で両手を広げる人物、木漏れ日が金色に降り注ぐ",
            "教育関係者": "教壇に立つ人物、教室の窓から明るい光が差し込む",
            "社会課題関心層": "丘の上に立つ人物、地平線が金色に輝く朝の景色",
            "哲学心理意識層": "瞑想する人物の頭上に金色の光の輪、宇宙的な広がり",
            "nTech既接触者": "黄金の回路網が宇宙に広がる抽象的なビジョン",
            "地方福岡反応層": "博多湾の夜明け、黄金色に染まる水面と街並み",
            "コミュニティ慎重層": "霧の中から一筋の光、人物がそちらへ歩き出す",
            "長期課題解決層": "長い道のりの果てに見える光の丘、夜明けの空",
            "未来社会ビジョン層": "輝く未来都市のホライズン、金色の光が広がる",
        },
    },
    {
        "id": "bt03", "label": "哲学思索型",
        "atmosphere": "純白と深黒の極限まで削ぎ落としたミニマル空間。知性と静寂。",
        "color_spec": {"bg": "#F5F5F5", "accent": "#111111", "text": "#111111", "sub": "#666666"},
        "visual_motif": "幾何学的な余白。単一の線・円・点。禅のような構成美。",
        "typography_mood": "細明朝体と太ゴシックの対比。大きな余白。問いを投げかける配置。",
        "persona_visual_map": {
            "AI時代価値不安ビジネス層": "白紙に一本の亀裂が走る、その先に問いが記される",
            "自己変容探求層": "鏡と鏡が向かい合う無限回廊、白黒モノクロ",
            "教育関係者": "白いキャンバスに一本の線が引かれる瞬間",
            "社会課題関心層": "天秤が傾く白い空間、光と影の幾何学",
            "哲学心理意識層": "白い空間に浮かぶ完全な円、その中に一点の黒",
            "nTech既接触者": "データ構造が白黒の回路図として浮かぶ、極限まで抽象化",
            "地方福岡反応層": "白い紙に墨で書かれた「福岡」の文字、余白に問い",
            "コミュニティ慎重層": "白い部屋の中心に一脚の椅子、光と影のみ",
            "長期課題解決層": "一本の道が白い霧の中に消えていく、足跡のみ残る",
            "未来社会ビジョン層": "白い宇宙に幾何学的な惑星配置、線のみで描く",
        },
    },
    {
        "id": "bt04", "label": "行動喚起型",
        "atmosphere": "漆黒に金のエネルギーが爆発するような力強さ。動と静の瞬間。",
        "color_spec": {"bg": "#0D0D0D", "accent": "#D4AF37", "text": "#FFFFFF", "sub": "#D4AF37"},
        "visual_motif": "対角線・斜めの動線。金の粒子が飛散。決断の瞬間の緊張感。",
        "typography_mood": "極太ゴシック・インパクト体。大きく力強く。行動を促す配置。",
        "persona_visual_map": {
            "AI時代価値不安ビジネス層": "扉を蹴破る瞬間の人物シルエット、金の光が溢れ出す",
            "自己変容探求層": "蝶が羽化する瞬間を金のシャッタースピードで捉えた表現",
            "教育関係者": "黒板に力強く書かれる文字、金色のチョークの粒子が舞う",
            "社会課題関心層": "拳を握り締める手、金色のエネルギーが指先から放出",
            "哲学心理意識層": "思考の爆発をビジュアル化、金の閃光が広がる",
            "nTech既接触者": "神経回路に電流が走る瞬間、金色のシナプス爆発",
            "地方福岡反応層": "博多どんたく的な動の瞬間、金色のエネルギーが爆発",
            "コミュニティ慎重層": "静から動へ、一歩踏み出す足元に金の波紋",
            "長期課題解決層": "山頂に到達する瞬間、両手を広げたシルエット、金の朝日",
            "未来社会ビジョン層": "宇宙船が光速で発射される瞬間の金のエフェクト",
        },
    },
    {
        "id": "bt05", "label": "儀式歴史性型",
        "atmosphere": "古代と現代が交差する荘厳な空間。金箔・水墨・鎧のテクスチャ。",
        "color_spec": {"bg": "#0A0800", "accent": "#C8A415", "text": "#F5E6B0", "sub": "#C8A415"},
        "visual_motif": "和の幾何学・家紋モチーフ。金箔テクスチャ。出陣の儀式感。",
        "typography_mood": "縦書き要素を混在。毛筆風と現代ゴシックの融合。重厚な余白。",
        "persona_visual_map": {
            "AI時代価値不安ビジネス層": "現代のスーツと甲冑が融合した戦士像、金の家紋",
            "自己変容探求層": "脱皮する龍、古代の巻物に描かれた変容の図",
            "教育関係者": "書を手にした武士、金箔の屏風を背景に",
            "社会課題関心層": "出陣式の儀式、旗を掲げる人々のシルエット",
            "哲学心理意識層": "禅僧が書を認める瞬間、墨が宇宙を描く",
            "nTech既接触者": "古代の陣図と現代の回路図が重なる抽象表現",
            "地方福岡反応層": "黒田官兵衛的な福岡の武士像、博多の海を背景に",
            "コミュニティ慎重層": "一人の侍が静かに刀を収める瞬間、覚悟の美学",
            "長期課題解決層": "険しい山道を登る武士の後ろ姿、金の夜明け",
            "未来社会ビジョン層": "星空を背景に鎧武者のシルエット、宇宙と歴史の融合",
        },
    },
    {
        "id": "bt06", "label": "未来社会ビジョン型",
        "atmosphere": "深宇宙から地球を見下ろすような広大なスケール。光の粒子と宇宙の静寂。",
        "color_spec": {"bg": "#050D1A", "accent": "#4FC3F7", "text": "#E8F4FF", "sub": "#90CAF9"},
        "visual_motif": "光の粒子・星雲・ニューラルネットワーク的な線の広がり。",
        "typography_mood": "細く繊細なサンセリフ。光に溶けていく文字表現。未来感ある間隔。",
        "persona_visual_map": {
            "AI時代価値不安ビジネス層": "宇宙から地球を見つめる宇宙服の人物、青い光の惑星",
            "自己変容探求層": "人体から光の粒子が飛び出し宇宙と繋がる表現",
            "教育関係者": "教室が宇宙に開かれていく、子供たちが星を掴もうとする",
            "社会課題関心層": "地球規模のネットワークが光で繋がる俯瞰図",
            "哲学心理意識層": "意識が宇宙に広がる抽象表現、青い光の波紋",
            "nTech既接触者": "宇宙的規模の神経回路、青い光のシナプス網",
            "地方福岡反応層": "宇宙から見た福岡の夜景、青い光が海を照らす",
            "コミュニティ慎重層": "一人の人物が宇宙の扉を開く瞬間、青い光が溢れる",
            "長期課題解決層": "宇宙の彼方に光る目的地、長い光の道が続く",
            "未来社会ビジョン層": "未来都市が宇宙に浮かぶ、青白い光の建築群",
        },
    },
]

# ── JSONスキーマ定義（Geminiへ渡す設計仕様の型） ────────────────────
DESIGN_SPEC_SCHEMA = {
    "visual_scene": {
        "type": "string",
        "desc": "メインビジュアルの場面描写（被写体・環境・構図を日本語で詳細に）"
    },
    "lighting": {
        "type": "string",
        "desc": "光源の種類・方向・強度・色温度の仕様"
    },
    "color_grade": {
        "type": "object",
        "fields": {
            "primary_bg": "背景の主色（hexコード）",
            "accent_light": "アクセント光の色（hexコード）",
            "shadow_depth": "影の深さ（例: 深い/中程度/浅い）",
            "overall_tone": "全体的な色調の一言表現"
        }
    },
    "composition": {
        "type": "string",
        "desc": "構図ルール（三分割法・中央・対角線など）とサイズ別レイアウト指示"
    },
    "texture_detail": {
        "type": "string",
        "desc": "マテリアル・質感の指示（金属光沢・ガラス・霧・粒子感など）"
    },
    "typography_zone": {
        "type": "object",
        "fields": {
            "headline_text": "メインコピー（日本語・最大16文字）",
            "headline_placement": "配置指示（例: 画面中央上部・左寄せ下部など）",
            "headline_style": "文字スタイル（太さ・大きさ感・カラー）",
            "sub_text": "サブコピー（日本語・最大24文字）",
            "event_badge": "イベント情報バッジのテキストと配置（2026.4.29 福岡国際会議場）"
        }
    },
    "negative_space": {
        "type": "string",
        "desc": "意図的な余白設計の指示"
    },
    "quality_modifiers": {
        "type": "array",
        "desc": "画質・スタイル品質の修飾語リスト（英語可）"
    },
    "avoid": {
        "type": "array",
        "desc": "生成してはいけない要素のリスト"
    },
    "imagen4_prompt": {
        "type": "string",
        "desc": "上記仕様を統合した最終Imagen 4プロンプト文（英語・500〜700文字）"
    }
}

def generate_design_spec(persona, tone, size, facts, copies, templates):
    """デザイン仕様JSONをGeminiで生成する"""
    client = genai.Client(api_key=GEMINI_API_KEY)

    # ペルソナに対応するテンプレートカラーを取得
    tpl = next((t for t in templates if t.get("persona_id") == persona["id"]), None)
    color_bg      = tpl["COLOR_BG"]      if tpl else tone["color_spec"]["bg"]
    color_accent  = tpl["COLOR_ACCENT"]  if tpl else tone["color_spec"]["accent"]
    hero_headline = tpl["HERO_HEADLINE"].replace("\n", " ") if tpl else ""
    eyebrow_text  = tpl["EYEBROW_TEXT"]  if tpl else "2026.4.29 福岡"

    visual_motif = tone["persona_visual_map"].get(persona["label"], tone["visual_motif"])

    prompt = f"""あなたは国際的な広告エージェンシーのアートディレクターです。
以下の条件に基づき、Imagen 4で生成するバナー広告の設計仕様をJSONで出力してください。

━━ イベント情報 ━━
イベント名: {facts['event']['official_name']}
日時: {facts['event']['date']}  受付{facts['event']['reception_start']}〜
会場: {facts['event']['venue_name']}（{facts['event']['venue_address']}）
講師: {facts['event']['lecturer']}

━━ ターゲット ━━
ペルソナ: {persona['label']}（{persona['desc']}）

━━ クリエイティブ方針 ━━
トーン: {tone['label']}
雰囲気: {tone['atmosphere']}
ビジュアルモチーフ: {visual_motif}
タイポグラフィ: {tone['typography_mood']}
背景色: {color_bg}  アクセントカラー: {color_accent}

━━ コピー素材 ━━
推奨ヘッドライン: {hero_headline}
アイブロウテキスト: {eyebrow_text}
公式コピー群: {' / '.join(copies['official_copies_direct_use'][:3])}
パワーワード: {' / '.join(copies['power_words'][:6])}

━━ 広告フォーマット ━━
サイズ: {size['ratio']}（{size['desc']}）
レイアウト原則: {size['layout_rule']}
テキスト密度: {size['text_density']}

━━ 出力JSON仕様 ━━
以下のキーを持つJSONのみ出力（説明文・前置き不要）:
{{
  "visual_scene": "メインビジュアルの場面描写（日本語200字程度）",
  "lighting": "光源・方向・色温度の詳細仕様（日本語）",
  "color_grade": {{
    "primary_bg": "{color_bg}",
    "accent_light": "{color_accent}",
    "shadow_depth": "深い/中程度/浅い のいずれか",
    "overall_tone": "全体色調の一言表現"
  }},
  "composition": "構図・レイアウト指示（{size['ratio']}フォーマット専用）",
  "texture_detail": "マテリアル・質感の指示",
  "typography_zone": {{
    "headline_text": "メインコピー（日本語・最大16文字）",
    "headline_placement": "配置場所の指示",
    "headline_style": "フォントの重さ・スタイル感",
    "sub_text": "サブコピー（日本語・最大24文字）",
    "event_badge": "2026.4.29 福岡国際会議場 ← この表記を必ずどこかに配置"
  }},
  "negative_space": "余白設計の意図と指示",
  "quality_modifiers": ["award-winning advertising", "8K ultra sharp", "professional color grading", "cinematic", "高精細"],
  "avoid": ["ぼやけたテキスト", "読めない日本語文字", "過剰なCGI感", "不自然な手・指"],
  "imagen4_prompt": "上記全仕様を英語で統合した最終Imagen 4プロンプト（500〜700文字）。日本語テキストオーバーレイは極力少なく、ビジュアル品質優先で記述。"
}}"""

    resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    text = resp.text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return json.loads(text)

# ── 1件処理 ─────────────────────────────────────────────────────────
def process_one(task, facts, copies, templates, writer, csvfile):
    persona, tone, size = task["persona"], task["tone"], task["size"]
    task_id = f"{persona['id']}_{tone['id']}_{size['id']}"
    try:
        spec = generate_design_spec(persona, tone, size, facts, copies, templates)

        with lock:
            writer.writerow({
                "task_id":           task_id,
                "persona_id":        persona["id"],
                "persona_label":     persona["label"],
                "tone_id":           tone["id"],
                "tone_label":        tone["label"],
                "size_id":           size["id"],
                "aspect_ratio":      size["ratio"],
                "visual_scene":      spec.get("visual_scene", ""),
                "lighting":          spec.get("lighting", ""),
                "color_bg":          spec.get("color_grade", {}).get("primary_bg", ""),
                "color_accent":      spec.get("color_grade", {}).get("accent_light", ""),
                "overall_tone":      spec.get("color_grade", {}).get("overall_tone", ""),
                "composition":       spec.get("composition", ""),
                "texture_detail":    spec.get("texture_detail", ""),
                "headline_text":     spec.get("typography_zone", {}).get("headline_text", ""),
                "sub_text":          spec.get("typography_zone", {}).get("sub_text", ""),
                "event_badge":       spec.get("typography_zone", {}).get("event_badge", ""),
                "negative_space":    spec.get("negative_space", ""),
                "quality_modifiers": json.dumps(spec.get("quality_modifiers", []), ensure_ascii=False),
                "avoid":             json.dumps(spec.get("avoid", []), ensure_ascii=False),
                "imagen4_prompt":    spec.get("imagen4_prompt", ""),
                "full_spec_json":    json.dumps(spec, ensure_ascii=False),
                "generated_at":      datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status":            "done",
            })
            csvfile.flush()
            progress["done"] += 1
            print(f"✅ [{progress['done']}/{progress['total']}] {persona['label']} × {tone['label']} × {size['id']}")

        return task_id, True
    except Exception as e:
        with lock:
            writer.writerow({
                "task_id": task_id, "persona_id": persona["id"],
                "persona_label": persona["label"], "tone_id": tone["id"],
                "tone_label": tone["label"], "size_id": size["id"],
                "aspect_ratio": size["ratio"],
                "visual_scene": "", "lighting": "", "color_bg": "", "color_accent": "",
                "overall_tone": "", "composition": "", "texture_detail": "",
                "headline_text": "", "sub_text": "", "event_badge": "",
                "negative_space": "", "quality_modifiers": "", "avoid": "",
                "imagen4_prompt": "", "full_spec_json": "",
                "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": f"failed: {e}",
            })
            csvfile.flush()
        print(f"❌ {task_id}: {e}")
        return task_id, False

# ── メイン ───────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Imagen 4 バナープロンプト v2（日本語設計 × JSONスキーマ）")
    print("=" * 60)

    with open(CONFIRMED_FACTS, encoding="utf-8") as f: facts = json.load(f)
    with open(COPY_LIBRARY,    encoding="utf-8") as f: copies = json.load(f)
    with open(TEMPLATES_CFG,   encoding="utf-8") as f: templates = json.load(f)

    tasks = [
        {"persona": p, "tone": t, "size": s}
        for p in copies["personas"]
        for t in TONES
        for s in SIZES
    ]
    progress["total"] = len(tasks)
    print(f"📊 10ペルソナ × 6トーン × 4サイズ = {len(tasks)}件\n")

    fieldnames = [
        "task_id","persona_id","persona_label","tone_id","tone_label",
        "size_id","aspect_ratio","visual_scene","lighting","color_bg","color_accent",
        "overall_tone","composition","texture_detail","headline_text","sub_text",
        "event_badge","negative_space","quality_modifiers","avoid",
        "imagen4_prompt","full_spec_json","generated_at","status"
    ]

    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
            futures = [ex.submit(process_one, t, facts, copies, templates, writer, csvfile) for t in tasks]
            concurrent.futures.wait(futures)

    print("\n" + "=" * 60)
    print(f"🎉 完了！  成功: {progress['done']} 件")
    print(f"📋 出力: {OUTPUT_CSV}")
    print("=" * 60)

if __name__ == "__main__":
    main()
