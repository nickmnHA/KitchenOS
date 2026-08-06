import { useState } from "react";
import { useHomeAssistantEntity } from "../hooks/useHomeAssistantEntity";
import { callService } from "../services/HomeAssistantClient";
import { useSecurity } from "../security/SecurityProvider";

const FRONT_DOOR_ENTITY = "lock.front_door";

const TEMPERATURE_ENTITIES = [
  {
    id: "sensor.home_current_temperature",
    label: "Main Floor",
    icon: "🌡️",
  },
  {
    id: "sensor.master_bed_temperature",
    label: "Master Bedroom",
    icon: "🛏️",
  },
  {
    id: "sensor.noah_temperature",
    label: "Noah's Room",
    icon: "🌡️",
  },
  {
    id: "sensor.nolan_temperature",
    label: "Nolan's Room",
    icon: "🌡️",
  },
];

function formatTemperature(state: string) {
  const temperature = Number.parseFloat(state);

  return Number.isFinite(temperature)
    ? `${Math.round(temperature)}°`
    : "Unavailable";
}

type TemperatureTileProps = {
  entityId: string;
  label: string;
  icon: string;
};

function TemperatureTile({
  entityId,
  label,
  icon,
}: TemperatureTileProps) {
  const temperature = useHomeAssistantEntity(entityId, {
    refreshInterval: 10_000,
  });

  return (
    <div className="status-pill live-status-pill">
      <span className="status-pill-icon">{icon}</span>

      <span className="live-status-copy">
        <strong>{label}</strong>

        <small>
          {temperature.loading
            ? "Connecting..."
            : temperature.error
              ? "Unavailable"
              : formatTemperature(temperature.state)}
        </small>
      </span>
    </div>
  );
}

function LiveHomeStatus() {
  const { requestPin } = useSecurity();

  const [doorUpdating, setDoorUpdating] = useState(false);
  const [actionError, setActionError] = useState("");

  const frontDoor = useHomeAssistantEntity(
    FRONT_DOOR_ENTITY,
    {
      refreshInterval: 5_000,
    },
  );

  const doorLocked = frontDoor.state === "locked";
  const doorUnlocked = frontDoor.state === "unlocked";

  async function refreshDoorSoon() {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 900);
    });

    await frontDoor.refresh();
  }

  async function lockDoor() {
    if (
      doorUpdating ||
      doorLocked ||
      frontDoor.loading
    ) {
      return;
    }

    setDoorUpdating(true);
    setActionError("");

    try {
      await callService("lock", "lock", {
        entity_id: FRONT_DOOR_ENTITY,
      });

      await refreshDoorSoon();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not lock door",
      );
    } finally {
      setDoorUpdating(false);
    }
  }

  async function unlockDoor() {
    if (
      doorUpdating ||
      doorUnlocked ||
      frontDoor.loading
    ) {
      return;
    }

    const allowed = await requestPin({
      title: "Unlock Front Door",
      description:
        "Enter your security PIN to unlock the front door.",
      confirmLabel: "Unlock Door",
    });

    if (!allowed) {
      return;
    }

    setDoorUpdating(true);
    setActionError("");

    try {
      await callService("lock", "unlock", {
        entity_id: FRONT_DOOR_ENTITY,
      });

      await refreshDoorSoon();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Could not unlock door",
      );
    } finally {
      setDoorUpdating(false);
    }
  }

  let doorTitle = "Front Door";
  let doorStatus = "Connecting...";

  if (!frontDoor.loading && frontDoor.error) {
    doorStatus = "Unavailable";
  } else if (doorLocked) {
    doorTitle = "Front Door Locked";
    doorStatus = "Secure";
  } else if (doorUnlocked) {
    doorTitle = "Front Door Unlocked";
    doorStatus = "Needs attention";
  } else if (!frontDoor.loading) {
    doorStatus = frontDoor.state;
  }

  return (
    <>
      <div
        className={`status-pill live-status-pill front-door-status ${
          doorUnlocked ? "warning" : ""
        }`}
      >
        <div className="front-door-header">
          <span className="status-pill-icon front-door-icon">
            {doorLocked ? "🔒" : "🔓"}
          </span>

          <div className="front-door-heading">
  <strong>{doorTitle}</strong>

  {doorUpdating && (
    <small>Updating...</small>
  )}
</div>
          <span
            className={`front-door-badge ${
              doorLocked
                ? "secure"
                : doorUnlocked
                  ? "attention"
                  : ""
            }`}
          >
            {doorLocked
              ? "Secure"
              : doorUnlocked
                ? "Unlocked"
                : "Unknown"}
          </span>
        </div>

        <div className="door-lock-actions">
          <button
            type="button"
            onClick={() => void lockDoor()}
            disabled={
              doorUpdating ||
              doorLocked ||
              frontDoor.loading
            }
          >
            Lock
          </button>

          <button
            type="button"
            className="door-unlock-button"
            onClick={() => void unlockDoor()}
            disabled={
              doorUpdating ||
              doorUnlocked ||
              frontDoor.loading
            }
          >
            Unlock
          </button>
        </div>

        {actionError && (
          <span className="door-action-error">
            {actionError}
          </span>
        )}
      </div>

      {TEMPERATURE_ENTITIES.map(
        (temperature) => (
          <TemperatureTile
            key={temperature.id}
            entityId={temperature.id}
            label={temperature.label}
            icon={temperature.icon}
          />
        ),
      )}
    </>
  );
}

export default LiveHomeStatus;