const navItems = [
  { label: "大会情報", subtitle: "Tournament", href: "/tournaments", icon: "T", className: "nav-tournament" },
  { label: "ゴルフ場", subtitle: "Golf Course", href: "/courses", icon: "F", className: "nav-course" },
  { label: "練習場", subtitle: "Practice Range", href: "/practice", icon: "G", className: "nav-practice" },
  { label: "イベント", subtitle: "Event", href: "/#quick-search", icon: "E", className: "nav-event" },
  { label: "レッスン", subtitle: "Lesson", href: "/#practice", icon: "L", className: "nav-lesson" },
  { label: "ブログ", subtitle: "Blog", href: "/#articles", icon: "B", className: "nav-blog" }
];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="おきなわGOLFなび トップ">
          <img className="brand-logo" src="/assets/logo-header.png" alt="おきなわGOLFなび" />
        </a>
        <nav id="site-nav" className="site-nav" aria-label="主要メニュー">
          {navItems.map((item) => (
            <a key={item.label} className={item.className} href={item.href}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <span className="nav-subtitle">{item.subtitle}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions" aria-label="ヘッダー操作">
          <a className="header-action-link" href="#partners" aria-label="お気に入り">
            <span aria-hidden="true">♡</span>
            <small>お気に入り</small>
          </a>
          <a className="header-action-link" href="#topics" aria-label="検索">
            <span aria-hidden="true">⌕</span>
            <small>検索</small>
          </a>
          <button className="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="メニューを開く">
            <span>MENU</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
