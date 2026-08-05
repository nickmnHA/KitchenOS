import DashboardCard from "./DashboardCard";
import { useKitchenStore } from "../store/KitchenStore";

type GroceryCardProps = {
  onOpen: () => void;
};

function GroceryCard({ onOpen }: GroceryCardProps) {
  const { groceryItems } = useKitchenStore();

  const remainingItems = groceryItems.filter(
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
        <h3>{remainingItems.length} items</h3>

        {previewItems.length > 0 ? (
          <div className="home-grocery-preview">
            {previewItems.map((item) => (
              <p key={item.id}>
                <span>🛒</span>
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