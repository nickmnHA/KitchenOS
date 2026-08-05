import DashboardCard from "./DashboardCard";

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  calendar: string;
  type: "work" | "personal" | "family";
};

type EventsByDate = Record<string, CalendarEvent[]>;

type TodayCardProps = {
  onNavigate: (page: string) => void;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function convertTimeToMinutes(time: string) {
  const [clockTime, modifier] = time.split(" ");
  let [hours, minutes] = clockTime.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function loadTodayEvents(): CalendarEvent[] {
  const saved = localStorage.getItem("kitchenos-calendar-v2");

  if (!saved) {
    return [];
  }

  try {
    const eventsByDate = JSON.parse(saved) as EventsByDate;
    const todayKey = getDateKey(new Date());

    return [...(eventsByDate[todayKey] ?? [])].sort(
      (a, b) =>
        convertTimeToMinutes(a.time) -
        convertTimeToMinutes(b.time),
    );
  } catch {
    return [];
  }
}

function TodayCard({ onNavigate }: TodayCardProps) {
  const events = loadTodayEvents();

  return (
    <button
      className="dashboard-card-button dashboard-card-button-wide"
      onClick={() => onNavigate("calendar")}
      aria-label="Open today's calendar"
    >
      <DashboardCard title="Today" wide>
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-row" key={event.id}>
              <span>{event.time}</span>

              <div className="today-event-details">
                <strong>{event.title}</strong>

                <small
                  className={`today-event-calendar ${event.type}`}
                >
                  {event.calendar}
                </small>
              </div>
            </div>
          ))
        ) : (
          <div className="today-empty">
            <p>No events scheduled today.</p>
          </div>
        )}
      </DashboardCard>
    </button>
  );
}

export default TodayCard;