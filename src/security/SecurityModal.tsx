import { useEffect, useState } from "react";

type SecurityModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function SecurityModal({
  title,
  description,
  confirmLabel,
  onCancel,
  onSuccess,
}: SecurityModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key) && pin.length < 4) {
        setPin((current) => current + event.key);
        setError("");
      } else if (event.key === "Backspace") {
        setPin((current) => current.slice(0, -1));
      } else if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel, pin.length]);

  function addDigit(digit: string) {
    if (pin.length < 4) {
      setPin((current) => current + digit);
      setError("");
    }
  }

  async function verify() {
    if (pin.length !== 4 || checking) return;
    setChecking(true);
    setError("");
    try {
      const response = await fetch("/security/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!response.ok) {
        setError("Incorrect PIN");
        setPin("");
        return;
      }
      onSuccess();
    } catch {
      setError("Security check unavailable");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="security-overlay" role="dialog" aria-modal="true">
      <section className="security-modal">
        <button className="security-close" onClick={onCancel} aria-label="Close">×</button>
        <p className="eyebrow">Protected action</p>
        <h3>{title}</h3>
        <p className="security-description">{description}</p>

        <div className="security-dots" aria-label={`${pin.length} digits entered`}>
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={index < pin.length ? "filled" : ""} />
          ))}
        </div>

        <p className="security-error" aria-live="polite">{error}</p>

        <div className="security-keypad">
          {["1","2","3","4","5","6","7","8","9"].map((digit) => (
            <button key={digit} onClick={() => addDigit(digit)}>{digit}</button>
          ))}
          <button onClick={() => setPin("")}>Clear</button>
          <button onClick={() => addDigit("0")}>0</button>
          <button onClick={() => setPin((current) => current.slice(0, -1))}>⌫</button>
        </div>

        <button className="security-confirm" disabled={pin.length !== 4 || checking} onClick={verify}>
          {checking ? "Checking..." : confirmLabel}
        </button>
      </section>
    </div>
  );
}
