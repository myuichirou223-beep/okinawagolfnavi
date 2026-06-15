import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { getPracticeRanges, practiceRangeKeywords } from "../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "沖縄県内の練習場",
  description: "沖縄県内の屋外・屋内ゴルフ練習場、レッスン施設をエリアと種別で探せる一覧ページです。"
};

function fieldText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(fieldText).filter(Boolean).join("・");
  if (typeof value !== "object") return "";

  const field = value as Record<string, unknown>;
  const candidates = [field.value, field.label, field.name, field.title, field.text, field.area, field.id];
  for (const candidate of candidates) {
    const text = fieldText(candidate);
    if (text) return text;
  }
  return "";
}

function areaFilterValue(value: unknown): string {
  const area = fieldText(value);
  return area.startsWith("離島") ? "離島" : area;
}

export default async function PracticePage() {
  const practiceRanges = await getPracticeRanges();

  return (
    <>
      <Header />
      <main id="main">
        <section id="practice" className="section" aria-labelledby="practice-title">
          <div className="section-heading">
            <p className="eyebrow">Practice</p>
            <h1 id="practice-title">沖縄県内の練習場</h1>
            <p>屋外・屋内、エリア別に練習場やレッスン施設を確認できます。</p>
          </div>
          <div className="course-filter-groups">
            <div className="filter-bar" aria-label="練習場の種別絞り込み">
              <span>種別</span>
              <button className="practice-filter-button is-active" type="button" data-practice-filter="all">すべて</button>
              <button className="practice-filter-button" type="button" data-practice-filter="屋外">屋外</button>
              <button className="practice-filter-button" type="button" data-practice-filter="屋内">屋内</button>
            </div>
            <div className="filter-bar" aria-label="練習場のエリア絞り込み">
              <span>エリア</span>
              <button className="practice-area-filter-button is-active" type="button" data-practice-area-filter="all">すべて</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="南部">南部</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="中部">中部</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="北部">北部</button>
              <button className="practice-area-filter-button" type="button" data-practice-area-filter="離島">離島</button>
            </div>
          </div>
          <div className="practice-list">
            {practiceRanges.map((range) => {
              const rangeCategory = fieldText(range.category) || "練習場";
              const rangeArea = fieldText(range.area) || "沖縄県";
              return (
                <article
                  key={range.id}
                  className="practice-row searchable"
                  data-practice-category={rangeCategory}
                  data-practice-area={areaFilterValue(range.area)}
                  data-keywords={practiceRangeKeywords(range)}
                >
                  <details>
                    <summary>
                      <span className="practice-summary-main">
                        <span className="practice-name">{range.name}</span>
                        <span className="practice-location-line">{[rangeCategory, rangeArea].filter(Boolean).join(" / ")}</span>
                      </span>
                      <span className="practice-open-label">詳細</span>
                    </summary>
                    <div className="practice-detail">
                      <p><strong>住所</strong>{range.address || "所在地確認中"}</p>
                      {range.accessFromNaha ? <p><strong>アクセス</strong>{range.accessFromNaha}</p> : null}
                      <div className="practice-actions">
                        {range.phone ? <a className="text-link" href={`tel:${range.phone.replace(/[^0-9+]/g, "")}`}>{range.phone}</a> : null}
                        {range.url ? <a className="text-link" href={range.url} target="_blank" rel="noreferrer">公式サイト</a> : null}
                      </div>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
