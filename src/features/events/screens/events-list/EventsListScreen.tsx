import React from 'react';
import {
  InteractionManager,
  SectionList,
  SectionListData,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { NavigationScreenProp } from 'react-navigation';

import { prettyDate } from '../../../../utils';
import eventsSlice, {
  FetchEventsParams,
  EventsState,
  EventsStateEvents,
} from '../../slices';
import { theme } from '../../../../theme';
import EventItem from './components/EventItem';
import EventsHeader from './components/EventsHeader';
import { EVENT_SOURCES_NAME } from '../../../../constants';
import { CalendarEvent } from '../../models/event';

interface EventsListScreenProps {
  navigation: NavigationScreenProp<any>;
  events: EventsStateEvents;
  fetchEvents: (source: string, params: FetchEventsParams) => Promise<any>;
}

interface EventsListScreenState {
  isFirstFetch: boolean;
  isLoading: boolean;
}

class EventsListScreen extends React.Component<
  EventsListScreenProps,
  EventsListScreenState
> {
  readonly MAX_RESULTS = 20;

  state = {
    isFirstFetch: true,
    isLoading: true,
  };

  componentDidMount() {
    this.setScreenTitle();
    InteractionManager.runAfterInteractions(() => {
      this.init();
    });
  }

  get sections(): SectionListData<CalendarEvent>[] {
    /** Maps events to SectionListData */
    const { byDay, byId } = this.props.events;
    return Object.keys(byDay).map((day, index) => {
      const events = byDay[day].map(id => byId[id]);
      // Get date for this group of events
      const date = new Date(events[0].date.start);
      return {
        index,
        title: prettyDate(date, false).toUpperCase(),
        data: events,
      };
    });
  }

  get source(): string {
    return this.props.navigation.getParam('source');
  }

  setScreenTitle() {
    const title = EVENT_SOURCES_NAME[this.source];
    this.props.navigation.setParams({ title });
  }

  init() {
    this.props
      .fetchEvents(this.source, { maxResults: this.MAX_RESULTS, replace: true })
      .finally(() => {
        this.setState({
          isLoading: false,
          isFirstFetch: false,
        });
      });
  }

  fetchMoreEvents() {
    const { nextPageToken } = this.props.events;
    if (!nextPageToken) {
      return;
    }
    this.setState({ isLoading: true });
    this.props
      .fetchEvents(this.source, { maxResults: this.MAX_RESULTS })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  renderFooter() {
    const { isLoading, isFirstFetch } = this.state;
    return (
      <View style={{ marginBottom: 12 }}>
        {isLoading && !isFirstFetch && (
          <ActivityIndicator color={theme.colors.accent} />
        )}
      </View>
    );
  }

  render() {
    const { isLoading, isFirstFetch } = this.state;

    return (
      <View style={{ backgroundColor: '#fff' }}>
        {isLoading && isFirstFetch ? (
          <ActivityIndicator
            animating={true}
            color={theme.colors.accent}
            size="large"
            style={{ height: '100%' }}
          />
        ) : (
          <SectionList
            sections={this.sections}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={props => <EventsHeader {...props} />}
            renderItem={({ item }) => <EventItem item={item} />}
            ListFooterComponent={() => this.renderFooter()}
            onEndReached={() => this.fetchMoreEvents()}
            keyExtractor={event => event.id.toString()}
            initialNumToRender={20}
          />
        )}
      </View>
    );
  }
}

const actions = eventsSlice.actions as any;

const mapStateToProps = (
  state: { events: EventsState },
  ownProps: EventsListScreenProps
) => {
  const source = ownProps.navigation.getParam('source');

  return {
    events: state.events[source]?.events ?? {
      byId: {},
      ids: [],
      byDay: {},
      hasMore: false,
    },
  };
};

const mapDispatchToProps = {
  fetchEvents: actions.fetchEvents,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsListScreen);
