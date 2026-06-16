type FooterProps = {
  articleLink?: boolean;
};

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";

export function Footer({ articleLink = false }: FooterProps) {
  const articleHref = "/articles";
  const footerItems = [
    { label: "大会情報", href: "/tournaments" },
    { label: "ゴルフ場", href: "/courses" },
    { label: "練習場", href: "/practice" },
    { label: "イベント", href: "/events" },
    { label: "レッスン", href: "/lessons" },
    { label: "ブログ", href: articleHref },
    { label: "お問い合わせ", href: googleFormDirectUrl, external: true },
    { label: "運営者情報", href: googleFormDirectUrl, external: true },
    { label: "プライバシーポリシー", href: googleFormDirectUrl, external: true }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="footer-brand" href="/#main" aria-label="おきなわGOLFなび トップへ">
          <img src="/assets/logo-header.png" alt="おきなわGOLFなび" />
        </a>
        <p>沖縄県内の大会、ゴルフ場、練習場、イベント、ブログをわかりやすくまとめる地域ゴルフ情報ポータルです。</p>
      </div>
      <nav className="footer-links" aria-label="フッターリンク">
        {footerItems.map((item) => (
          <a key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="footer-accordion" aria-label="フッターリンク">
        {footerItems.map((item) => (
          <details key={item.label}>
            <summary>{item.label}</summary>
            <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
              {item.label}へ移動
            </a>
          </details>
        ))}
      </div>
      <small className="copyright">© 2026 Okinawa Golf Navi All Rights Reserved.</small>
    </footer>
  );
}
