import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Chore = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
};

export type GroceryCategory =
  | "Produce"
  | "Dairy"
  | "Meat"
  | "Pantry"
  | "Frozen"
  | "Household"
  | "Other";

export type GroceryItem = {
  id: string;
  name: string;
  category: GroceryCategory;
  completed: boolean;
};

type KitchenStoreValue = {
  chores: Chore[];
  setChores: React.Dispatch<React.SetStateAction<Chore[]>>;
  groceryItems: GroceryItem[];
  setGroceryItems: React.Dispatch<
    React.SetStateAction<GroceryItem[]>
  >;
};

type KitchenStoreProviderProps = {
  children: ReactNode;
};

const KitchenStoreContext =
  createContext<KitchenStoreValue | null>(null);

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

function loadGroceryItems(): GroceryItem[] {
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

export function KitchenStoreProvider({
  children,
}: KitchenStoreProviderProps) {
  const [chores, setChores] = useState<Chore[]>(loadChores);

  const [groceryItems, setGroceryItems] =
    useState<GroceryItem[]>(loadGroceryItems);

  useEffect(() => {
    localStorage.setItem(
      "kitchenos-chores",
      JSON.stringify(chores),
    );
  }, [chores]);

  useEffect(() => {
    localStorage.setItem(
      "kitchenos-grocery",
      JSON.stringify(groceryItems),
    );
  }, [groceryItems]);

  return (
    <KitchenStoreContext.Provider
      value={{
        chores,
        setChores,
        groceryItems,
        setGroceryItems,
      }}
    >
      {children}
    </KitchenStoreContext.Provider>
  );
}

export function useKitchenStore() {
  const store = useContext(KitchenStoreContext);

  if (!store) {
    throw new Error(
      "useKitchenStore must be used inside KitchenStoreProvider",
    );
  }

  return store;
}