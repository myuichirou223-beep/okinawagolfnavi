type FooterProps = {
  articleLink?: boolean;
};

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";

export function Footer({ articleLink = false }: FooterProps) {
  const articleHref = articleLink ? "/#articles" : "#articles";

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="footer-brand" href="/#main" aria-label="おきなわGOLFなび トップへ">
          <img src="/assets/logo-header.png" alt="おきなわGOLFなび" />
        </a>
        <p>沖縄県内の大会、ゴルフ場、練習場、イベント、ブログをわかりやすくまとめる地域ゴルフ情報ポータルです。</p>
      </div>
      <nav className="footer-links" aria-label="フッターリンク">
        <a href="/tournaments">大会情報</a>
        <a href="/courses">ゴルフ場</a>
        <a href="/practice">練習場</a>
        <a href="/#quick-search">イベント</a>
        <a href={articleHref}>{articleLink ? "記事一覧へ" : "ブログ"}</a>
        <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">お問い合わせ</a>
        <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">運営者情報</a>
        <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">プライバシーポリシー</a>
      </nav>
      <small className="copyright">© 2026 Okinawa Golf Navi All Rights Reserved.</small>
    </footer>
  );
}
