# Project Structure

おきなわGOLFなびWEBサイトの主なフォルダ構成です。

## サイト本体

- `app/`: Next.jsのページ、レイアウト、コンポーネント
- `lib/`: microCMS取得処理、表示用ヘルパー
- `public/`: ロゴ、ファビコン、ヒーロー画像、公開用JavaScript
- `styles.css`: サイト全体のスタイル
- `package.json`: 開発・ビルドコマンド

## 管理用

- `microcms/`: microCMSのフィールド定義メモ、インポート用テンプレート
- `docs/`: microCMS運用メモ
- `tools/`: CSV変換などの補助スクリプト
- `_data/imports/`: microCMSへ取り込むCSVや管理用スプレッドシート

## 退避済み

- `_archive/generated-zips/`: 過去の公開用ZIP
- `_archive/generated-folders/`: ZIP展開後の過去作業フォルダ
- `_archive/legacy-static/`: Next.js化前の静的HTMLサイト

`_archive/` はサイト本体では使いません。過去データを確認したいときだけ見れば大丈夫です。
