import DashboardCard from "./DashboardCard";

function HomeStatusCard() {
  return (
    <DashboardCard title="Home Status">
      <h3>Secure</h3>
      <p className="card-detail">
        Doors locked · Garage closed
      </p>
    </DashboardCard>
  );
}

export default HomeStatusCard;