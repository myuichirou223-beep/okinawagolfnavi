import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { PhoneLink } from "../../components/PhoneLink";
import { courseDescription, courseImages, coursePath, getCourse, getCourses, googleMapsUrl } from "../../../lib/microcms";

type CoursePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({
    slug: course.slug
  }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) return {};

  const title = `${course.title} | 沖縄県のゴルフ場情報`;
  const description = courseDescription(course);
  const url = coursePath(course);

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: ["/assets/logo.png"]
    },
    twitter: {
      card: "summary_large_image"
    }
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) notFound();

  const images = courseImages(course);
  const mapUrl = googleMapsUrl(course);
  const details = [
    ["エリア", course.area],
    ["市町村", course.city],
    ["種類", course.courseType],
    ["ホール数", course.holes ? `${course.holes}H` : ""],
    ["Par", course.par ? String(course.par) : ""],
    ["那覇空港から", course.airportAccess],
    ["最終確認", course.lastChecked]
  ].filter(([, value]) => Boolean(value));

  return (
    <>
      <Header />
      <main id="main" className="article-page course-detail-page">
        <article className="article-body">
          <p className="eyebrow">Golf Course</p>
          <h1>{course.title}</h1>
          <p className="article-lead">{courseDescription(course)}</p>
          <div className="article-meta">
            {[course.area, course.city, course.courseType].filter(Boolean).join(" / ") || "沖縄県のゴルフ場"}
          </div>

          {images.length ? (
            <section className="course-gallery" aria-label={`${course.title}の写真`}>
              <div className="course-gallery-track">
                {images.map((image, index) => (
                  <figure key={image.url} className="course-gallery-slide">
                    <img src={image.url} alt={`${course.title}の写真 ${index + 1}`} />
                    <figcaption>{index + 1} / {images.length}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <dl className="course-detail-list">
            {course.address ? (
              <div className="course-detail-address">
                <dt>住所</dt>
                <dd>
                  <span>{course.address}</span>
                  {mapUrl ? (
                    <a className="text-link map-link" href={mapUrl} target="_blank" rel="noreferrer">
                      Googleマップで見る
                    </a>
                  ) : null}
                </dd>
              </div>
            ) : null}
            {course.phone ? (
              <div>
                <dt>電話番号</dt>
                <dd>
                  <PhoneLink phone={course.phone} />
                </dd>
              </div>
            ) : null}
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {course.features ? (
            <>
              <h2>特徴</h2>
              <p>{course.features}</p>
            </>
          ) : null}

          <div className="course-actions">
            {course.websiteUrl ? (
              <a className="button-secondary" href={course.websiteUrl} target="_blank" rel="noreferrer">
                公式サイトを見る
              </a>
            ) : null}
            {course.reservationUrl ? (
              <a className="button-secondary" href={course.reservationUrl} target="_blank" rel="noreferrer">
                予約ページを見る
              </a>
            ) : null}
            <a className="text-link" href="/#courses">
              ゴルフ場一覧へ戻る
            </a>
          </div>

          <aside className="ad-slot" aria-label="広告">
            <span>広告</span>
            <strong>この施設周辺のパートナー掲載枠</strong>
            <p>宿泊、レンタカー、飲食店、レッスンなど、ゴルフ場と関連性の高い情報を掲載できます。</p>
          </aside>
        </article>
      </main>
      <Footer articleLink />
    </>
  );
}
