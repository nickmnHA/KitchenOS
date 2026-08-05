import { useEffect, useState } from "react";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarEvent = {
  time: string;
  title: string;
  calendar: string;
  type: "work" | "personal" | "family";
};

type MonthDay = {
  date: number;
  muted?: boolean;
  events?: CalendarEvent[];
};

const initialMonthDays: MonthDay[] = [
  { date: 26, muted: true },
  { date: 27, muted: true },
  { date: 28, muted: true },
  { date: 29, muted: true },
  { date: 30, muted: true },
  { date: 31, muted: true },
  { date: 1 },
  { date: 2 },
  { date: 3 },
  {
    date: 4,
    events: [
      {
        time: "9:00 AM",
        title: "Work",
        calendar: "Work",
        type: "work",
      },
      {
        time: "4:30 PM",
        title: "Pick up groceries",
        calendar: "Personal",
        type: "personal",
      },
      {
        time: "6:30 PM",
        title: "Dinner with family",
        calendar: "Family",
        type: "family",
      },
    ],
  },
  {
    date: 5,
    events: [
      {
        time: "10:00 AM",
        title: "Maintenance call",
        calendar: "Work",
        type: "work",
      },
    ],
  },
  { date: 6 },
  {
    date: 7,
    events: [
      {
        time: "7:00 PM",
        title: "Family movie night",
        calendar: "Family",
        type: "family",
      },
    ],
  },
  { date: 8 },
  { date: 9 },
  { date: 10 },
  {
    date: 11,
    events: [
      {
        time: "5:15 PM",
        title: "Grocery pickup",
        calendar: "Personal",
        type: "personal",
      },
    ],
  },
  { date: 12 },
  { date: 13 },
  { date: 14 },
  { date: 15 },
  { date: 16 },
  { date: 17 },
  { date: 18 },
  { date: 19 },
  { date: 20 },
  { date: 21 },
  { date: 22 },
  { date: 23 },
  { date: 24 },
  { date: 25 },
  { date: 26 },
  { date: 27 },
  { date: 28 },
  { date: 29 },
  { date: 30 },
  { date: 31 },
  { date: 1, muted: true },
  { date: 2, muted: true },
  { date: 3, muted: true },
  { date: 4, muted: true },
  { date: 5, muted: true },
];

function Calendar() {
const [monthDays, setMonthDays] = useState<MonthDay[]>(() => {
  const savedCalendar = localStorage.getItem("kitchenos-calendar");

  if (!savedCalendar) {
    return initialMonthDays;
  }

  try {
    return JSON.parse(savedCalendar) as MonthDay[];
  } catch {
    return initialMonthDays;
  }
}); 

const [selectedIndex, setSelectedIndex] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] =
    useState<CalendarEvent["type"]>("personal");
useEffect(() => {
  localStorage.setItem(
    "kitchenos-calendar",
    JSON.stringify(monthDays),
  );
}, [monthDays]);
  const selectedDay = monthDays[selectedIndex];
  const selectedEvents = selectedDay.events ?? [];

  function handleAddEvent() {
    if (!eventTitle.trim() || !eventTime) {
      return;
    }

    const calendarNames = {
      work: "Work",
      personal: "Personal",
      family: "Family",
    };

    const newEvent: CalendarEvent = {
      title: eventTitle.trim(),
      time: eventTime,
      type: eventType,
      calendar: calendarNames[eventType],
    };

    setMonthDays((currentDays) =>
      currentDays.map((day, index) => {
        if (index !== selectedIndex) {
          return day;
        }

        return {
          ...day,
          events: [...(day.events ?? []), newEvent],
        };
      }),
    );

    setEventTitle("");
    setEventTime("");
    setEventType("personal");
    setIsModalOpen(false);
  }

  return (
    <main className="main">
      <div className="calendar-header">
        <div>
          <p className="eyebrow">Schedule</p>
          <h2>Calendar</h2>
        </div>

        <button
          className="calendar-add-button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Event
        </button>
      </div>

      <section className="calendar-layout">
        <div className="calendar-panel">
          <div className="calendar-month-header">
            <button aria-label="Previous month">‹</button>
            <h3>August 2026</h3>
            <button aria-label="Next month">›</button>
          </div>

          <div className="month-weekdays">
            {weekdays.map((weekday) => (
              <div key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className="month-grid">
            {monthDays.map((day, index) => (
              <button
                key={`${day.date}-${index}`}
                className={[
                  "month-day",
                  day.muted ? "muted" : "",
                  selectedIndex === index ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  if (!day.muted) {
                    setSelectedIndex(index);
                  }
                }}
              >
                <span>{day.date}</span>

                <div className="event-dots">
                  {day.events?.map((event, eventIndex) => (
                    <i
                      key={`${event.type}-${eventIndex}`}
                      className={`event-dot ${event.type}`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="agenda-panel">
          <div className="agenda-header">
            <div>
              <p className="eyebrow">Selected day</p>
              <h3>August {selectedDay.date}, 2026</h3>
            </div>

            <span>
              {selectedEvents.length}{" "}
              {selectedEvents.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div className="agenda-list">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <article
                  className={`agenda-event ${event.type}`}
                  key={`${event.time}-${event.title}`}
                >
                  <span className="agenda-time">{event.time}</span>

                  <div>
                    <h4>{event.title}</h4>
                    <p>{event.calendar}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="agenda-empty">
                <p>No events scheduled.</p>
              </div>
            )}
          </div>

          <div className="calendar-legend">
            <span>
              <i className="event-dot work" /> Work
            </span>
            <span>
              <i className="event-dot personal" /> Personal
            </span>
            <span>
              <i className="event-dot family" /> Family
            </span>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <section
            className="event-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="event-modal-header">
              <div>
                <p className="eyebrow">New event</p>
                <h3>August {selectedDay.date}</h3>
              </div>

              <button
                className="modal-close-button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <label>
              Event title
              <input
                type="text"
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                placeholder="Dinner, appointment, practice..."
              />
            </label>

            <label>
              Time
              <input
                type="time"
                value={eventTime}
                onChange={(event) => setEventTime(event.target.value)}
              />
            </label>

            <label>
              Calendar
              <select
                value={eventType}
                onChange={(event) =>
                  setEventType(event.target.value as CalendarEvent["type"])
                }
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="family">Family</option>
              </select>
            </label>

            <button
              className="event-save-button"
              onClick={handleAddEvent}
            >
              Save Event
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Calendar;