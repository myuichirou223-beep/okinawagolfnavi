"use client";

import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "ホーム", subtitle: "Home", href: "/", icon: "home", className: "nav-home" },
  { label: "大会情報", subtitle: "Tournament", href: "/tournaments", icon: "trophy", className: "nav-tournament" },
  { label: "ゴルフ場", subtitle: "Golf Course", href: "/courses", icon: "flag", className: "nav-course" },
  { label: "練習場", subtitle: "Practice Range", href: "/practice", icon: "golf", className: "nav-practice" },
  { label: "お得情報", subtitle: "Deals", href: "/deals", icon: "star", className: "nav-deals" },
  { label: "イベント", subtitle: "Event", href: "/events", icon: "calendar", className: "nav-event" },
  { label: "レッスン", subtitle: "Lesson", href: "/lessons", icon: "lesson", className: "nav-lesson" },
  { label: "記事", subtitle: "Articles", href: "/articles", icon: "blog", className: "nav-blog" }
];

function NavIcon({ name }: { name: string }) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (name === "trophy") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M5 5H3v3a4 4 0 0 0 4 4" />
        <path d="M19 5h2v3a4 4 0 0 1-4 4" />
      </svg>
    );
  }

  if (name === "flag") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 21V4" />
        <path d="M5 5h12l-1.5 4L17 13H5" />
      </svg>
    );
  }

  if (name === "golf") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="9" r="5" />
        <path d="M11 14v7" />
        <path d="M7 21h8" />
        <path d="M15.5 5.5 19 2" />
        <path d="M9 8h.01" />
        <path d="M12 7h.01" />
        <path d="M13 10h.01" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 12h3" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (name === "star") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    );
  }

  if (name === "lesson") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="7" r="3" />
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M18 8h3" />
        <path d="M21 8v8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13 7 4 4" />
      <path d="M12 20h8" />
    </svg>
  );
}

export function Header() {
  const [mobileScrollState, setMobileScrollState] = useState<"normal" | "visible" | "hidden">("normal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateHeader = () => {
      if (window.innerWidth > 860) {
        setMobileScrollState("normal");
        setMobileMenuOpen(false);
        lastScrollY.current = window.scrollY;
        return;
      }

      if (window.innerWidth > 760) {
        setMobileScrollState("normal");
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = Math.max(window.scrollY, 0);
      const previousScrollY = lastScrollY.current;

      if (currentScrollY <= 130) {
        setMobileScrollState("normal");
      } else if (currentScrollY < previousScrollY) {
        setMobileScrollState("visible");
      } else if (currentScrollY > previousScrollY) {
        setMobileScrollState("hidden");
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  return (
    <header className={`site-header mobile-scroll-${mobileScrollState}${mobileMenuOpen ? " mobile-menu-open" : ""}`}>
      <div className="header-inner">
        <a className="brand" href="/" aria-label="おきなわGOLFなび トップ">
          <img className="brand-logo" src="/assets/logo-footer-blue.png" alt="おきなわGOLFなび" />
        </a>
        <div className="header-actions">
          <button
            type="button"
            className="menu-toggle"
            aria-controls="site-nav"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <i aria-hidden="true" />
            <span className="menu-label-ja">{mobileMenuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
        <nav id="site-nav" className="site-nav" aria-label="主要メニュー">
          {navItems.map((item) => (
            <a key={item.label} className={item.className} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-icon" aria-hidden="true">
                <NavIcon name={item.icon} />
              </span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
