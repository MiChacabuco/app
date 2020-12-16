import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { NavigationScreenProp } from 'react-navigation';
import { ActivityIndicator, Title } from 'react-native-paper';
import HTML from 'react-native-render-html';

import { theme } from '../../../../theme';
import { CalendarEvent } from '../../models/event';
import { admin, embedYouTube } from '../../../../utils';
import PillButton from '../../../../components/PillButton';

interface EventDetailScreenProps {
  navigation: NavigationScreenProp<any>;
}

interface EventDetailScreenState {
  event: CalendarEvent;
  isLoading: boolean;
}

class EventDetailScreen extends React.Component<
  EventDetailScreenProps,
  EventDetailScreenState
> {
  state = {
    event: null,
    isLoading: true,
  };

  componentDidMount() {
    this.init();
  }

  init() {
    const { navigation } = this.props;
    const eventId = navigation.getParam('eventId');
    this.fetchEvent(eventId)
      .then(event => {
        this.setState({ event });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  fetchEvent(id): Promise<CalendarEvent> {
    const url = `/events/${id}/`;
    return admin
      .get(url)
      .then((response: { body: { event: CalendarEvent } }) => {
        return response.body.event;
      });
  }

  handleLinkPress(uri: string) {
    this.props.navigation.navigate('WebViewScreen', {
      props: {
        source: { uri },
        allowsFullscreenVideo: true,
      },
      showTabBar: false,
    });
  }

  render() {
    const { event, isLoading } = this.state as EventDetailScreenState;

    if (isLoading) {
      return (
        <ActivityIndicator
          color={theme.colors.accent}
          size="large"
          style={{ flex: 1 }}
        />
      );
    } else {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Title style={styles.title}>{event.title}</Title>

          {event.image && (
            <Image
              source={{ uri: event.image }}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          {event.body && (
            <View style={styles.htmlContainer}>
              <HTML
                html={event.body}
                onLinkPress={(_, href) => this.handleLinkPress(href)}
                baseFontStyle={{ fontSize: 16 }}
              />
            </View>
          )}

          {!!event.youtube && (
            <PillButton
              icon="youtube"
              color={theme.colors.accent}
              style={styles.videoButton}
              onPress={() => this.handleLinkPress(embedYouTube(event.youtube))}
            >
              Video
            </PillButton>
          )}
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: { fontSize: 24, textAlign: 'center' },
  image: {
    height: 250,
    marginVertical: 16,
  },
  htmlContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    marginVertical: 16,
  },
  videoButton: { width: 120, alignSelf: 'center' },
});

export default EventDetailScreen;
