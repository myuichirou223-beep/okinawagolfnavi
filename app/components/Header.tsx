const navItems = [
  ["最新情報", "/#topics"],
  ["大会", "/#tournaments"],
  ["イベント", "/#events"],
  ["ゴルフ場", "/#courses"],
  ["練習場", "/#practice"],
  ["記事", "/#articles"],
  ["パートナー", "/#partners"]
];

export function Header() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="おきなわGOLFなび トップ">
            <img className="brand-logo" src="/assets/logo-header.png" alt="おきなわGOLFなび" />
          </a>
          <button className="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">
            <span>メニュー</span>
            <i aria-hidden="true" />
          </button>
          <nav id="site-nav" className="site-nav" aria-label="主要メニュー">
            {navItems.map(([label, href]) => (
              <a key={label} href={href}>{label}</a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
