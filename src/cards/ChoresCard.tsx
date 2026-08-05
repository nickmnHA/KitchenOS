import DashboardCard from "./DashboardCard";
import { useKitchenStore } from "../store/KitchenStore";

type ChoresCardProps = {
  onOpen: () => void;
};

function ChoresCard({ onOpen }: ChoresCardProps) {
  const { chores } = useKitchenStore();

  const remainingChores = chores.filter(
    (chore) => !chore.completed,
  );

  const previewChores = remainingChores.slice(0, 3);

  return (
    <button
      className="dashboard-card-button"
      onClick={onOpen}
      aria-label="Open chores"
    >
      <DashboardCard title="Chores">
        <h3>{remainingChores.length} remaining</h3>

        {previewChores.length > 0 ? (
          <div className="home-chore-preview">
            {previewChores.map((chore) => (
              <p key={chore.id}>
                <span>○</span>
                {chore.title}
              </p>
            ))}
          </div>
        ) : (
          <p className="card-detail">
            Everything is complete.
          </p>
        )}
      </DashboardCard>
    </button>
  );
}

export default ChoresCard;