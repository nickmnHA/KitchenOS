import { useState } from "react";
import { useKitchenStore } from "../store/KitchenStore";

type Notification = {
  id: string;
  title: string;
  message: string;
  level: "info" | "warning" | "danger";
  page: "calendar" | "chores" | "grocery";
};

type NotificationBellProps = {
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

function NotificationBell({
  onNavigate,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const { chores, groceryItems } = useKitchenStore();

  const todayKey = getDateKey(new Date());
  const calendarEvents = loadCalendarEvents();
  const todayEvents = calendarEvents[todayKey] ?? [];

  const overdueChores = chores.filter(
    (chore) =>
      !chore.completed &&
      chore.dueDate &&
      chore.dueDate < todayKey,
  );

  const choresDueToday = chores.filter(
    (chore) =>
      !chore.completed &&
      chore.dueDate === todayKey,
  );

  const remainingGroceries = groceryItems.filter(
    (item) => !item.completed,
  );

  const notifications: Notification[] = [];

  if (overdueChores.length > 0) {
    notifications.push({
      id: "overdue-chores",
      title: "Overdue chores",
      message: `${overdueChores.length} ${
        overdueChores.length === 1 ? "chore is" : "chores are"
      } overdue.`,
      level: "danger",
      page: "chores",
    });
  }

  if (choresDueToday.length > 0) {
    notifications.push({
      id: "chores-due-today",
      title: "Chores due today",
      message: `${choresDueToday.length} ${
        choresDueToday.length === 1 ? "chore is" : "chores are"
      } due today.`,
      level: "warning",
      page: "chores",
    });
  }

  if (todayEvents.length > 0) {
    notifications.push({
      id: "today-events",
      title: "Today's schedule",
      message: `${todayEvents.length} ${
        todayEvents.length === 1 ? "event is" : "events are"
      } scheduled today.`,
      level: "info",
      page: "calendar",
    });
  }

  if (remainingGroceries.length > 0) {
    notifications.push({
      id: "grocery-items",
      title: "Grocery list",
      message: `${remainingGroceries.length} ${
        remainingGroceries.length === 1
          ? "item remains"
          : "items remain"
      } on the list.`,
      level: "info",
      page: "grocery",
    });
  }

  return (
    <div className="notification-wrapper">
      <button
        className="notification-button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Open notifications"
      >
        🔔

        {notifications.length > 0 && (
          <span className="notification-count">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <h3>Notifications</h3>

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <button
                key={notification.id}
                className={`notification-item ${notification.level}`}
                onClick={() => {
                  onNavigate(notification.page);
                  setOpen(false);
                }}
              >
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </div>

                <span className="notification-arrow">›</span>
              </button>
            ))
          ) : (
            <div className="notification-empty">
              <p>No notifications right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;