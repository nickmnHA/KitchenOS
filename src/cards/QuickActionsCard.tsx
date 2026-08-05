import DashboardCard from "./DashboardCard";

function QuickActionsCard() {
  return (
    <DashboardCard title="Quick Actions" wide>
      <div className="quick-actions">
        <button>💡 Kitchen Lights</button>
        <button>🌙 Good Night</button>
        <button>🚪 Garage</button>
      </div>
    </DashboardCard>
  );
}

export default QuickActionsCard;