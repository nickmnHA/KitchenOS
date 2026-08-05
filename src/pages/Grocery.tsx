import { useEffect, useMemo, useState } from "react";

type GroceryCategory =
  | "Produce"
  | "Dairy"
  | "Meat"
  | "Pantry"
  | "Frozen"
  | "Household"
  | "Other";

type GroceryItem = {
  id: string;
  name: string;
  category: GroceryCategory;
  completed: boolean;
};

const categories: GroceryCategory[] = [
  "Produce",
  "Dairy",
  "Meat",
  "Pantry",
  "Frozen",
  "Household",
  "Other",
];

function loadItems(): GroceryItem[] {
  const saved = localStorage.getItem("kitchenos-grocery");

  if (!saved) {
    return [
      {
        id: crypto.randomUUID(),
        name: "Milk",
        category: "Dairy",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Eggs",
        category: "Dairy",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        name: "Bananas",
        category: "Produce",
        completed: false,
      },
    ];
  }

  try {
    return JSON.parse(saved) as GroceryItem[];
  } catch {
    return [];
  }
}

function Grocery() {
  const [items, setItems] = useState<GroceryItem[]>(loadItems);
  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<GroceryCategory>("Other");

  useEffect(() => {
    localStorage.setItem(
      "kitchenos-grocery",
      JSON.stringify(items),
    );
  }, [items]);

  const remaining = items.filter(
    (item) => !item.completed,
  ).length;

  const groupedItems = useMemo(() => {
    return categories
      .map((group) => ({
        category: group,
        items: items.filter(
          (item) => item.category === group,
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [items]);

  function addItem() {
    if (!name.trim()) {
      return;
    }

    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      completed: false,
    };

    setItems((current) => [...current, newItem]);
    setName("");
    setCategory("Other");
  }

  function toggleItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item,
      ),
    );
  }

  function deleteItem(id: string) {
    const item = items.find((entry) => entry.id === id);

    if (
      item &&
      window.confirm(`Delete "${item.name}"?`)
    ) {
      setItems((current) =>
        current.filter((entry) => entry.id !== id),
      );
    }
  }

  function clearCompleted() {
    setItems((current) =>
      current.filter((item) => !item.completed),
    );
  }

  return (
    <main className="main">
      <div className="grocery-header">
        <div>
          <p className="eyebrow">Shopping list</p>
          <h2>Grocery</h2>
        </div>

        <div className="grocery-header-actions">
          <span className="grocery-count">
            {remaining} remaining
          </span>

          <button
            className="grocery-clear-button"
            onClick={clearCompleted}
            disabled={!items.some((item) => item.completed)}
          >
            Clear completed
          </button>
        </div>
      </div>

      <section className="grocery-entry">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addItem();
            }
          }}
          placeholder="Add grocery item..."
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value as GroceryCategory,
            )
          }
        >
          {categories.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <button onClick={addItem}>Add Item</button>
      </section>

      <section className="grocery-groups">
        {groupedItems.length > 0 ? (
          groupedItems.map((group) => (
            <section
              className="grocery-group"
              key={group.category}
            >
              <h3>{group.category}</h3>

              <div className="grocery-list">
                {group.items.map((item) => (
                  <article
                    className={`grocery-item ${
                      item.completed ? "completed" : ""
                    }`}
                    key={item.id}
                  >
                    <button
                      className="grocery-check"
                      onClick={() => toggleItem(item.id)}
                      aria-label={
                        item.completed
                          ? `Mark ${item.name} incomplete`
                          : `Mark ${item.name} complete`
                      }
                    >
                      {item.completed ? "✓" : ""}
                    </button>

                    <span>{item.name}</span>

                    <button
                      className="grocery-delete"
                      onClick={() => deleteItem(item.id)}
                      aria-label={`Delete ${item.name}`}
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="grocery-empty">
            <p>Your grocery list is empty.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Grocery;