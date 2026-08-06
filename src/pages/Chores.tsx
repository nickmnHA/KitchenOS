import { useMemo, useState } from "react";
import { useKitchenStore, type Chore } from "../store/KitchenStore";
import { useSecurity } from "../security/SecurityProvider";

function formatDueDate(dueDate: string) {
  if (!dueDate) return "No due date";
  return new Date(`${dueDate}T12:00:00`).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function Chores() {
  const { chores, setChores } = useKitchenStore();
  const { requestPin } = useSecurity();
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("Anyone");
  const [dueDate, setDueDate] = useState("");

  const sortedChores = useMemo(
    () => [...chores].sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }),
    [chores],
  );

  function addChore() {
    if (!title.trim()) return;
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
    setChores((current) => current.map((chore) =>
      chore.id === id ? { ...chore, completed: !chore.completed } : chore,
    ));
  }

  async function deleteChore(chore: Chore) {
    const allowed = await requestPin({
      title: "Delete chore?",
      description: `Enter your PIN to delete “${chore.title}”.`,
      confirmLabel: "Delete Chore",
    });
    if (!allowed) return;
    setChores((current) => current.filter((item) => item.id !== chore.id));
  }

  const remaining = chores.filter((chore) => !chore.completed).length;

  return (
    <main className="main">
      <div className="chores-header">
        <div><p className="eyebrow">Household tasks</p><h2>Chores</h2></div>
        <span className="chores-count">{remaining} remaining</span>
      </div>

      <section className="chore-entry">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChore()} placeholder="Add a new chore..." />
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option>Anyone</option><option>Nick</option><option>Family</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="Chore due date" />
        <button onClick={addChore}>Add Chore</button>
      </section>

      <section className="chore-list">
        {sortedChores.length ? sortedChores.map((chore) => (
          <article key={chore.id} className={`chore-item ${chore.completed ? "completed" : ""}`}>
            <button className="chore-check" onClick={() => toggleChore(chore.id)} aria-label={chore.completed ? `Mark ${chore.title} incomplete` : `Mark ${chore.title} complete`}>
              {chore.completed ? "✓" : ""}
            </button>
            <div className="chore-details">
              <h3>{chore.title}</h3>
              <p>Assigned to {chore.assignedTo} · {formatDueDate(chore.dueDate)}</p>
            </div>
            <button className="chore-delete" onClick={() => void deleteChore(chore)} aria-label={`Delete ${chore.title}`}>×</button>
          </article>
        )) : <div className="chores-empty"><p>No chores yet.</p></div>}
      </section>
    </main>
  );
}

export default Chores;
