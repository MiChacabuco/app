import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { startOfDay } from 'date-fns';

import { CalendarEvent, EventsListResponse } from './models/event';
import { admin } from '../../utils';

export interface EventsById {
  [id: string]: CalendarEvent;
}

export interface EventsStateEvents {
  byId: EventsById;
  byDay: {
    [day: string]: string[]; // List of event ID's belonging to this day
  };
  ids: string[];
  nextPageToken: string;
}

export interface EventsState {
  [source: string]: {
    events: EventsStateEvents;
  };
}

const eventsSlice = createSlice({
  name: 'events',
  initialState: {},
  reducers: {
    fetchEventsSuccess(
      state: EventsState,
      action: PayloadAction<{
        source: string;
        response: EventsListResponse;
        replace: boolean;
      }>
    ) {
      const { source, response, replace } = action.payload;
      const init = replace || !state[source];
      let events;
      if (init) {
        events = {
          byId: {},
          ids: [],
          byDay: {},
          hasMore: false,
        };
      } else {
        events = state[source].events;
      }
      // Hash events by id to access later
      const eventsById: { [id: number]: CalendarEvent } = {};
      response.events.forEach(e => {
        eventsById[e.id] = e;
      });
      response.eventDates.forEach(eventDate => {
        // Add id only if it doesn't exist yet
        const event = eventsById[eventDate.event];
        event.date = { start: eventDate.start, end: eventDate.end };
        if (!events.byId[event.id]) {
          events.ids.push(event.id);
          // By day
          const date = new Date(eventDate.start);
          const day = startOfDay(date).getTime();
          if (!events.byDay[day]) {
            events.byDay[day] = [];
          }
          events.byDay[day].push(event.id);
        }
        events.byId[event.id] = event;
      });
      state[source] = { events };
    },
  },
});

const { actions } = eventsSlice;

export type FetchEventsParams = Partial<{
  maxResults: number;
  replace: boolean;
}>;

const fetchEvents = (source: string, inputParams: FetchEventsParams = {}) => (
  dispatch
): Promise<EventsListResponse> => {
  const { maxResults, replace } = {
    replace: false,
    ...inputParams,
  };
  const url = '/events/dates/';
  const params = {
    exclude: ['event.*'],
    include: ['event.id', 'event.title'],
    'filter{event.created_by.username}': source,
    total_results: maxResults,
  };
  return admin
    .get(url, { params })
    .then((response: { body: EventsListResponse }) => {
      dispatch(
        actions.fetchEventsSuccess({
          source,
          response: response.body,
          replace,
        })
      );
      return response;
    })
    .catch(e => void e);
};
eventsSlice.actions['fetchEvents'] = fetchEvents;

export default eventsSlice;
