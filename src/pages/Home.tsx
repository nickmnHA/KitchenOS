import { useEffect, useState } from "react";

import AlertsCard from "../cards/AlertsCard";
import QuickActionsPanel from "../cards/QuickActionsPanel";
import HouseSnapshot from "../components/HouseSnapshot";

type HomeProps = {
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
  const saved = localStorage.getItem(
    "kitchenos-calendar-v2",
  );

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved) as EventsByDate;
  } catch {
    return {};
  }
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

function Home({ onNavigate }: HomeProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";

  const eventsByDate = loadCalendarEvents();

  const todayEvents = [
    ...(eventsByDate[getDateKey(now)] ?? []),
  ].sort(
    (a, b) =>
      convertTimeToMinutes(a.time) -
      convertTimeToMinutes(b.time),
  );

  return (
    <main className="main home-page">
      <HouseSnapshot
        onNavigate={onNavigate}
        greeting={greeting}
        date={date}
        todayEvents={todayEvents.map(
          (event) => event.title,
        )}
      />

      <section className="home-lower-grid">
        <AlertsCard onNavigate={onNavigate} />

        <QuickActionsPanel
          onNavigate={onNavigate}
        />
      </section>
    </main>
  );
}

export default Home;