import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";

export const metadata = {
  title: "お得情報",
  description: "沖縄県内のゴルフ関連キャンペーン、割引、特典情報ページです。現在公開準備中です。"
};

export default function DealsPage() {
  return (
    <>
      <Header />
      <DesktopSidebarLayout>
        <section id="deals" className="section" aria-labelledby="deals-title">
          <div className="section-heading">
            <p className="eyebrow">Deals</p>
            <h1 id="deals-title">お得情報</h1>
            <p>沖縄県内のゴルフ関連キャンペーン、割引、特典情報を掲載予定です。</p>
          </div>

          <div className="coming-soon-panel">
            <p className="coming-soon-label">現在準備中</p>
            <h2>お得情報ページを準備しています</h2>
            <p>
              ゴルフ場、練習場、ショップ、イベントなどのお得な情報を、探しやすい形で掲載できるよう準備中です。
            </p>
            <a className="text-link" href="/">
              トップページへ戻る
            </a>
          </div>
        </section>
      </DesktopSidebarLayout>
      <Footer articleLink />
    </>
  );
}
