type CalendarEvent = {
  id: string;
  type: "work" | "personal" | "family";
};

type CalendarDay = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

type EventsByDate = Record<string, CalendarEvent[]>;

type CalendarGridProps = {
  weekdays: string[];
  monthDays: CalendarDay[];
  eventsByDate: EventsByDate;
  selectedDateKey: string;
  todayKey: string;
  onSelectDay: (day: CalendarDay) => void;
};

function CalendarGrid({
  weekdays,
  monthDays,
  eventsByDate,
  selectedDateKey,
  todayKey,
  onSelectDay,
}: CalendarGridProps) {
  return (
    <>
      <div className="month-weekdays">
        {weekdays.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>

      <div className="month-grid">
        {monthDays.map((day) => {
          const dayEvents = eventsByDate[day.dateKey] ?? [];
          const isSelected = day.dateKey === selectedDateKey;
          const isToday = day.dateKey === todayKey;

          return (
            <button
              key={day.dateKey}
              className={[
                "month-day",
                !day.isCurrentMonth ? "muted" : "",
                isSelected ? "active" : "",
                isToday ? "today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onSelectDay(day)}
            >
              <span>{day.dayNumber}</span>

              <div className="event-dots">
                {dayEvents.slice(0, 4).map((event) => (
                  <i
                    key={event.id}
                    className={`event-dot ${event.type}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default CalendarGrid;