import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { courseImages, courseKeywords, coursePath, getCourses } from "../../lib/microcms";

export const revalidate = 300;

export const metadata = {
  title: "沖縄県内のゴルフ場",
  description: "沖縄県内のゴルフ場をエリア、市町村、コース種別ごとに探せる一覧ページです。"
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

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <Header />
      <main id="main">
        <section id="courses" className="section section-muted" aria-labelledby="courses-title">
          <div className="section-heading">
            <p className="eyebrow">Golf Course</p>
            <h1 id="courses-title">沖縄県内のゴルフ場</h1>
            <p>エリア、市町村、種別を確認しながら、県内のゴルフ場を探せます。</p>
          </div>
          <div className="course-filter-groups">
            <div className="filter-bar" aria-label="ゴルフ場のエリア絞り込み">
              <span>エリア</span>
              <button className="course-filter-button is-active" type="button" data-area-filter="all">すべて</button>
              <button className="course-filter-button" type="button" data-area-filter="南部">南部</button>
              <button className="course-filter-button" type="button" data-area-filter="中部">中部</button>
              <button className="course-filter-button" type="button" data-area-filter="北部">北部</button>
              <button className="course-filter-button" type="button" data-area-filter="離島">離島</button>
            </div>
            <div className="filter-bar" aria-label="ゴルフ場のコース種別絞り込み">
              <span>種別</span>
              <button className="course-type-filter-button is-active" type="button" data-type-filter="all">すべて</button>
              <button className="course-type-filter-button" type="button" data-type-filter="long">ロング</button>
              <button className="course-type-filter-button" type="button" data-type-filter="middle">ミドル</button>
              <button className="course-type-filter-button" type="button" data-type-filter="short">ショート</button>
            </div>
          </div>
          <div className="course-list">
            {courses.map((course) => {
              const image = courseImages(course)[0];
              const courseArea = fieldText(course.area);
              const courseCity = fieldText(course.city);
              const courseType = fieldText(course.courseType);
              return (
                <article
                  key={course.id}
                  className="course-row searchable"
                  data-area={areaFilterValue(course.area)}
                  data-course-type={[
                    courseType.includes("ロング") ? "long" : "",
                    courseType.includes("ミドル") ? "middle" : "",
                    courseType.includes("ショート") ? "short" : ""
                  ].filter(Boolean).join(" ")}
                  data-keywords={courseKeywords(course)}
                >
                  <a className="course-card-link" href={coursePath(course)}>
                    <div className={`course-image${image?.url ? "" : " course-image-fallback"}`}>
                      <img src={image?.url || "/assets/hero-golfer.jpg"} alt={course.title} />
                    </div>
                    <h3>{course.title}</h3>
                    <p className="course-card-meta">{[courseArea, courseCity, courseType].filter(Boolean).join(" / ")}</p>
                  </a>
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
