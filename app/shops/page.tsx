import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { getGolfShops, type GolfShop } from "../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "ショップ情報",
  description: "沖縄県内のゴルフ用品店、工房、ショップ、関連サービスを地域別に探せるページです。"
};

const areaOrder = ["南部", "中部", "北部", "離島", "その他"];

function areaGroup(area?: string) {
  if (!area) return "その他";
  if (area.startsWith("離島")) return "離島";
  if (areaOrder.includes(area)) return area;
  return "その他";
}

function shopCategories(shop: GolfShop) {
  return shop.categories.length ? shop.categories : ["取扱内容確認中"];
}

function groupedShops(shops: GolfShop[]) {
  return areaOrder
    .map((area) => ({
      area,
      shops: shops.filter((shop) => areaGroup(shop.area) === area)
    }))
    .filter((group) => group.shops.length);
}

export default async function ShopsPage() {
  const shops = await getGolfShops();
  const groups = groupedShops(shops);

  return (
    <>
      <Header />
      <DesktopSidebarLayout>
        <section id="shops" className="section shops-section" aria-labelledby="shops-title">
          <div className="section-heading">
            <p className="eyebrow">Shop</p>
            <h1 id="shops-title">ショップ情報</h1>
            <p>CMSに登録された施設データから、地域別に店舗規模や新品・中古の取扱傾向を確認できます。</p>
          </div>

          <div className="shop-legend" aria-label="ショップ情報の見方">
            <span>地域別</span>
            <span>大型店舗 / 普通店舗</span>
            <span>新品 / 中古</span>
            <span>クラブ・ウェア・小物</span>
          </div>

          {groups.length ? (
            <div className="shop-area-list">
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
                    {group.shops.map((shop) => {
                      return (
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
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="coming-soon-panel">
              <p className="coming-soon-label">CMSデータ確認中</p>
              <h2>ショップ施設データを準備しています</h2>
              <p>CMSの施設にショップ種別のデータを登録すると、このページに地域別で表示されます。</p>
            </div>
          )}
        </section>
      </DesktopSidebarLayout>
      <Footer articleLink />
    </>
  );
}
