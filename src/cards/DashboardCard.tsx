import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  children: ReactNode;
  wide?: boolean;
};

function DashboardCard({
  title,
  children,
  wide = false,
}: DashboardCardProps) {
  const className = wide
    ? "dashboard-card dashboard-card-wide"
    : "dashboard-card";

  return (
    <article className={className}>
      <p className="card-label">{title}</p>
      {children}
    </article>
  );
}

export { DashboardCard };
export default DashboardCard;