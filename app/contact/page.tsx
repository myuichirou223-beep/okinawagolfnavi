import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { DesktopSidebarLayout } from "../components/DesktopSidebarLayout";

const googleFormDirectUrl = "https://forms.gle/SKkamSAieuaUjuTW6";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "おきなわGOLFなびへの掲載依頼、情報修正、パートナー相談、イベント情報提供のお問い合わせページです。",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <DesktopSidebarLayout mainClassName="contact-page-shell">
        <div className="article-page contact-page">
        <section className="section" aria-labelledby="contact-title">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h1 id="contact-title">お問い合わせ</h1>
            <p>掲載依頼、情報修正、広告掲載、パートナー相談、大会・イベント情報の提供 など各種お問い合わせはこちらからご連絡ください。</p>
          </div>
          <div className="contact-layout contact-layout-simple">
            <div className="contact-card">
              <a className="button-secondary" href={googleFormDirectUrl} target="_blank" rel="noreferrer">
                問い合わせる
              </a>
            </div>
          </div>
        </section>
        </div>
      </DesktopSidebarLayout>
      <Footer />
    </>
  );
}
