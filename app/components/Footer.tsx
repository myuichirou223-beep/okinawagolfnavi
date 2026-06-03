type FooterProps = {
  articleLink?: boolean;
};

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";

export function Footer({ articleLink = false }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="footer-brand" href="/#main" aria-label="おきなわGOLFなび トップへ">
          <img src="/assets/logo-header.png" alt="おきなわGOLFなび" />
        </a>
        <p>沖縄県内のゴルフ情報を、見やすく、探しやすく、参加しやすく。</p>
      </div>
      <div className="footer-side">
        <nav className="footer-links" aria-label="フッターリンク">
          <a href="/#topics">最新情報</a>
          <a href="/#courses">ゴルフ場</a>
          <a href="/#practice">練習場</a>
          <a href={articleLink ? "/#articles" : "#articles"}>{articleLink ? "記事一覧へ" : "記事"}</a>
          <a href={googleFormDirectUrl} target="_blank" rel="noreferrer">お問い合わせ</a>
        </nav>
        <small className="copyright">Copyright © おきなわGOLFなび All Rights Reserved.</small>
      </div>
    </footer>
  );
}
