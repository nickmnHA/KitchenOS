type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  calendar: string;
  type: "work" | "personal" | "family";
};

type AgendaPanelProps = {
  selectedDateTitle: string;
  selectedEvents: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
};

function AgendaPanel({
  selectedDateTitle,
  selectedEvents,
  onEditEvent,
  onDeleteEvent,
}: AgendaPanelProps) {
  return (
    <div className="agenda-panel">
      <div className="agenda-header">
        <div>
          <p className="eyebrow">Selected day</p>
          <h3>{selectedDateTitle}</h3>
        </div>

        <span>
          {selectedEvents.length}{" "}
          {selectedEvents.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="agenda-list">
        {selectedEvents.length > 0 ? (
          selectedEvents.map((event) => (
            <article
              className={`agenda-event ${event.type}`}
              key={event.id}
            >
              <span className="agenda-time">{event.time}</span>

              <div className="agenda-event-details">
                <h4>{event.title}</h4>
                <p>{event.calendar}</p>
              </div>

              <div className="agenda-event-actions">
                <button
                  className="event-edit-button"
                  onClick={() => onEditEvent(event)}
                  aria-label={`Edit ${event.title}`}
                >
                  ✎
                </button>

                <button
  className="event-delete-button"
  onClick={() => {
    const confirmed = window.confirm(
      `Delete "${event.title}"?`,
    );

    if (confirmed) {
      onDeleteEvent(event.id);
    }
  }}
  aria-label={`Delete ${event.title}`}
>
  ×
</button>
              </div>
            </article>
          ))
        ) : (
          <div className="agenda-empty">
            <p>No events scheduled.</p>
          </div>
        )}
      </div>

      <div className="calendar-legend">
        <span><i className="event-dot work" /> Work</span>
        <span><i className="event-dot personal" /> Personal</span>
        <span><i className="event-dot family" /> Family</span>
      </div>
    </div>
  );
}

export default AgendaPanel;