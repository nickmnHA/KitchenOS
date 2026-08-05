import { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";

type TopBarProps = {
  onNavigate: (page: string) => void;
};

function TopBar({ onNavigate }: TopBarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const displayHour = hours % 12 || 12;

  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <h1>KitchenOS</h1>

      <div className="topbar-right">
        <NotificationBell onNavigate={onNavigate} />

        <div className="topbar-clock">
          <strong className="live-clock">
            <span>{displayHour}</span>
            <span className="clock-colon">:</span>
            <span>{minutes}</span>
            <span className="clock-period">{period}</span>
          </strong>

          <span>{date}</span>
        </div>
      </div>
    </header>
  );
}

export default TopBar;