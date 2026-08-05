import { useEffect, useState } from "react";
import DashboardCard from "../cards/DashboardCard";

function Home() {
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
        <DashboardCard title="Next Event">
          <h3>Dinner with family</h3>
          <p className="card-detail">6:30 PM · Tonight</p>
        </DashboardCard>

        <DashboardCard title="Weather">
          <h3>72°F</h3>
          <p className="card-detail">Partly cloudy</p>
        </DashboardCard>

        <DashboardCard title="Chores">
          <h3>3 remaining</h3>
          <p className="card-detail">Trash, dishes, laundry</p>
        </DashboardCard>

        <DashboardCard title="Home Status">
          <h3>Secure</h3>
          <p className="card-detail">
            Doors locked · Garage closed
          </p>
        </DashboardCard>

        <DashboardCard title="Today" wide>
          <div className="event-row">
            <span>9:00 AM</span>
            <strong>Work</strong>
          </div>

          <div className="event-row">
            <span>4:30 PM</span>
            <strong>Pick up groceries</strong>
          </div>

          <div className="event-row">
            <span>6:30 PM</span>
            <strong>Dinner with family</strong>
          </div>
        </DashboardCard>

        <DashboardCard title="Quick Actions" wide>
          <div className="quick-actions">
            <button>💡 Kitchen Lights</button>
            <button>🌙 Good Night</button>
            <button>🚪 Garage</button>
          </div>
        </DashboardCard>
      </section>
    </main>
  );
}

export default Home;