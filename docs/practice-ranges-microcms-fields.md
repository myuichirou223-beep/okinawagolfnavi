# practice-ranges API field plan

おきなわGOLFなびの「練習場・レッスン施設」をmicroCMSで管理するためのフィールド案です。

## API設定

- API名: 練習場
- エンドポイント: `practice-ranges`
- 形式: リスト形式

| 表示名 | フィールドID | 種類 | 必須 | 用途 |
| --- | --- | --- | --- | --- |
| 施設名 | name | テキストフィールド | yes | 練習場名 |
| カテゴリ | category | セレクト | yes | 屋外 / 屋内 / レッスン |
| エリア | area | セレクト | yes | 南部 / 中部 / 北部 / 離島 |
| 住所 | address | テキストフィールド | no | 所在地 |
| 電話番号 | phone | テキストフィールド | no | 電話リンク用 |
| 公式URL | url | テキストフィールド | no | 公式サイト |
| 那覇空港から | accessFromNaha | テキストフィールド | no | アクセス目安 |
| 掲載状態 | status | セレクト | yes | 営業確認済み / 確認中 / draft / archived |

## 初期データの一括登録

屋外のみ追加する場合は `_data/imports/practice-ranges-import-microcms.csv` を使います。
屋内のみ追加する場合は `_data/imports/practice-ranges-indoor-import-microcms.csv` を使います。
屋外・屋内をまとめて新規登録する場合は `_data/imports/practice-ranges-all-import-microcms.csv` を使います。

microCMSの練習場API画面でCSVインポートを開き、このファイルをアップロードしてください。

`status` が `draft` または `archived` のものはサイト側では非表示になります。
