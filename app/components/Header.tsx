const navItems = [
  ["大会情報", "/tournaments"],
  ["ゴルフ場", "/courses"],
  ["練習場", "/practice"],
  ["イベント", "/#quick-search"],
  ["レッスン", "/#practice"],
  ["ブログ", "/#articles"]
];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="おきなわGOLFなび トップ">
          <img className="brand-logo" src="/assets/logo-header.png" alt="おきなわGOLFなび" />
        </a>
        <nav id="site-nav" className="site-nav" aria-label="主要メニュー">
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
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
            <span>メニュー</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
