import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";

export const metadata = {
  title: "レッスン",
  description: "沖縄県内のゴルフレッスン情報ページです。現在公開準備中です。"
};

export default function LessonsPage() {
  return (
    <>
      <Header />
      <DesktopSidebarLayout>
        <section id="lessons" className="section" aria-labelledby="lessons-title">
          <div className="section-heading">
            <p className="eyebrow">Lesson</p>
            <h1 id="lessons-title">レッスン</h1>
            <p>沖縄県内のゴルフレッスン情報を掲載予定です。</p>
          </div>

          <div className="coming-soon-panel">
            <p className="coming-soon-label">現在準備中</p>
            <h2>レッスン情報ページを準備しています</h2>
            <p>
              スクール、個人レッスン、ジュニア向けレッスンなど、探しやすい形で掲載できるよう準備中です。
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
