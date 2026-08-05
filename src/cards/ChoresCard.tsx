import DashboardCard from "./DashboardCard";

type Chore = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
};

type ChoresCardProps = {
  onOpen: () => void;
};

function loadChores(): Chore[] {
  const saved = localStorage.getItem("kitchenos-chores");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as Chore[];
  } catch {
    return [];
  }
}

function ChoresCard({ onOpen }: ChoresCardProps) {
  const chores = loadChores();

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