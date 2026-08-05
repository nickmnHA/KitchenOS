import { useEffect, useState } from "react";

function Home() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

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
        <article className="dashboard-card">
          <p className="card-label">Next event</p>
          <h3>Dinner with family</h3>
          <p className="card-detail">6:30 PM · Tonight</p>
        </article>

        <article className="dashboard-card">
          <p className="card-label">Weather</p>
          <h3>72°F</h3>
          <p className="card-detail">Partly cloudy</p>
        </article>

        <article className="dashboard-card">
          <p className="card-label">Chores</p>
          <h3>3 remaining</h3>
          <p className="card-detail">Trash, dishes, laundry</p>
        </article>

        <article className="dashboard-card">
          <p className="card-label">Home status</p>
          <h3>Secure</h3>
          <p className="card-detail">Doors locked · Garage closed</p>
        </article>

        <article className="dashboard-card dashboard-card-wide">
          <p className="card-label">Today</p>

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
        </article>

        <article className="dashboard-card dashboard-card-wide">
          <p className="card-label">Quick actions</p>

          <div className="quick-actions">
            <button>Kitchen lights</button>
            <button>Good night</button>
            <button>Garage</button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Home;