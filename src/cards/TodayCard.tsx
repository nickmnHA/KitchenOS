import DashboardCard from "./DashboardCard";

function TodayCard() {
  return (
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
  );
}

export default TodayCard;