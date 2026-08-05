import QuickActionsCard from "../cards/QuickActionsCard";
import TodayCard from "../cards/TodayCard";
import HomeStatusCard from "../cards/HomeStatusCard";
import ChoresCard from "../cards/ChoresCard";
import NextEventCard from "../cards/NextEventCard";
import WeatherCard from "../cards/WeatherCard";
import { useEffect, useState } from "react";
import GroceryCard from "../cards/GroceryCard";

type HomeProps = {
  onNavigate: (page: string) => void;
};

function Home({ onNavigate }: HomeProps) {  const [now, setNow] = useState(new Date());

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

  const hour = now.getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  }

  return (
    <main className="main">
      <div className="home-header">
        <div>
          <p className="eyebrow">{date}</p>
          <h2>{greeting}, Nick</h2>
        </div>

        <div className="home-status">
          <span className="status-dot" />
          All systems normal
        </div>
      </div>

      <section className="dashboard-grid">
<NextEventCard onNavigate={onNavigate} />
  <WeatherCard />
  <ChoresCard onOpen={() => onNavigate("chores")} />
  <GroceryCard onOpen={() => onNavigate("grocery")} />
  <HomeStatusCard />
  <TodayCard onNavigate={onNavigate} />
  <QuickActionsCard onNavigate={onNavigate} />
</section>
    </main>
  );
}

export default Home;