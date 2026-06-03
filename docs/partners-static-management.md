# パートナー枠の一時運用

microCMSの無料枠で新しいAPIを追加できない間、パートナーロゴはサイト内の固定データで管理します。

## 管理方法

- パートナー名、リンク先、表示順は `lib/microcms.ts` の `fallbackPartners` を編集する。
- ロゴ画像を使う場合は `public/assets/partners/` に画像を置き、`logo: { url: "/assets/partners/example.png" }` を追加する。
- 一時的に非表示にする場合は `status: "draft"` にする。
- 表示順は `displayOrder` の数字で調整する。

## 例

```ts
{
  id: "example-partner",
  name: "サンプル企業",
  logo: { url: "/assets/partners/example.png" },
  websiteUrl: "https://example.com",
  status: "published",
  displayOrder: 10
}
```

## 将来の移行

microCMSのAPI枠に余裕ができたら、`partners` APIを作成し、`getPartners()` をmicroCMS取得に戻します。
