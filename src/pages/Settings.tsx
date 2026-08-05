import { useState } from "react";

const DEFAULT_PIN = "1234";

type PinField = "current" | "new" | "confirm";

function loadDeletePin() {
  return localStorage.getItem("kitchenos-delete-pin") ?? DEFAULT_PIN;
}

function Settings() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");

  const [activeField, setActiveField] =
    useState<PinField | null>(null);

  function getActiveValue() {
    if (activeField === "current") {
      return currentPin;
    }

    if (activeField === "new") {
      return newPin;
    }

    if (activeField === "confirm") {
      return confirmPin;
    }

    return "";
  }

  function updateActiveValue(value: string) {
    if (activeField === "current") {
      setCurrentPin(value);
    }

    if (activeField === "new") {
      setNewPin(value);
    }

    if (activeField === "confirm") {
      setConfirmPin(value);
    }
  }

  function addPinDigit(digit: string) {
    const currentValue = getActiveValue();

    if (currentValue.length >= 4) {
      return;
    }

    updateActiveValue(currentValue + digit);
    setMessage("");
  }

  function removePinDigit() {
    updateActiveValue(getActiveValue().slice(0, -1));
  }

  function clearActivePin() {
    updateActiveValue("");
  }

  function closeKeypad() {
    setActiveField(null);
  }

  function getKeypadTitle() {
    if (activeField === "current") {
      return "Enter current PIN";
    }

    if (activeField === "new") {
      return "Enter new PIN";
    }

    return "Confirm new PIN";
  }

  function savePin() {
    const savedPin = loadDeletePin();

    if (currentPin !== savedPin) {
      setMessage("Current PIN is incorrect.");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setMessage("The new PIN must contain exactly four numbers.");
      return;
    }

    if (newPin !== confirmPin) {
      setMessage("The new PIN entries do not match.");
      return;
    }

    localStorage.setItem("kitchenos-delete-pin", newPin);

    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setMessage("Delete PIN updated successfully.");
  }

  const activePin = getActiveValue();

  return (
    <main className="main">
      <div className="settings-header">
        <div>
          <p className="eyebrow">KitchenOS preferences</p>
          <h2>Settings</h2>
        </div>
      </div>

      <section className="settings-grid">
        <article className="settings-card">
          <div className="settings-card-header">
            <div>
              <p className="card-label">Security</p>
              <h3>Deletion PIN</h3>
            </div>

            <span className="settings-badge">4 digits</span>
          </div>

          <p className="settings-description">
            This PIN protects chores and other household items from
            being deleted accidentally.
          </p>

          <div className="settings-form">
            <label>
              Current PIN
              <input
                type="password"
                value={currentPin}
                readOnly
                onClick={() => setActiveField("current")}
                placeholder="Tap to enter"
              />
            </label>

            <label>
              New PIN
              <input
                type="password"
                value={newPin}
                readOnly
                onClick={() => setActiveField("new")}
                placeholder="Tap to enter"
              />
            </label>

            <label>
              Confirm new PIN
              <input
                type="password"
                value={confirmPin}
                readOnly
                onClick={() => setActiveField("confirm")}
                placeholder="Tap to enter"
              />
            </label>

            <button onClick={savePin}>Save PIN</button>

            <p className="settings-message" aria-live="polite">
              {message}
            </p>
          </div>
        </article>

        <article className="settings-card">
          <div className="settings-card-header">
            <div>
              <p className="card-label">Display</p>
              <h3>Wall Display</h3>
            </div>

            <span className="settings-badge">Coming soon</span>
          </div>

          <p className="settings-description">
            Brightness scheduling, screen sleep, theme controls, and
            kiosk settings will live here.
          </p>
        </article>

        <article className="settings-card">
          <div className="settings-card-header">
            <div>
              <p className="card-label">Connections</p>
              <h3>Integrations</h3>
            </div>

            <span className="settings-badge">Coming soon</span>
          </div>

          <p className="settings-description">
            Home Assistant, CalDAV, weather, and camera connections
            will be configured here.
          </p>
        </article>
      </section>

      {activeField && (
        <div
          className="pin-modal-backdrop"
          onClick={closeKeypad}
        >
          <section
            className="pin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pin-modal-header">
              <div>
                <p className="eyebrow">Security settings</p>
                <h3>{getKeypadTitle()}</h3>
              </div>

              <button
                className="pin-modal-close"
                onClick={closeKeypad}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div
              className="pin-dots"
              aria-label={`${activePin.length} digits entered`}
            >
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={
                    index < activePin.length ? "filled" : ""
                  }
                />
              ))}
            </div>

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
                onClick={clearActivePin}
              >
                Clear
              </button>

              <button onClick={() => addPinDigit("0")}>
                0
              </button>

              <button
                className="pin-keypad-backspace"
                onClick={removePinDigit}
                aria-label="Delete last digit"
              >
                ⌫
              </button>
            </div>

            <button
              className="pin-confirm-entry"
              onClick={closeKeypad}
              disabled={activePin.length !== 4}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Settings;