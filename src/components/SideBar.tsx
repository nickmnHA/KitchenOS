type SideBarProps = {
  page: string;
  setPage: (page: string) => void;
};

type IconProps = {
  className?: string;
};

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-7h6v7" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function ChoresIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function GroceryIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h3l2.6 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function CameraIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 6 13 4H8L6.5 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ProfileIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

const navigationItems = [
  {
    page: "home",
    label: "Home",
    Icon: HomeIcon,
  },
  {
    page: "calendar",
    label: "Calendar",
    Icon: CalendarIcon,
  },
  {
    page: "chores",
    label: "Chores",
    Icon: ChoresIcon,
  },
  {
    page: "grocery",
    label: "Groceries",
    Icon: GroceryIcon,
  },
  {
    page: "cameras",
    label: "Cameras",
    Icon: CameraIcon,
  },
];

function SideBar({ page, setPage }: SideBarProps) {
  return (
    <aside className="sidebar">
      <nav
        className="sidebar-navigation"
        aria-label="Main navigation"
      >
        {navigationItems.map(({ page: itemPage, label, Icon }) => (
          <button
            key={itemPage}
            type="button"
            className={`sidebar-navigation-item ${
              page === itemPage ? "active" : ""
            }`}
            onClick={() => setPage(itemPage)}
            aria-current={
              page === itemPage ? "page" : undefined
            }
          >
            <Icon className="sidebar-navigation-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        className={`sidebar-profile ${
          page === "settings" ? "active" : ""
        }`}
        onClick={() => setPage("settings")}
        aria-label="Open settings"
      >
        <span className="sidebar-avatar">
          <ProfileIcon className="sidebar-profile-icon" />
        </span>

        <span className="sidebar-profile-copy">
          <strong>Nick</strong>
          <span>Home Control Center</span>
        </span>

        <span className="sidebar-profile-arrow">›</span>
      </button>
    </aside>
  );
}

export default SideBar;