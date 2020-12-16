import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import { theme } from '../../../../theme';
import PharmacyCardCarousel from '../../../pharmacies/components/PharmacyCardCarousel';
import EventCard from '../../../events/components/EventCard';
import HomeShortcuts from './components/HomeShortcuts';

class HomeScreen extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Cards */}
        <View style={{ margin: 16 }}>
          <View style={styles.cardContainer}>
            <PharmacyCardCarousel />
          </View>
          <View style={styles.cardContainer}>
            <EventCard
              source="teatroitaliano"
              colors={['#673ab7', '#d500f9']}
            />
          </View>
          <View style={styles.cardContainer}>
            <EventCard
              source="cinemachacabuco"
              colors={['#f44336', '#ffab00']}
            />
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionContainer}>
          <HomeShortcuts />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cardContainer: {
    marginVertical: 4,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        borderColor: '#f4f4f5',
        borderTopWidth: 1,
        borderBottomWidth: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default HomeScreen;
