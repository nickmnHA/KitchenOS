type QuickActionsPanelProps = {
  onNavigate: (page: string) => void;
};

const actions = [
  {
    id: "doors",
    icon: "🔒",
    label: "Lock All Doors",
  },
  {
    id: "lights",
    icon: "💡",
    label: "Turn Off All Lights",
  },
  {
    id: "garage",
    icon: "🚪",
    label: "Close Garage",
  },
  {
    id: "security",
    icon: "🛡️",
    label: "Arm Security",
  },
  {
    id: "cameras",
    icon: "📷",
    label: "Check Cameras",
  },
  {
    id: "water",
    icon: "💧",
    label: "Run Water Check",
  },
];

function QuickActionsPanel({
  onNavigate,
}: QuickActionsPanelProps) {
  function handleAction(actionId: string) {
    /*
      These buttons are placeholders for Home Assistant.

      Later, replace this function with calls to your
      Home Assistant service endpoints.
    */

    if (actionId === "cameras") {
      onNavigate("cameras");
    }
  }

  return (
    <section className="home-quick-actions">
      <span className="home-panel-label">
        Quick Actions
      </span>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="quick-action-tile"
            onClick={() => handleAction(action.id)}
          >
            <span className="quick-action-icon">
              {action.icon}
            </span>

            <span>{action.label}</span>
          </button>
        ))}
      </div>

      <p className="quick-actions-note">
        Home Assistant controls will connect here.
      </p>
    </section>
  );
}

export default QuickActionsPanel;