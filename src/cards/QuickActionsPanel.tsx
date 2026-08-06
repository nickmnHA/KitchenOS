import { useEffect, useState } from "react";

type QuickActionsPanelProps = {
  onNavigate: (page: string) => void;
};

type GarageLightState =
  | "connecting"
  | "on"
  | "off"
  | "unavailable";

function QuickActionsPanel({
  onNavigate,
}: QuickActionsPanelProps) {
  const [garageLights, setGarageLights] =
    useState<GarageLightState>("connecting");

  const [updating, setUpdating] = useState(false);

  async function loadGarageLights() {
    try {
      const response = await fetch(
        "/ha-api/states/switch.garage_lights",
      );

      if (!response.ok) {
        throw new Error(
          `Home Assistant error: ${response.status}`,
        );
      }

      const data = (await response.json()) as {
        state: string;
      };

      setGarageLights(
        data.state === "on"
          ? "on"
          : data.state === "off"
            ? "off"
            : "unavailable",
      );
    } catch (error) {
      console.error(error);
      setGarageLights("unavailable");
    }
  }

  useEffect(() => {
    void loadGarageLights();

    const timer = window.setInterval(() => {
      void loadGarageLights();
    }, 10000);

    return () => window.clearInterval(timer);
  }, []);

  async function toggleGarageLights() {
    if (
      updating ||
      garageLights === "connecting" ||
      garageLights === "unavailable"
    ) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        "/ha-api/services/switch/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entity_id: "switch.garage_lights",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Home Assistant error: ${response.status}`,
        );
      }

      window.setTimeout(() => {
        void loadGarageLights();
      }, 600);
    } catch (error) {
      console.error(error);
      setGarageLights("unavailable");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <section className="home-quick-actions">
      <span className="home-panel-label">
        Quick Actions
      </span>

      <div className="quick-actions-grid">
        <button
          type="button"
          className={`quick-action-tile ${
            garageLights === "on"
              ? "quick-action-active"
              : ""
          }`}
          onClick={toggleGarageLights}
          disabled={
            updating ||
            garageLights === "connecting" ||
            garageLights === "unavailable"
          }
        >
          <span className="quick-action-icon">💡</span>

          <span>
            {updating
              ? "Updating..."
              : garageLights === "on"
                ? "Turn Off Garage Lights"
                : garageLights === "off"
                  ? "Turn On Garage Lights"
                  : garageLights === "connecting"
                    ? "Connecting..."
                    : "Garage Lights Unavailable"}
          </span>

          <small>
            {garageLights === "on"
              ? "Currently on"
              : garageLights === "off"
                ? "Currently off"
                : garageLights === "connecting"
                  ? "Checking Home Assistant"
                  : "Connection failed"}
          </small>
        </button>

        <button
          type="button"
          className="quick-action-tile"
          onClick={() => onNavigate("cameras")}
        >
          <span className="quick-action-icon">📷</span>
          <span>Check Cameras</span>
          <small>Open cameras</small>
        </button>
      </div>
    </section>
  );
}

export default QuickActionsPanel;