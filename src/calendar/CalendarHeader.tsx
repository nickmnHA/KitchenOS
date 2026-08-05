type CalendarHeaderProps = {
  onAddEvent: () => void;
};

function CalendarHeader({ onAddEvent }: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <div>
        <p className="eyebrow">Schedule</p>
        <h2>Calendar</h2>
      </div>

      <button
        className="calendar-add-button"
        onClick={onAddEvent}
      >
        + Add Event
      </button>
    </div>
  );
}

export default CalendarHeader;