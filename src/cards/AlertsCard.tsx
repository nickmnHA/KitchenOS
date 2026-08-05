import DashboardCard from "./DashboardCard";

type Chore = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
};

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  calendar: string;
  type: "work" | "personal" | "family";
};

type EventsByDate = Record<string, CalendarEvent[]>;

type AlertItem = {
  id: string;
  text: string;
  level: "info" | "warning" | "danger";
  page: "calendar" | "chores" | "grocery";
};

type AlertsCardProps = {
  onNavigate: (page: string) => void;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadChores(): Chore[] {
  const saved = localStorage.getItem("kitchenos-chores");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as Chore[];
  } catch {
    return [];
  }
}

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

function loadGroceryCount() {
  const saved = localStorage.getItem("kitchenos-grocery");

  if (!saved) {
    return 0;
  }

  try {
    const items = JSON.parse(saved) as {
      completed: boolean;
    }[];

    return items.filter((item) => !item.completed).length;
  } catch {
    return 0;
  }
}

function AlertsCard({ onNavigate }: AlertsCardProps) {
  const todayKey = getDateKey(new Date());

  const chores = loadChores();
  const eventsByDate = loadCalendarEvents();
  const groceryCount = loadGroceryCount();

  const alerts: AlertItem[] = [];

  const overdueChores = chores.filter(
    (chore) =>
      !chore.completed &&
      Boolean(chore.dueDate) &&
      chore.dueDate < todayKey,
  );

  const choresDueToday = chores.filter(
    (chore) =>
      !chore.completed &&
      chore.dueDate === todayKey,
  );

  const todayEvents = eventsByDate[todayKey] ?? [];

  if (overdueChores.length > 0) {
    alerts.push({
      id: "overdue-chores",
      text: `${overdueChores.length} overdue ${
        overdueChores.length === 1 ? "chore" : "chores"
      }`,
      level: "danger",
      page: "chores",
    });
  }

  if (choresDueToday.length > 0) {
    alerts.push({
      id: "today-chores",
      text: `${choresDueToday.length} ${
        choresDueToday.length === 1
          ? "chore is"
          : "chores are"
      } due today`,
      level: "warning",
      page: "chores",
    });
  }

  if (todayEvents.length > 0) {
    alerts.push({
      id: "today-events",
      text: `${todayEvents.length} ${
        todayEvents.length === 1 ? "event" : "events"
      } scheduled today`,
      level: "info",
      page: "calendar",
    });
  }

  if (groceryCount > 0) {
    alerts.push({
      id: "grocery-items",
      text: `${groceryCount} grocery ${
        groceryCount === 1 ? "item" : "items"
      } remaining`,
      level: "info",
      page: "grocery",
    });
  }

  return (
    <DashboardCard title="Alerts">
      {alerts.length > 0 ? (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <button
              key={alert.id}
              type="button"
              className={`alert-item ${alert.level}`}
              onClick={() => onNavigate(alert.page)}
            >
              <span className="alert-dot" />

              <p>{alert.text}</p>

              <span
                className="alert-arrow"
                aria-hidden="true"
              >
                ›
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="alerts-empty">
          <p>No alerts right now.</p>
        </div>
      )}
    </DashboardCard>
  );
}

export default AlertsCard;