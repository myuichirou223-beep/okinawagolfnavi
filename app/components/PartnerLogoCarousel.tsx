"use client";

import type { Partner } from "../../lib/microcms";

type PartnerLogoCarouselProps = {
  partners: Partner[];
};

export function PartnerLogoCarousel({ partners }: PartnerLogoCarouselProps) {
  const visiblePartners = partners.filter((partner) => partner.logo?.url);

  if (!visiblePartners.length) return null;

  return (
    <div className="partner-logo-carousel" aria-label="パートナーロゴ">
      <div className="partner-logo-track">
        {visiblePartners.map((partner) => {
          const logoUrl = partner.logo?.url;
          if (!logoUrl) return null;
          const content = <img src={logoUrl} alt={partner.name} loading="lazy" />;
          return partner.websiteUrl ? (
            <a
              key={partner.id}
              className="partner-logo-item"
              href={partner.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </a>
          ) : (
            <div key={partner.id} className="partner-logo-item">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
