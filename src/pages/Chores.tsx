import { useMemo, useState } from "react";
import {
  useKitchenStore,
  type Chore,
} from "../store/KitchenStore";

type Chore = {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
};

function loadDeletePin() {
  return localStorage.getItem("kitchenos-delete-pin") ?? "1234";
}
function loadChores(): Chore[] {
  const saved = localStorage.getItem("kitchenos-chores");

  if (!saved) {
    return [
      {
        id: crypto.randomUUID(),
        title: "Take out the trash",
        assignedTo: "Nick",
        dueDate: "",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        title: "Empty the dishwasher",
        assignedTo: "Anyone",
        dueDate: "",
        completed: false,
      },
    ];
  }

  try {
    const parsed = JSON.parse(saved) as Partial<Chore>[];

    return parsed.map((chore) => ({
      id: chore.id ?? crypto.randomUUID(),
      title: chore.title ?? "Untitled chore",
      assignedTo: chore.assignedTo ?? "Anyone",
      dueDate: chore.dueDate ?? "",
      completed: chore.completed ?? false,
    }));
  } catch {
    return [];
  }
}

function formatDueDate(dueDate: string) {
  if (!dueDate) {
    return "No due date";
  }

  return new Date(`${dueDate}T12:00:00`).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function Chores() {
const { chores, setChores } = useKitchenStore();
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("Anyone");
  const [dueDate, setDueDate] = useState("");

  const [pendingDeleteId, setPendingDeleteId] =
    useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  
  const sortedChores = useMemo(
    () =>
      [...chores].sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }

        if (!a.dueDate && !b.dueDate) {
          return 0;
        }

        if (!a.dueDate) {
          return 1;
        }

        if (!b.dueDate) {
          return -1;
        }

        return a.dueDate.localeCompare(b.dueDate);
      }),
    [chores],
  );

  const pendingDeleteChore = chores.find(
    (chore) => chore.id === pendingDeleteId,
  );

  function addChore() {
    if (!title.trim()) {
      return;
    }

    const newChore: Chore = {
      id: crypto.randomUUID(),
      title: title.trim(),
      assignedTo,
      dueDate,
      completed: false,
    };

    setChores((current) => [...current, newChore]);
    setTitle("");
    setAssignedTo("Anyone");
    setDueDate("");
  }

  function toggleChore(id: string) {
    setChores((current) =>
      current.map((chore) =>
        chore.id === id
          ? { ...chore, completed: !chore.completed }
          : chore,
      ),
    );
  }

  function openDeleteModal(id: string) {
    setPendingDeleteId(id);
    setEnteredPin("");
    setPinError("");
  }

  function closeDeleteModal() {
    setPendingDeleteId(null);
    setEnteredPin("");
    setPinError("");
  }

  function addPinDigit(digit: string) {
    if (enteredPin.length >= 4) {
      return;
    }

    setEnteredPin((current) => current + digit);
    setPinError("");
  }

  function removePinDigit() {
    setEnteredPin((current) => current.slice(0, -1));
    setPinError("");
  }

  function confirmDelete() {
    if (!pendingDeleteId) {
      return;
    }

if (enteredPin !== loadDeletePin()) {      setPinError("Incorrect passcode");
      setEnteredPin("");
      return;
    }

    setChores((current) =>
      current.filter((chore) => chore.id !== pendingDeleteId),
    );

    closeDeleteModal();
  }

  const remaining = chores.filter(
    (chore) => !chore.completed,
  ).length;

  return (
    <main className="main">
      <div className="chores-header">
        <div>
          <p className="eyebrow">Household tasks</p>
          <h2>Chores</h2>
        </div>

        <span className="chores-count">
          {remaining} remaining
        </span>
      </div>

      <section className="chore-entry">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addChore();
            }
          }}
          placeholder="Add a new chore..."
        />

        <select
          value={assignedTo}
          onChange={(event) =>
            setAssignedTo(event.target.value)
          }
        >
          <option>Anyone</option>
          <option>Nick</option>
          <option>Family</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(event) =>
            setDueDate(event.target.value)
          }
          aria-label="Chore due date"
        />

        <button onClick={addChore}>Add Chore</button>
      </section>

      <section className="chore-list">
        {sortedChores.length > 0 ? (
          sortedChores.map((chore) => (
            <article
              key={chore.id}
              className={`chore-item ${
                chore.completed ? "completed" : ""
              }`}
            >
              <button
                className="chore-check"
                onClick={() => toggleChore(chore.id)}
                aria-label={
                  chore.completed
                    ? `Mark ${chore.title} incomplete`
                    : `Mark ${chore.title} complete`
                }
              >
                {chore.completed ? "✓" : ""}
              </button>

              <div className="chore-details">
                <h3>{chore.title}</h3>

                <p>
                  Assigned to {chore.assignedTo}
                  {" · "}
                  {formatDueDate(chore.dueDate)}
                </p>
              </div>

              <button
                className="chore-delete"
                onClick={() => openDeleteModal(chore.id)}
                aria-label={`Delete ${chore.title}`}
              >
                ×
              </button>
            </article>
          ))
        ) : (
          <div className="chores-empty">
            <p>No chores yet.</p>
          </div>
        )}
      </section>

      {pendingDeleteId && (
        <div
          className="pin-modal-backdrop"
          onClick={closeDeleteModal}
        >
          <section
            className="pin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pin-modal-header">
              <div>
                <p className="eyebrow">Protected action</p>
                <h3>Delete chore?</h3>
              </div>

              <button
                className="pin-modal-close"
                onClick={closeDeleteModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="pin-modal-description">
              Enter the passcode to delete{" "}
              <strong>
                {pendingDeleteChore?.title ?? "this chore"}
              </strong>
              .
            </p>

            <div
              className="pin-dots"
              aria-label={`${enteredPin.length} digits entered`}
            >
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={
                    index < enteredPin.length ? "filled" : ""
                  }
                />
              ))}
            </div>

            <p className="pin-error" aria-live="polite">
              {pinError}
            </p>

            <div className="pin-keypad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                (digit) => (
                  <button
                    key={digit}
                    onClick={() => addPinDigit(digit)}
                  >
                    {digit}
                  </button>
                ),
              )}

              <button
                className="pin-keypad-clear"
                onClick={() => setEnteredPin("")}
              >
                Clear
              </button>

              <button onClick={() => addPinDigit("0")}>0</button>

              <button
                className="pin-keypad-backspace"
                onClick={removePinDigit}
                aria-label="Delete last digit"
              >
                ⌫
              </button>
            </div>

            <button
              className="pin-confirm-delete"
              onClick={confirmDelete}
              disabled={enteredPin.length !== 4}
            >
              Delete Chore
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Chores;