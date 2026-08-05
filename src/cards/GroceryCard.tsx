import DashboardCard from "./DashboardCard";

type GroceryItem = {
  id: string;
  name: string;
  category: string;
  completed: boolean;
};

type GroceryCardProps = {
  onOpen: () => void;
};

function loadItems(): GroceryItem[] {
  const saved = localStorage.getItem("kitchenos-grocery");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as GroceryItem[];
  } catch {
    return [];
  }
}

function GroceryCard({ onOpen }: GroceryCardProps) {
  const items = loadItems();

  const remainingItems = items.filter(
    (item) => !item.completed,
  );

  const previewItems = remainingItems.slice(0, 3);

  return (
    <button
      className="dashboard-card-button"
      onClick={onOpen}
      aria-label="Open grocery list"
    >
      <DashboardCard title="Grocery">
        <h3>
          {remainingItems.length}{" "}
          {remainingItems.length === 1 ? "item" : "items"}
        </h3>

        {previewItems.length > 0 ? (
          <div className="home-grocery-preview">
            {previewItems.map((item) => (
              <p key={item.id}>
                <span>○</span>
                {item.name}
              </p>
            ))}
          </div>
        ) : (
          <p className="card-detail">
            Your grocery list is empty.
          </p>
        )}
      </DashboardCard>
    </button>
  );
}

export default GroceryCard;