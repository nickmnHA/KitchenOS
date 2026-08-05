type CalendarType = "work" | "personal" | "family";

type EventModalProps = {
  isOpen: boolean;
  isEditing: boolean;
  selectedDateTitle: string;
  eventTitle: string;
  eventTime: string;
  eventType: CalendarType;
  onTitleChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onTypeChange: (value: CalendarType) => void;
  onSave: () => void;
  onClose: () => void;
};

function EventModal({
  isOpen,
  isEditing,
  selectedDateTitle,
  eventTitle,
  eventTime,
  eventType,
  onTitleChange,
  onTimeChange,
  onTypeChange,
  onSave,
  onClose,
}: EventModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="event-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="event-modal-header">
          <div>
            <p className="eyebrow">
              {isEditing ? "Edit event" : "New event"}
            </p>

            <h3>{selectedDateTitle}</h3>
          </div>

          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <label>
          Event title
          <input
            type="text"
            value={eventTitle}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Dinner, appointment, practice..."
          />
        </label>

        <label>
          Time
          <input
            type="time"
            value={eventTime}
            onChange={(event) => onTimeChange(event.target.value)}
          />
        </label>

        <label>
          Calendar
          <select
            value={eventType}
            onChange={(event) =>
              onTypeChange(event.target.value as CalendarType)
            }
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="family">Family</option>
          </select>
        </label>

        <button className="event-save-button" onClick={onSave}>
          {isEditing ? "Save Changes" : "Save Event"}
        </button>
      </section>
    </div>
  );
}

export default EventModal;