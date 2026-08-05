type CalendarHeaderProps = {
  onAddEvent: () => void;
  onToday: () => void;
};

function CalendarHeader({
  onAddEvent,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <div>
        <p className="eyebrow">Schedule</p>
        <h2>Calendar</h2>
      </div>

      <div className="calendar-header-actions">
        <button
          className="calendar-today-button"
          onClick={onToday}
        >
          Today
        </button>

        <button
          className="calendar-add-button"
          onClick={onAddEvent}
        >
          + Add Event
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;