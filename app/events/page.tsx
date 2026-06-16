import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const metadata = {
  title: "イベント",
  description: "沖縄県内のゴルフイベント情報ページです。現在公開準備中です。"
};

export default function EventsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="section" aria-labelledby="events-title">
          <div className="section-heading">
            <p className="eyebrow">Event</p>
            <h1 id="events-title">イベント</h1>
            <p>沖縄県内の試打会、ゴルフ体験、コンペなどのイベント情報を掲載予定です。</p>
          </div>

          <div className="coming-soon-panel">
            <p className="coming-soon-label">現在準備中</p>
            <h2>イベント情報ページを準備しています</h2>
            <p>
              試打会、大きなコンペ、体験イベントなどを、探しやすい形で掲載できるよう準備中です。
            </p>
            <a className="text-link" href="/">
              トップページへ戻る
            </a>
          </div>
        </section>
      </main>
      <Footer articleLink />
    </>
  );
}
