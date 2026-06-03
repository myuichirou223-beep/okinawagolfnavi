# courses API field plan

おきなわGOLFなびのゴルフ場情報をmicroCMSで管理するためのフィールド案です。

| 表示名 | フィールドID | 種類 | 必須 | 用途 |
| --- | --- | --- | --- | --- |
| ゴルフ場名 | title | テキストフィールド | yes | 一覧・詳細の見出し |
| slug | slug | テキストフィールド | yes | URL用。英数字とハイフン |
| 掲載状態 | status | セレクト | yes | draft / review / published / archived |
| エリア | area | セレクト | yes | 南部 / 中部 / 北部 / 離島 |
| 市町村 | city | テキストフィールド | yes | 市町村別ページ用 |
| 種類 | courseType | セレクト | yes | ロングコース / ミドルコース / ショートコース |
| 住所 | address | テキストフィールド | yes | 施設情報 |
| 電話番号 | phone | テキストフィールド | no | 施設情報 |
| 公式サイトURL | websiteUrl | テキストフィールド | no | 外部リンク |
| 予約URL | reservationUrl | テキストフィールド | no | 予約導線 |
| 空港アクセス | airportAccess | テキストエリア | no | 観光客向け情報 |
| ホール数 | holes | 数字 | no | 絞り込み・表示用 |
| Par | par | 数字 | no | 絞り込み・表示用 |
| 特徴 | summary | テキストエリア | yes | 一覧・詳細の説明 |
| 初心者向け | isBeginnerFriendly | 真偽値 | no | 特集・絞り込み |
| 観光客向け | isTouristFriendly | 真偽値 | no | 特集・絞り込み |
| 練習場あり | hasPracticeArea | 真偽値 | no | 施設情報 |
| パートナー候補 | isPartnerCandidate | 真偽値 | no | 営業・広告管理 |
| 最終確認日 | lastChecked | 日付 | no | 情報鮮度の管理 |
| 情報ソース | sourceUrl | テキストフィールド | no | 確認元 |
| メモ | memo | テキストエリア | no | 管理用メモ。サイトには出さない |
| 写真1 | photo1 | 画像 | no | 詳細ページの写真スライド1枚目 |
| 写真2 | photo2 | 画像 | no | 詳細ページの写真スライド |
| 写真3 | photo3 | 画像 | no | 詳細ページの写真スライド |
| 写真4 | photo4 | 画像 | no | 詳細ページの写真スライド |
| 写真5 | photo5 | 画像 | no | 詳細ページの写真スライド |

## 運用ルール

- スプレッドシートでは調査・確認を行う。
- `掲載状態` が `掲載OK` の行だけmicroCMSへ登録する。
- microCMS登録後は、公開情報の正はmicroCMSにする。
- スプレッドシートは、未確認施設・一括確認・営業メモ用として残す。
- `slug` は変更するとURLが変わるため、公開後は原則変更しない。
- 写真はまず `photo1` から `photo5` の最大5枚で管理する。
