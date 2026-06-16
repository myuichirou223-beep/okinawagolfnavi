"use client";

import { useMemo, useState } from "react";

export type CalendarEventData = {
  id: string;
  title: string;
  dateIso: string;
  label: string;
  type: "tournament" | "event" | "demo" | "competition" | "lesson";
  href: string;
  venue?: string;
};

type EventCalendarProps = {
  events: CalendarEventData[];
  initialYear: number;
  initialMonth: number;
};

function calendarTypeLabel(type: CalendarEventData["type"]) {
  const labels = {
    tournament: "大会",
    event: "イベント",
    demo: "試打会",
    competition: "コンペ",
    lesson: "レッスン"
  };
  return labels[type];
}

function calendarMonthTitle(year: number, month: number) {
  return `${year}年${month + 1}月`;
}

function calendarDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = Array.from({ length: firstDay.getDay() }, (_, index) => ({
    key: `blank-${index}`,
    day: 0,
    date: null as Date | null
  }));
  const days = Array.from({ length: daysInMonth }, (_, index) => ({
    key: `day-${index + 1}`,
    day: index + 1,
    date: new Date(year, month, index + 1)
  }));

  return [...leadingBlanks, ...days];
}

function isExternalUrl(url: string) {
  return url.startsWith("http");
}

export function EventCalendar({ events, initialYear, initialMonth }: EventCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialYear, initialMonth, 1));
  const normalizedEvents = useMemo(
    () =>
      events
        .map((event) => ({ ...event, date: new Date(event.dateIso) }))
        .filter((event) => !Number.isNaN(event.date.getTime()))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [events]
  );
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const visibleCalendarEvents = normalizedEvents.filter(
    (event) => event.date.getFullYear() === year && event.date.getMonth() === month
  );
  const calendarCells = buildCalendarCells(year, month);

  function changeMonth(amount: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  return (
    <aside className="event-calendar-card" aria-labelledby="event-calendar-title">
      <div className="calendar-heading">
        <div>
          <p className="portal-eyebrow">Calendar</p>
          <h2 id="event-calendar-title">イベントカレンダー</h2>
        </div>
        <div className="calendar-nav" aria-label="月の切り替え">
          <button type="button" onClick={() => changeMonth(-1)}>前月</button>
          <button type="button" onClick={() => changeMonth(1)}>次月</button>
        </div>
      </div>
      <h3>{calendarMonthTitle(year, month)}</h3>
      <div className="calendar-grid" aria-label={`${calendarMonthTitle(year, month)}カレンダー`}>
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => <b key={day}>{day}</b>)}
        {calendarCells.map((cell) => {
          if (!cell.date) return <span key={cell.key} className="is-empty" aria-hidden="true" />;
          const dayEvents = visibleCalendarEvents.filter((event) => calendarDateKey(event.date) === calendarDateKey(cell.date as Date));
          const firstEvent = dayEvents[0];
          return dayEvents.length ? (
            <a
              key={cell.key}
              className={`has-event event-type-${firstEvent.type}`}
              href={`#calendar-event-${firstEvent.id}`}
              aria-label={`${cell.day}日 ${dayEvents.length}件の予定`}
            >
              <span>{cell.day}</span>
              <i aria-hidden="true">{dayEvents.length}</i>
            </a>
          ) : (
            <span key={cell.key}>{cell.day}</span>
          );
        })}
      </div>
      <div className="calendar-legend">
        {["大会", "イベント", "試打会", "コンペ", "レッスン"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <div className="calendar-event-list" aria-label="表示月の予定">
        {visibleCalendarEvents.length ? (
          visibleCalendarEvents.slice(0, 5).map((event) => {
            const externalProps = isExternalUrl(event.href) ? { target: "_blank", rel: "noreferrer" } : {};
            return (
              <a
                id={`calendar-event-${event.id}`}
                key={event.id}
                className={`calendar-event-item event-type-${event.type}`}
                href={event.href}
                {...externalProps}
              >
                <time>{event.date.getMonth() + 1}/{event.date.getDate()}</time>
                <span>{calendarTypeLabel(event.type)}</span>
                <strong>{event.title}</strong>
              </a>
            );
          })
        ) : (
          <p className="calendar-empty">この月の予定は確認中です。前月・次月を確認してください。</p>
        )}
      </div>
    </aside>
  );
}
