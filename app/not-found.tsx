import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="article-page">
        <article className="article-body">
          <p className="eyebrow">404</p>
          <h1>ページが見つかりませんでした</h1>
          <p className="article-lead">URLが変更されたか、現在準備中のページです。トップページから目的の情報をお探しください。</p>
          <p><a className="text-link" href="/">トップページへ戻る</a></p>
        </article>
      </main>
      <Footer />
    </>
  );
}
