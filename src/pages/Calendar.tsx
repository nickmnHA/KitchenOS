import { useEffect, useMemo, useState } from "react";

import AgendaPanel from "../calendar/AgendaPanel";
import CalendarGrid from "../calendar/CalendarGrid";
import CalendarHeader from "../calendar/CalendarHeader";
import EventModal from "../calendar/EventModal";

import {
  calendarNames,
  type CalendarDay,
  type CalendarEvent,
  type CalendarType,
  type EventsByDate,
} from "../calendar/calendarTypes";

import {
  createMonthGrid,
  getDateKey,
} from "../calendar/calendarUtils";

const weekdays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function createInitialEvents(): EventsByDate {
  const savedEvents = localStorage.getItem(
    "kitchenos-calendar-v2",
  );

  if (savedEvents) {
    try {
      return JSON.parse(savedEvents) as EventsByDate;
    } catch {
      localStorage.removeItem("kitchenos-calendar-v2");
    }
  }

  const todayKey = getDateKey(new Date());

  return {
    [todayKey]: [
      {
        id: crypto.randomUUID(),
        time: "9:00 AM",
        title: "Work",
        calendar: "Work",
        type: "work",
      },
      {
        id: crypto.randomUUID(),
        time: "4:30 PM",
        title: "Pick up groceries",
        calendar: "Personal",
        type: "personal",
      },
      {
        id: crypto.randomUUID(),
        time: "6:30 PM",
        title: "Dinner with family",
        calendar: "Family",
        type: "family",
      },
    ],
  };
}

function Calendar() {
  const today = useMemo(() => new Date(), []);

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const [eventsByDate, setEventsByDate] =
    useState<EventsByDate>(createInitialEvents);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] =
    useState<CalendarType>("personal");

  const [editingEventId, setEditingEventId] =
    useState<string | null>(null);

  const monthDays = useMemo(
    () =>
      createMonthGrid(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
      ),
    [visibleMonth],
  );

  const todayKey = getDateKey(today);
  const selectedDateKey = getDateKey(selectedDate);
  const selectedEvents = [...(eventsByDate[selectedDateKey] ?? [])].sort(
  (a, b) => {
    const aTime = new Date(`2000-01-01 ${a.time}`).getTime();
    const bTime = new Date(`2000-01-01 ${b.time}`).getTime();

    return aTime - bTime;
  },
);

  const monthTitle = visibleMonth.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  const selectedDateTitle =
    selectedDate.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  useEffect(() => {
    localStorage.setItem(
      "kitchenos-calendar-v2",
      JSON.stringify(eventsByDate),
    );
  }, [eventsByDate]);

  function jumpToToday() {
  const now = new Date();

  setVisibleMonth(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ),
  );

  setSelectedDate(now);
}

  function changeMonth(amount: number) {
    const newMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + amount,
      1,
    );

    setVisibleMonth(newMonth);
    setSelectedDate(newMonth);
  }

  function selectDay(day: CalendarDay) {
    setSelectedDate(day.date);

    if (!day.isCurrentMonth) {
      setVisibleMonth(
        new Date(
          day.date.getFullYear(),
          day.date.getMonth(),
          1,
        ),
      );
    }
  }

  function resetEventForm() {
    setEventTitle("");
    setEventTime("");
    setEventType("personal");
    setEditingEventId(null);
  }

  function openNewEventModal() {
    resetEventForm();
    setIsModalOpen(true);
  }

  function closeEventModal() {
    resetEventForm();
    setIsModalOpen(false);
  }

  function handleAddEvent() {
    if (!eventTitle.trim() || !eventTime) {
      return;
    }

    const formattedTime = new Date(
      `2000-01-01T${eventTime}`,
    ).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    if (editingEventId) {
      setEventsByDate((currentEvents) => ({
        ...currentEvents,
        [selectedDateKey]: (
  currentEvents[selectedDateKey] ?? []
)
  .map((event) =>
    event.id === editingEventId
      ? {
          ...event,
          title: eventTitle.trim(),
          time: formattedTime,
          type: eventType,
          calendar: calendarNames[eventType],
        }
      : event,
  )
  .sort(
    (a, b) =>
      new Date(`2000-01-01 ${a.time}`).getTime() -
      new Date(`2000-01-01 ${b.time}`).getTime(),
  ),
        
      }));
    } else {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title: eventTitle.trim(),
        time: formattedTime,
        type: eventType,
        calendar: calendarNames[eventType],
      };

      setEventsByDate((currentEvents) => ({
        ...currentEvents,
       [selectedDateKey]: [
  ...(currentEvents[selectedDateKey] ?? []),
  newEvent,
].sort(
  (a, b) =>
    new Date(`2000-01-01 ${a.time}`).getTime() -
    new Date(`2000-01-01 ${b.time}`).getTime(),
),
      }));
    }

    closeEventModal();
  }

  function handleEditEvent(event: CalendarEvent) {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventType(event.type);

    const [time, modifier] = event.time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    setEventTime(
      `${String(hours).padStart(2, "0")}:${String(
        minutes,
      ).padStart(2, "0")}`,
    );

    setIsModalOpen(true);
  }

  function handleDeleteEvent(eventId: string) {
    setEventsByDate((currentEvents) => {
      const remainingEvents = (
        currentEvents[selectedDateKey] ?? []
      ).filter((event) => event.id !== eventId);

      const updatedEvents = {
        ...currentEvents,
      };

      if (remainingEvents.length === 0) {
        delete updatedEvents[selectedDateKey];
      } else {
        updatedEvents[selectedDateKey] =
          remainingEvents;
      }

      return updatedEvents;
    });
  }

  return (
    <main className="main">
<CalendarHeader
  onToday={jumpToToday}
  onAddEvent={openNewEventModal}
/>
      <section className="calendar-layout">
        <div className="calendar-panel">
          <div className="calendar-month-header">
            <button
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
            >
              ‹
            </button>

            <h3>{monthTitle}</h3>

            <button
              aria-label="Next month"
              onClick={() => changeMonth(1)}
            >
              ›
            </button>
          </div>

          <CalendarGrid
            weekdays={weekdays}
            monthDays={monthDays}
            eventsByDate={eventsByDate}
            selectedDateKey={selectedDateKey}
            todayKey={todayKey}
            onSelectDay={selectDay}
          />
        </div>

        <AgendaPanel
          selectedDateTitle={selectedDateTitle}
          selectedEvents={selectedEvents}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </section>

      <EventModal
        isOpen={isModalOpen}
        isEditing={editingEventId !== null}
        selectedDateTitle={selectedDateTitle}
        eventTitle={eventTitle}
        eventTime={eventTime}
        eventType={eventType}
        onTitleChange={setEventTitle}
        onTimeChange={setEventTime}
        onTypeChange={setEventType}
        onSave={handleAddEvent}
        onClose={closeEventModal}
      />
    </main>
  );
}

export default Calendar;