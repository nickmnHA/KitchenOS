type SideBarProps = {
  page: string;
  setPage: (page: string) => void;
};

function SideBar({ page, setPage }: SideBarProps) {
  return (
    <nav className="sidebar">
      <button
        className={page === "home" ? "active" : ""}
        onClick={() => setPage("home")}
      >
        🏠 Home
      </button>

      <button
  className={page === "calendar" ? "active" : ""}
  onClick={() => setPage("calendar")}
>
  📅 Calendar
</button>

      <button
        className={page === "chores" ? "active" : ""}
        onClick={() => setPage("chores")}
      >
        ✅ Chores
      </button>

      <button
        className={page === "grocery" ? "active" : ""}
        onClick={() => setPage("grocery")}
      >
        🛒 Grocery
      </button>

      <button
        className={page === "cameras" ? "active" : ""}
        onClick={() => setPage("cameras")}
      >
        📷 Cameras
      </button>

      <button
        className={page === "settings" ? "active" : ""}
        onClick={() => setPage("settings")}
      >
        ⚙️ Settings
      </button>
    </nav>
  );
}

export default SideBar;