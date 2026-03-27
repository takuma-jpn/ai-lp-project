# AI LP Project — 5,000枚LP量産プロジェクト

> Google AI Studio Build × Claude Code で自動生成したランディングページ群

## 概要

2026年4月29日開催イベント（[noh-jesu.com/20260429](https://www.event.noh-jesu.com/20260429)）の動員を目的に、
AI オーケストレーションで 5,000枚のLPを30日間で量産するプロジェクトのソースコードです。

## LP一覧

| フォルダ | 商品 | カラー | CTA |
|---|---|---|---|
| `lp_beauty_serum/` | 美白美容液 Luminous Bright Serum | ホワイト×ゴールド | 今すぐ購入する |
| `lp_yoga_subscription/` | オンラインヨガ定額プラン | オレンジ×グリーン | 無料体験を始める |
| `lp_ai_consulting/` | AIビジネス戦略コンサルティング | ネイビー×ホワイト | 無料相談を予約する |

## 技術スタック

- React 19 + TypeScript
- Tailwind CSS v4
- Vite 6
- motion/react（アニメーション）
- lucide-react（アイコン）

## セットアップ

```bash
cd lp_beauty_serum   # or lp_yoga_subscription / lp_ai_consulting
npm install
npm run dev
```

## AI生成ツール

- **Google AI Studio Build**（Gemini 3 Flash Preview）: LPコード生成
- **Claude Code**: オーケストレーション・コード管理
- **GPT Codex**: HTML/CSS補完
- **Antigravity**: デプロイ

## 生成日

2026-03-27
