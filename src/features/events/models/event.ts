import { AdminDynamicRestMeta } from '../../../models/response';

export interface CalendarEvent {
  id: number;
  title: string;
  body: string;
  image: string;
  youtube: string;
  date?: { start: string; end: string };
}

interface EventDate {
  event: number;
  start: string;
  end: string;
}

export interface EventsListResponse {
  eventDates: EventDate[];
  events: CalendarEvent[];
  meta: AdminDynamicRestMeta;
}
