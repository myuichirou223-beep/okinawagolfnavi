"use client";

import { useState } from "react";

type RouteId = "self-paced" | "lesson";

type RouteDetail = {
  id: RouteId;
  label: string;
  banner: string;
  detailImage: string;
  accent: "green" | "pink";
  recommendationTitle: string;
};

type RecommendationCard = {
  title: string;
  lead: string;
  body: string;
  image: string;
};

const routeDetails: RouteDetail[] = [
  {
    id: "self-paced",
    label: "マイペース派に 自分で頑張る",
    banner: "/assets/beginner/route-self-paced.png",
    detailImage: "/assets/beginner/detail-self-paced.png",
    accent: "green",
    recommendationTitle: "初心者におすすめの練習場"
  },
  {
    id: "lesson",
    label: "安心して学びたい人に レッスンを受ける",
    banner: "/assets/beginner/route-lesson.png",
    detailImage: "/assets/beginner/detail-lesson.png",
    accent: "pink",
    recommendationTitle: "初心者におすすめのレッスン施設"
  }
];

function GuideIcon({ name }: { name: string }) {
  return <span className={`beginner-guide__icon is-${name}`} aria-hidden="true" />;
}

function recommendationGrid(cards: RecommendationCard[]) {
  return cards.map((card) => (
    <article key={card.title} className="beginner-guide__course-card">
      <img src={card.image} alt="" loading="lazy" />
      <div>
        <h3>{card.title}</h3>
        <strong>{card.lead}</strong>
        <p>{card.body}</p>
      </div>
    </article>
  ));
}

export function BeginnerRouteSwitcher({
  selfPacedRecommendations,
  lessonRecommendations
}: {
  selfPacedRecommendations: RecommendationCard[];
  lessonRecommendations: RecommendationCard[];
}) {
  const [activeRouteId, setActiveRouteId] = useState<RouteId>("self-paced");
  const activeRoute = routeDetails.find((route) => route.id === activeRouteId) || routeDetails[0];
  const recommendations = activeRoute.id === "lesson" ? lessonRecommendations : selfPacedRecommendations;

  return (
    <>
      <div className="beginner-guide__branch-banners" role="tablist" aria-label="スタートルート">
        {routeDetails.map((route) => (
          <button
            key={route.id}
            type="button"
            className={`beginner-guide__branch-banner is-${route.accent}${activeRoute.id === route.id ? " is-active" : ""}`}
            aria-label={route.label}
            aria-selected={activeRoute.id === route.id}
            role="tab"
            onClick={() => setActiveRouteId(route.id)}
          >
            <img src={route.banner} alt="" loading={route.id === "self-paced" ? "eager" : "lazy"} />
          </button>
        ))}
      </div>

      <div className={`beginner-guide__branch-detail-image is-${activeRoute.accent}`} role="tabpanel">
        <img src={activeRoute.detailImage} alt={`${activeRoute.label}の詳細`} loading="lazy" />
      </div>

      <section className="beginner-guide__branch-recommendations" aria-labelledby="beginner-branch-recommendations-title">
        <h2 id="beginner-branch-recommendations-title" className="beginner-guide__section-title">
          <GuideIcon name="flag" />
          {activeRoute.recommendationTitle}
        </h2>
        <div className="beginner-guide__course-grid">{recommendationGrid(recommendations)}</div>
      </section>
    </>
  );
}
