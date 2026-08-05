type QuickActionsCardProps = {
  onNavigate: (page: string) => void;
};

function QuickActionsCard({
  onNavigate,
}: QuickActionsCardProps) {
  return (
    <article className="dashboard-card dashboard-card-wide">
      <p className="card-label">Quick Actions</p>

      <div className="quick-actions">
        <button onClick={() => onNavigate("calendar")}>
          📅 Open Calendar
        </button>

        <button onClick={() => onNavigate("chores")}>
          ✅ View Chores
        </button>

        <button onClick={() => onNavigate("grocery")}>
          🛒 Open Grocery List
        </button>
      </div>
    </article>
  );
}

export default QuickActionsCard;