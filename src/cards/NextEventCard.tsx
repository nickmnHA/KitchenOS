import DashboardCard from "./DashboardCard";

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  calendar: string;
  type: "work" | "personal" | "family";
};

type EventsByDate = Record<string, CalendarEvent[]>;

type UpcomingEvent = CalendarEvent & {
  date: Date;
};

type NextEventCardProps = {
  onNavigate: (page: string) => void;
};
function loadCalendarEvents(): EventsByDate {
  const saved = localStorage.getItem("kitchenos-calendar-v2");

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved) as EventsByDate;
  } catch {
    return {};
  }
}

function createEventDate(dateKey: string, time: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [clockTime, modifier] = time.split(" ");

  let [hours, minutes] = clockTime.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes);
}

function formatEventDate(date: Date) {
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const eventDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (eventDay.getTime() === today.getTime()) {
    return "Today";
  }

  if (eventDay.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function NextEventCard({ onNavigate }: NextEventCardProps) {  const eventsByDate = loadCalendarEvents();
  const now = new Date();

  const upcomingEvents: UpcomingEvent[] = Object.entries(
    eventsByDate,
  ).flatMap(([dateKey, events]) =>
    events.map((event) => ({
      ...event,
      date: createEventDate(dateKey, event.time),
    })),
  );

  const nextEvent = upcomingEvents
    .filter((event) => event.date.getTime() >= now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  return (
    <button
      className="dashboard-card-button"
onClick={() => onNavigate("calendar")}      aria-label="Open calendar"
    >
      <DashboardCard title="Next Event">
        {nextEvent ? (
          <>
            <h3>{nextEvent.title}</h3>

            <p className="card-detail">
              {nextEvent.time} · {formatEventDate(nextEvent.date)}
            </p>

            <p className={`next-event-calendar ${nextEvent.type}`}>
              {nextEvent.calendar}
            </p>
          </>
        ) : (
          <>
            <h3>Nothing upcoming</h3>
            <p className="card-detail">
              Your schedule is clear.
            </p>
          </>
        )}
      </DashboardCard>
    </button>
  );
}

export default NextEventCard;