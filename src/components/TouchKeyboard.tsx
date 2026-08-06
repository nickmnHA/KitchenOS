import { useEffect, useRef, useState } from "react";

type EditableElement = HTMLInputElement | HTMLTextAreaElement;

const LETTER_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const NUMBER_ROW = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

function isEditableElement(target: EventTarget | null): target is EditableElement {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return false;
  }

  if (target.disabled || target.readOnly || target.dataset.noTouchKeyboard === "true") {
    return false;
  }

  if (target instanceof HTMLTextAreaElement) {
    return true;
  }

  return ["text", "search", "email", "tel", "url", "number", "password"].includes(
    target.type,
  );
}

function TouchKeyboard() {
  const [visible, setVisible] = useState(false);
  const [shifted, setShifted] = useState(false);
  const activeInput = useRef<EditableElement | null>(null);

  useEffect(() => {
    function handleFocusIn(event: FocusEvent) {
      if (!isEditableElement(event.target)) {
        return;
      }

      activeInput.current = event.target;
      setShifted(false);
      setVisible(true);
    }

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  function updateValue(nextValue: string, selectionStart: number) {
    const input = activeInput.current;

    if (!input) {
      return;
    }

    const valueSetter = Object.getOwnPropertyDescriptor(
      input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype,
      "value",
    )?.set;

    valueSetter?.call(input, nextValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus({ preventScroll: true });
    input.setSelectionRange(selectionStart, selectionStart);
  }

  function insertText(text: string) {
    const input = activeInput.current;

    if (!input) {
      return;
    }

    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const nextValue = input.value.slice(0, start) + text + input.value.slice(end);

    updateValue(nextValue, start + text.length);

    if (shifted && text.length === 1 && /[a-z]/i.test(text)) {
      setShifted(false);
    }
  }

  function backspace() {
    const input = activeInput.current;

    if (!input) {
      return;
    }

    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;

    if (start !== end) {
      updateValue(input.value.slice(0, start) + input.value.slice(end), start);
      return;
    }

    if (start === 0) {
      return;
    }

    updateValue(input.value.slice(0, start - 1) + input.value.slice(end), start - 1);
  }

  function handleEnter() {
    const input = activeInput.current;

    if (!input) {
      return;
    }

    if (input instanceof HTMLTextAreaElement) {
      insertText("\n");
      return;
    }

    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(event);

    if (!event.defaultPrevented) {
      input.blur();
      setVisible(false);
    }
  }

  function closeKeyboard() {
    activeInput.current?.blur();
    activeInput.current = null;
    setVisible(false);
    setShifted(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      className="touch-keyboard"
      role="application"
      aria-label="On-screen keyboard"
      onPointerDown={(event) => event.preventDefault()}
    >
      <div className="touch-keyboard-toolbar">
        <span>Keyboard</span>
        <button type="button" onClick={closeKeyboard} aria-label="Close keyboard">
          Hide
        </button>
      </div>

      <div className="touch-keyboard-row">
        {NUMBER_ROW.map((key) => (
          <button key={key} type="button" onClick={() => insertText(key)}>
            {key}
          </button>
        ))}
      </div>

      {LETTER_ROWS.map((row, rowIndex) => (
        <div className="touch-keyboard-row" key={row.join("")}>
          {rowIndex === 2 && (
            <button
              type="button"
              className={`touch-keyboard-wide ${shifted ? "active" : ""}`}
              onClick={() => setShifted((current) => !current)}
            >
              Shift
            </button>
          )}

          {row.map((key) => (
            <button key={key} type="button" onClick={() => insertText(shifted ? key.toUpperCase() : key)}>
              {shifted ? key.toUpperCase() : key}
            </button>
          ))}

          {rowIndex === 2 && (
            <button type="button" className="touch-keyboard-wide" onClick={backspace}>
              Delete
            </button>
          )}
        </div>
      ))}

      <div className="touch-keyboard-row touch-keyboard-bottom-row">
        <button type="button" onClick={() => insertText("-")}>-</button>
        <button type="button" onClick={() => insertText("'")}>'</button>
        <button type="button" className="touch-keyboard-space" onClick={() => insertText(" ")}>
          Space
        </button>
        <button type="button" onClick={() => insertText(".")}>.</button>
        <button type="button" className="touch-keyboard-enter" onClick={handleEnter}>
          Enter
        </button>
      </div>
    </div>
  );
}

export default TouchKeyboard;
