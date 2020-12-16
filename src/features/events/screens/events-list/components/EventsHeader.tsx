import React from 'react';
import { SectionListData, StyleSheet } from 'react-native';

import { List } from 'react-native-paper';

interface EventsHeaderProps {
  section: SectionListData<any>;
}

const EventsHeader = (props: EventsHeaderProps) => (
  <List.Subheader style={styles.subHeader}>
    {props.section.title}
  </List.Subheader>
);

const styles = StyleSheet.create({
  subHeader: {
    textAlign: 'center',
    backgroundColor: '#fff',
  },
});

const propsAreEqual = (
  prevProps: EventsHeaderProps,
  nextProps: EventsHeaderProps
) => prevProps.section.title === nextProps.section.title;

export default React.memo(EventsHeader, propsAreEqual);
