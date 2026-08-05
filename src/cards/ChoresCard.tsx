import DashboardCard from "./DashboardCard";

function ChoresCard() {
  return (
    <DashboardCard title="Chores">
      <h3>3 remaining</h3>
      <p className="card-detail">
        Trash, dishes, laundry
      </p>
    </DashboardCard>
  );
}

export default ChoresCard;