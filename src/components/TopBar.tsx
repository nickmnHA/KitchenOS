import { useEffect, useState } from "react";

function TopBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="topbar">
      <h1>KitchenOS</h1>

      <div className="topbar-clock">
        <strong>{time}</strong>
        <span>{date}</span>
      </div>
    </header>
  );
}

export default TopBar;