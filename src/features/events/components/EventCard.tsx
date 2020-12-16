import React from 'react';
import { AppState, AppStateStatus, YellowBox } from 'react-native';

import { connect } from 'react-redux';
import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { differenceInMilliseconds } from 'date-fns';

import HomeCard from '../../home/screens/home/components/HomeCard';
import { prettyDate } from '../../../utils';
import eventsSlice, {
  FetchEventsParams,
  EventsState,
  EventsStateEvents,
} from '../slices';
import { EVENT_SOURCES_NAME } from '../../../constants';
import { CalendarEvent } from '../models/event';

YellowBox.ignoreWarnings(['Setting a timer']);

interface EventCardProps {
  source: string;
  colors: string[];
  navigation: NavigationScreenProp<any>;
  events?: EventsStateEvents;
  fetchEvents?: (source: string, params: FetchEventsParams) => Promise<any>;
}

interface EventCardState {
  event: CalendarEvent;
  isLoading: boolean;
}

class EventCard extends React.Component<EventCardProps, EventCardState> {
  state = {
    event: null,
    isLoading: true,
  };
  refreshTimeout = null;
  appState = '';
  handleAppStateChangeBound: () => void;

  constructor(props) {
    super(props);
    this.handleAppStateChangeBound = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    this.init();
    AppState.addEventListener('change', this.handleAppStateChangeBound);
  }

  componentWillUnmount() {
    this.replaceRefreshTimeout(null, false);
    AppState.removeEventListener('change', this.handleAppStateChangeBound);
  }

  shouldComponentUpdate(
    nextProps: Readonly<EventCardProps>,
    nextState: Readonly<EventCardState>
  ): boolean {
    // Don't update if the rendered content didn't change
    if (this.state.isLoading && nextState.isLoading) {
      return false;
    }
    return true;
  }

  get isEnabled(): boolean {
    const { event, isLoading } = this.state;
    return event && !isLoading;
  }

  get title(): string {
    return EVENT_SOURCES_NAME[this.props.source];
  }

  get subtitle(): string {
    if (this.state.isLoading) {
      return 'Cargando ...';
    }
    const { event } = this.state;
    return event ? event.title : 'Sin eventos programados';
  }

  get content(): string {
    if (!this.isEnabled) {
      return '';
    }
    return this.formatDate(this.state.event);
  }

  init() {
    this.fetchNextEvents();
  }

  fetchNextEvents() {
    // Fetch next 2 unfinished events, the first one that didn't start will be shown.
    this.setState({ isLoading: true });
    this.props
      .fetchEvents(this.props.source, { maxResults: 1, replace: true })
      .finally(() => {
        this.setNextEvent();
        this.setState({ isLoading: false });
      });
  }

  setNextEvent() {
    const { events } = this.props;
    const now = new Date();
    const nextEventId = events.ids.find(id => {
      const event = events.byId[id];
      const start = new Date(event.date.start);
      return start > now;
    });
    if (!nextEventId) {
      // There's no next event
      this.setState({ event: null });
      return;
    }
    const nextEvent = events.byId[nextEventId];
    this.setState({ event: nextEvent });
    this.scheduleRefresh(nextEvent);
  }

  scheduleRefresh(event: CalendarEvent) {
    /** Refresh events when current event ends **/
    const ms = differenceInMilliseconds(new Date(event.date.start), new Date());
    const refreshTimeout = setTimeout(() => this.init(), ms);
    this.replaceRefreshTimeout(refreshTimeout);
  }

  goToEventsList() {
    const { source, navigation } = this.props;
    setTimeout(() => {
      // setTimeout workaround to navigate after press animation
      navigation.navigate('EventsList', { source });
    }, 0);
  }

  formatDate(event: CalendarEvent): string {
    const date = new Date(event.date.start);
    return prettyDate(date);
  }

  handleAppStateChange(nextAppState: AppStateStatus) {
    const backgroundRegex = /inactive|background/;
    if (nextAppState === 'active' && this.appState.match(backgroundRegex)) {
      // Moved to foreground
      const now = new Date();
      const { event } = this.state;
      if (!event) {
        this.fetchNextEvents();
      } else {
        const start = new Date(event.date.start);
        if (now > start) {
          this.fetchNextEvents();
        }
      }
    } else if (
      nextAppState.match(backgroundRegex) &&
      this.appState === 'active'
    ) {
      // Moved to background
      this.replaceRefreshTimeout(null);
    }
    this.appState = nextAppState;
  }

  replaceRefreshTimeout(newTimeout: number, setState = true) {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    if (setState) {
      this.refreshTimeout = newTimeout;
    }
  }

  render() {
    return (
      <HomeCard
        title={this.title}
        subtitle={this.subtitle}
        colors={this.props.colors}
        content={this.content}
        onPress={() => this.goToEventsList()}
        isEnabled={this.isEnabled}
      />
    );
  }
}

const actions: any = eventsSlice.actions;
const mapStateToProps = (
  state: { events: EventsState },
  ownProps: EventCardProps
) => ({
  events: state.events[ownProps.source]?.events || {
    byId: {},
    ids: [],
  },
});

const mapDispatchToProps = {
  fetchEvents: actions.fetchEvents,
};

const ConnectedEventCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCard);

export default withNavigation(ConnectedEventCard);
