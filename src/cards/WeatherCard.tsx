import DashboardCard from "./DashboardCard";

function WeatherCard() {
  return (
    <DashboardCard title="Weather">
      <h3>72°F</h3>
      <p className="card-detail">Partly cloudy</p>
    </DashboardCard>
  );
}

export default WeatherCard;