export type UpcomingScheduleItem = {
  id: string;
  type: "tournament" | "event";
  title: string;
  audience?: string;
  venue: string;
  eventDate: string;
  dateLabel: string;
  countdownLabel: string;
  href: string;
};

const filters: Array<{ value: "all" | UpcomingScheduleItem["type"]; label: string }> = [
  { value: "all", label: "すべて" },
  { value: "tournament", label: "大会" },
  { value: "event", label: "イベント" }
];

export function UpcomingSchedule({ items }: { items: UpcomingScheduleItem[] }) {
  return (
    <>
      <div className="upcoming-schedule-filters" role="tablist" aria-label="開催予定の種別">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={filter.value === "all"}
            className={filter.value === "all" ? "is-active" : ""}
            data-schedule-filter={filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {items.length ? (
        <>
          <div className="upcoming-schedule-grid" aria-live="polite">
            {items.map((item) => {
            const typeLabel = item.type === "tournament" ? "大会" : "イベント";
            const externalProps = item.href.startsWith("http")
              ? { target: "_blank", rel: "noreferrer" }
              : {};

            return (
              <article
                key={item.id}
                className={`upcoming-schedule-card is-${item.type}`}
                data-schedule-type={item.type}
              >
                <a href={item.href} {...externalProps}>
                  <span className="upcoming-schedule-badge">{typeLabel}</span>
                  <span className="upcoming-schedule-copy">
                    <span className="upcoming-schedule-title-row">
                      <strong>{item.title}</strong>
                      {item.audience ? <em>{item.audience}</em> : null}
                    </span>
                    <small>{item.venue}</small>
                  </span>
                  <span className="upcoming-schedule-date">
                    <time dateTime={item.eventDate}>{item.dateLabel}</time>
                    <b>{item.countdownLabel}</b>
                  </span>
                </a>
              </article>
            );
          })}
          </div>
          <p className="upcoming-schedule-empty" data-schedule-empty hidden>
            該当する開催予定は現在ありません。
          </p>
        </>
      ) : (
        <p className="upcoming-schedule-empty" aria-live="polite">
          該当する開催予定は現在ありません。
        </p>
      )}
    </>
  );
}
