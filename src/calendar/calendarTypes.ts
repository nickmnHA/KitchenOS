export type CalendarType = "work" | "personal" | "family";

export type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  calendar: string;
  type: CalendarType;
};

export type EventsByDate = Record<string, CalendarEvent[]>;

export type CalendarDay = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

export const calendarNames: Record<CalendarType, string> = {
  work: "Work",
  personal: "Personal",
  family: "Family",
};