import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { PortalSidebar } from "../components/PortalSidebar";
import { ShopsHeroCarousel } from "../components/ShopsHeroCarousel";
import { getGolfShops, type GolfShop } from "../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "ショップ情報",
  description: "沖縄県内のゴルフ用品店、工房、ショップ、関連サービスを地域別に探せるページです。"
};

const areaOrder = ["南部", "中部", "北部", "離島", "その他"];
const shopFilterCategories = ["大型ショップ", "ショップ", "新品販売", "中古販売", "工房", "アパレル"] as const;
type ShopFilterCategory = (typeof shopFilterCategories)[number];

type ShopsPageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

function areaGroup(area?: string) {
  if (!area) return "その他";
  if (area.startsWith("離島")) return "離島";
  if (areaOrder.includes(area)) return area;
  return "その他";
}

function shopCategories(shop: GolfShop) {
  return shop.categories.length ? shop.categories : ["取扱内容確認中"];
}

function categoryText(shop: GolfShop) {
  return [
    shop.name,
    shop.storeSize,
    shop.productCondition,
    shop.summary,
    ...shop.categories
  ].join(" ").toLowerCase();
}

function matchesShopCategory(shop: GolfShop, category: ShopFilterCategory) {
  const text = categoryText(shop);

  switch (category) {
    case "大型ショップ":
      return text.includes("大型");
    case "ショップ":
      return (
        !text.includes("大型") &&
        (text.includes("ショップ") ||
          text.includes("店舗") ||
          text.includes("専門店") ||
          text.includes("用品") ||
          text.includes("プロショップ") ||
          text.includes("普通店舗"))
      );
    case "新品販売":
      return text.includes("新品") || text.includes("new");
    case "中古販売":
      return text.includes("中古") || text.includes("used");
    case "工房":
      return (
        text.includes("工房") ||
        text.includes("修理") ||
        text.includes("リペア") ||
        text.includes("フィッティング") ||
        text.includes("調整")
      );
    case "アパレル":
      return (
        text.includes("アパレル") ||
        text.includes("ウェア") ||
        text.includes("ウエア") ||
        text.includes("服")
      );
    default:
      return false;
  }
}

function shopCategoryCounts(shops: GolfShop[]) {
  return shopFilterCategories.map((category) => ({
    category,
    count: shops.filter((shop) => matchesShopCategory(shop, category)).length
  }));
}

function selectedShopCategory(category?: string): ShopFilterCategory {
  return shopFilterCategories.find((item) => item === category) ?? "大型ショップ";
}

function groupedShops(shops: GolfShop[]) {
  return areaOrder
    .map((area) => ({
      area,
      shops: shops.filter((shop) => areaGroup(shop.area) === area)
    }))
    .filter((group) => group.shops.length);
}

export default async function ShopsPage({ searchParams }: ShopsPageProps) {
  const params = await searchParams;
  const shops = await getGolfShops();
  const activeCategory = selectedShopCategory(params?.category);
  const categoryCounts = shopCategoryCounts(shops);
  const filteredShops = shops.filter((shop) => matchesShopCategory(shop, activeCategory));
  const groups = groupedShops(filteredShops);

  return (
    <>
      <Header />
      <main id="main" className="portal-page-shell shops-page-shell">
        <section id="shops" className="shops-hero-section" aria-label="PICK UP">
          <div className="shops-hero">
            <ShopsHeroCarousel />
            <div className="shops-hero__content">
              <p className="shops-hero__eyebrow">Pick Up</p>
            </div>
          </div>
        </section>

        <div className="portal-page-layout">
          <div className="portal-page-content">
            <section className="section shops-section" aria-label="ショップ一覧">
              <div id="shop-categories" className="shop-category-filter" aria-label="ショップカテゴリ">
                {categoryCounts.map(({ category, count }) => (
                  <a
                    key={category}
                    href={`/shops?category=${encodeURIComponent(category)}`}
                    className={category === activeCategory ? "is-active" : undefined}
                    aria-current={category === activeCategory ? "page" : undefined}
                  >
                    <span>{category}</span>
                    <em>{count}件</em>
                  </a>
                ))}
              </div>

              <div className="shop-selected-summary">
                <span>{activeCategory}</span>
                <p>{filteredShops.length}件のショップを表示しています。</p>
              </div>

              {groups.length ? (
                <div id="shop-results" className="shop-area-list">
                  {groups.map((group) => (
                    <section key={group.area} className="shop-area-block" aria-labelledby={`shop-area-${group.area}`}>
                      <div className="shop-area-heading">
                        <div>
                          <p>{group.area}エリア</p>
                          <h2 id={`shop-area-${group.area}`}>{group.area}のゴルフショップ</h2>
                        </div>
                        <span>{group.shops.length}件</span>
                      </div>
                      <p className="shop-area-description">
                        {group.area}エリアでゴルフ用品や関連サービスを探せるショップです。
                      </p>

                      <div className="shop-card-grid">
                        {group.shops.map((shop) => (
                          <article key={shop.id} className="shop-card">
                            <div className="shop-card-inner">
                              <div className="shop-card-image">
                                <img src={shop.imageUrl || "/assets/logo.png"} alt="" loading="lazy" />
                              </div>
                              <div className="shop-card-body">
                                <div className="shop-card-labels">
                                  <span>{shop.city || shop.area || "地域未確認"}</span>
                                  <span>{shop.storeSize}</span>
                                  <span>{shop.productCondition}</span>
                                </div>
                                <h3>{shop.name}</h3>
                                <p>{shop.summary || "ショップの詳細情報を確認中です。"}</p>
                                <div className="shop-card-tags">
                                  {shopCategories(shop).map((category) => (
                                    <em key={category}>{category}</em>
                                  ))}
                                </div>
                                <div className="shop-card-actions">
                                  {shop.website ? (
                                    <a href={shop.website} target="_blank" rel="noreferrer">公式サイト</a>
                                  ) : null}
                                  {shop.mapUrl ? (
                                    <a href={shop.mapUrl} target="_blank" rel="noreferrer">Googleマップ</a>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="coming-soon-panel">
                  <p className="coming-soon-label">該当ショップなし</p>
                  <h2>{activeCategory}のショップはまだ準備中です</h2>
                  <p>CMSの施設データにカテゴリや取扱内容を追加すると、このカテゴリに表示されます。</p>
                </div>
              )}
            </section>
          </div>
          <PortalSidebar />
        </div>
      </main>
      <Footer articleLink />
    </>
  );
}
