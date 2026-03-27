# LP制作記録ディレクトリ / LP Records

## 概要

このディレクトリは、Google AI Studio Build機能で作成したLPの**公開URL・編集URL・オーナー情報**を管理するためのものです。

チームメンバーが**それぞれ独立したCSVファイル**に記録することで、同時並行での作業・追記が可能です。

---

## ディレクトリ構成

```
lp-records/
├── README.md              ← このファイル（運用ルール）
├── takuma-jpn.csv         ← オーナー: takuma-jpn (famis.takaoka@gmail.com)
├── member-a.csv           ← オーナー: メンバーA（Googleアカウント名に変更）
└── member-b.csv           ← オーナー: メンバーB（Googleアカウント名に変更）
```

> **ルール: 1人1ファイル。自分のCSVだけを編集する。**
> 他のメンバーのファイルは読み取り専用として扱うこと。

---

## CSVカラム仕様

| カラム名 | 説明 | 例 |
|---|---|---|
| `owner_account` | Google AI StudioのログインアカウントID | `takuma-jpn` |
| `owner_email` | ログインメールアドレス | `famis.takaoka@gmail.com` |
| `lp_name` | LPのタイトル（AI Studioのアプリ名） | `Luminous Bright Serum LP` |
| `lp_category` | LPのジャンル・カテゴリ | `美白美容液` |
| `app_id` | Google AI StudioのアプリID（UUID） | `65517f96-c41d-4681-8214-02b29fb8f0a3` |
| `edit_url` | 編集ページURL（ログインが必要） | `https://aistudio.google.com/app/apps/{app_id}` |
| `public_url` | 公開URL（誰でもアクセス可能） | Cloud Run発行後に記入 |
| `publish_status` | 公開状態 | `draft` / `publishing` / `published` |
| `published_at` | 公開日（YYYY-MM-DD） | `2026-03-27` |
| `note` | 備考 | GCPプロジェクト名など |

---

## 新しいLPを記録する手順

### 1. Google AI Studio BuildでLP作成後

1. アプリページのURLからアプリIDを取得する
   例: `https://aistudio.google.com/app/apps/`**`{ここがapp_id}`**

2. 編集URLを記録する
   ```
   https://aistudio.google.com/app/apps/{app_id}
   ```

### 2. Publishして公開URLを取得

1. アプリページ右上の「Share」→「Publish」タブをクリック
2. 「Get started」→ GCPプロジェクトを選択 →「Publish app」をクリック
3. デプロイ完了後に表示されるCloud Run URLをコピー
   例: `https://{app-name}-XXXX.run.app`

### 3. 自分のCSVに1行追記する

```csv
owner_account,owner_email,lp_name,lp_category,app_id,edit_url,public_url,publish_status,published_at,note
自分のID,自分のメール,LP名,カテゴリ,app_id,編集URL,公開URL,published,2026-XX-XX,備考
```

---

## 同時並行での運用ルール

- **1人1ファイル**: `{自分のGoogleアカウントID}.csv` を使う
- **コンフリクト防止**: 他人のCSVは絶対に編集しない
- **ファイル名命名規則**: Googleアカウントのユーザー名部分（`@`より前）をファイル名にする
  例: `takuma-jpn.csv`、`yamada-taro.csv`
- **GitHubへのpush**: LP作成のたびに `git add → commit → push` で記録を蓄積する
- **public_urlが未取得の場合**: `publish_status=publishing` のまま残し、取得後に更新する

---

## 現在のチーム構成

| メンバー | アカウント | CSVファイル | 役割 |
|---|---|---|---|
| 髙岡拓真 | takuma-jpn | takuma-jpn.csv | プロジェクトリーダー |
| メンバーA | （変更してください） | member-a.csv | AI初心者担当 |
| メンバーB | （変更してください） | member-b.csv | AIエージェント壁打ち担当 |

---

## 5,000枚LP進捗確認コマンド

CSVの総行数（ヘッダー除く）でLP数を確認：

```bash
# 全メンバーの合計LP数
tail -n +2 *.csv | grep -v "^$" | wc -l

# publishedのみカウント
grep "published," *.csv | wc -l

# オーナーごとの内訳
for f in *.csv; do echo "$f: $(tail -n +2 $f | grep -v '^$' | wc -l)枚"; done
```

---

## 関連ファイル

- `../agents/` — AIエージェント定義（オーケストレーター含む）
- `../AI_LP_Project_Plan.docx` — プロジェクト詳細計画書
- `../AI_LP_Project_Kickoff.pptx` — キックオフスライド
- GitHub: https://github.com/takuma-jpn/ai-lp-project
