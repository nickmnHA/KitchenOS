import { useKitchenStore } from "../store/KitchenStore";

type CommandCenterCardProps = {
  onNavigate: (page: string) => void;
};

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  calendar: string;
  type: "work" | "personal" | "family";
};

type EventsByDate = Record<string, CalendarEvent[]>;

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function CommandCenterCard({
  onNavigate,
}: CommandCenterCardProps) {
  const { chores, groceryItems } = useKitchenStore();

  const todayKey = getDateKey(new Date());
  const eventsByDate = loadCalendarEvents();

  const remainingChores = chores.filter(
    (chore) => !chore.completed,
  ).length;

  const overdueChores = chores.filter(
    (chore) =>
      !chore.completed &&
      chore.dueDate &&
      chore.dueDate < todayKey,
  ).length;

  const remainingGroceries = groceryItems.filter(
    (item) => !item.completed,
  ).length;

  const todayEvents = eventsByDate[todayKey] ?? [];

  const hasWarnings = overdueChores > 0;

  return (
    <section className="command-center">
      <div className="command-center-heading">
        <div>
          <p className="eyebrow">Home overview</p>
          <h3>Command Center</h3>
        </div>

        <div
          className={`command-center-status ${
            hasWarnings ? "warning" : ""
          }`}
        >
          <span />
          {hasWarnings ? "Needs attention" : "Online"}
        </div>
      </div>

      <div className="command-center-grid">
        <button onClick={() => onNavigate("chores")}>
          <strong>🧹 Chores</strong>

          <p>
            {overdueChores > 0
              ? `${overdueChores} overdue`
              : `${remainingChores} remaining`}
          </p>
        </button>

        <button onClick={() => onNavigate("grocery")}>
          <strong>🛒 Grocery</strong>

          <p>
            {remainingGroceries}{" "}
            {remainingGroceries === 1 ? "item" : "items"} remaining
          </p>
        </button>

        <button onClick={() => onNavigate("calendar")}>
          <strong>📅 Calendar</strong>

          <p>
            {todayEvents.length}{" "}
            {todayEvents.length === 1 ? "event" : "events"} today
          </p>
        </button>

        <button disabled>
          <strong>🏠 Home Assistant</strong>
          <p>Not connected</p>
        </button>
      </div>
    </section>
  );
}

export default CommandCenterCard;