import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { List } from 'react-native-paper';
import { format } from 'date-fns';

import { theme } from '../../../../../theme';
import { CalendarEvent } from '../../../models/event';

interface EventItemProps {
  item: CalendarEvent;
  navigation: NavigationScreenProp<any>;
}

const EventItem = (props: EventItemProps) => {
  const { item } = props;
  const start = new Date(item.date.start);
  const end = new Date(item.date.end);

  const getDescription = () => {
    let fmt = 'H:mm';
    if (start.getDay() !== end.getDay()) {
      // The event ends a different day, show the days to avoid confusion.
      fmt += ' (d/M)';
    }
    return `${format(start, fmt)} — ${format(end, fmt)}`;
  };

  const goToDetail = () => {
    props.navigation.navigate('EventDetail', { eventId: item.id });
  };

  return (
    <List.Item
      title={item.title}
      description={getDescription()}
      style={styles.item}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      onPress={() => goToDetail()}
      right={() => <List.Icon icon="chevron-right" color="#ffffff" />}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: theme.colors.accent,
    margin: 8,
    marginTop: 0,
    padding: 2,
    borderRadius: 4,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: { color: 'rgba(255,255,255,0.9)' },
});

const propsAreEqual = (prevProps: EventItemProps, nextProps: EventItemProps) =>
  prevProps.item.id === nextProps.item.id;

export default React.memo(withNavigation(EventItem), propsAreEqual);
