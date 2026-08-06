import { useState } from "react";

import { useHomeAssistantEntity } from
  "../hooks/useHomeAssistantEntity";

import {
  callService,
  toggleEntity,
} from "../services/HomeAssistantClient";

type HaQuickActionsPanelProps = {
  onNavigate: (page: string) => void;
};

const GARAGE_LIGHTS_ENTITY =
  "switch.garage_lights";

const FRONT_DOOR_ENTITY =
  "lock.front_door";

function HaQuickActionsPanel({
  onNavigate,
}: HaQuickActionsPanelProps) {
  const garageLights = useHomeAssistantEntity(
    GARAGE_LIGHTS_ENTITY,
    {
      refreshInterval: 10_000,
    },
  );

  const frontDoor = useHomeAssistantEntity(
    FRONT_DOOR_ENTITY,
    {
      refreshInterval: 5_000,
    },
  );

  const [garageUpdating, setGarageUpdating] =
    useState(false);

  const [doorUpdating, setDoorUpdating] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const garageLightsOn =
    garageLights.state === "on";

  const frontDoorLocked =
    frontDoor.state === "locked";

  async function handleGarageLights() {
    if (
      garageUpdating ||
      garageLights.loading ||
      garageLights.state === "unavailable"
    ) {
      return;
    }

    setGarageUpdating(true);
    setActionError("");

    try {
      await toggleEntity(GARAGE_LIGHTS_ENTITY);

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 600);
      });

      await garageLights.refresh();
    } catch (error) {
      console.error(error);

      setActionError(
        error instanceof Error
          ? error.message
          : "Garage lights could not be changed",
      );
    } finally {
      setGarageUpdating(false);
    }
  }

  async function handleLockFrontDoor() {
    if (
      doorUpdating ||
      frontDoor.loading ||
      frontDoorLocked ||
      frontDoor.state === "unavailable"
    ) {
      return;
    }

    setDoorUpdating(true);
    setActionError("");

    try {
      await callService("lock", "lock", {
        entity_id: FRONT_DOOR_ENTITY,
      });

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 900);
      });

      await frontDoor.refresh();
    } catch (error) {
      console.error(error);

      setActionError(
        error instanceof Error
          ? error.message
          : "Front door could not be locked",
      );
    } finally {
      setDoorUpdating(false);
    }
  }

  let garageLabel = "Garage Lights Unavailable";

  if (garageLights.loading) {
    garageLabel = "Connecting...";
  } else if (garageUpdating) {
    garageLabel = "Updating...";
  } else if (garageLightsOn) {
    garageLabel = "Turn Off Garage Lights";
  } else if (garageLights.state === "off") {
    garageLabel = "Turn On Garage Lights";
  }

  let doorLabel = "Front Door Unavailable";

  if (frontDoor.loading) {
    doorLabel = "Checking Front Door...";
  } else if (doorUpdating) {
    doorLabel = "Locking Front Door...";
  } else if (frontDoorLocked) {
    doorLabel = "Front Door Locked";
  } else if (frontDoor.state === "unlocked") {
    doorLabel = "Lock Front Door";
  }

  return (
    <section className="home-quick-actions">
      <span className="home-panel-label">
        Home Assistant Actions
      </span>

      <div className="quick-actions-grid">
        <button
          type="button"
          className={`quick-action-tile ${
            frontDoorLocked
              ? "quick-action-secure"
              : "quick-action-warning"
          }`}
          onClick={handleLockFrontDoor}
          disabled={
            doorUpdating ||
            frontDoor.loading ||
            frontDoorLocked ||
            frontDoor.state === "unavailable"
          }
        >
          <span className="quick-action-icon">
            {frontDoorLocked ? "🔒" : "🔓"}
          </span>

          <span>{doorLabel}</span>

          <small>
            {frontDoor.loading
              ? "Connecting..."
              : frontDoorLocked
                ? "Secure"
                : frontDoor.state === "unlocked"
                  ? "Currently unlocked"
                  : "Unavailable"}
          </small>
        </button>

        <button
          type="button"
          className={`quick-action-tile ${
            garageLightsOn
              ? "quick-action-active"
              : ""
          }`}
          onClick={handleGarageLights}
          disabled={
            garageUpdating ||
            garageLights.loading ||
            garageLights.state === "unavailable"
          }
        >
          <span className="quick-action-icon">
            💡
          </span>

          <span>{garageLabel}</span>

          <small>
            {garageLights.loading
              ? "Connecting..."
              : garageLightsOn
                ? "Currently on"
                : garageLights.state === "off"
                  ? "Currently off"
                  : "Unavailable"}
          </small>
        </button>

        <button
          type="button"
          className="quick-action-tile"
          disabled
        >
          <span className="quick-action-icon">
            🚪
          </span>

          <span>Close Garage</span>
          <small>Waiting for garage entity</small>
        </button>

        <button
          type="button"
          className="quick-action-tile"
          disabled
        >
          <span className="quick-action-icon">
            🛡️
          </span>

          <span>Arm Security</span>
          <small>Waiting for alarm entity</small>
        </button>

        <button
          type="button"
          className="quick-action-tile"
          onClick={() => onNavigate("cameras")}
        >
          <span className="quick-action-icon">
            📷
          </span>

          <span>Check Cameras</span>
          <small>Open camera page</small>
        </button>

        <button
          type="button"
          className="quick-action-tile"
          disabled
        >
          <span className="quick-action-icon">
            💧
          </span>

          <span>Run Water Check</span>
          <small>Waiting for leak sensors</small>
        </button>
      </div>

      {(garageLights.error ||
        frontDoor.error ||
        actionError) && (
        <p className="quick-actions-error">
          {actionError ||
            frontDoor.error ||
            garageLights.error}
        </p>
      )}
    </section>
  );
}

export default HaQuickActionsPanel;