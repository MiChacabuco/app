import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';
import {
  NavigationEventSubscription,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import { Badge, Text, Title } from 'react-native-paper';

import BusinessInfo from './components/BusinessInfo';
import { theme } from '../../../../theme';
import appSlice from '../../../../reducers/slices';
import BusinessActionButton from './components/BusinessActionButton';
import { call, openLocation, sendWhatsapp } from '../../../../utils';
import { Business } from '../../models/business';

interface BusinessDetailScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
  setFabBusiness: (business: Business) => void;
}

class BusinessDetailScreen extends React.Component<BusinessDetailScreenProps> {
  focusSubscription = null;
  blurSubscription = null;

  componentDidMount() {
    this.focusSubscription = this.openFabOnFocus();
    this.blurSubscription = this.hideFabOnBlur();
  }

  componentWillUnmount() {
    this.focusSubscription.remove();
    this.blurSubscription.remove();
  }

  get place(): Business {
    return this.props.navigation.getParam('business');
  }

  get whatsapp(): string {
    const phones = this.place.phones ?? [];
    const phone = phones.find(p => p.isWhatsapp);
    if (!phone) {
      return null;
    }
    return phone.number;
  }

  get hasInfo(): boolean {
    const place = this.place;
    return !!(
      place.address ||
      (place.phones && place.phones.length) ||
      place.email
    );
  }

  openFabOnFocus(): NavigationEventSubscription {
    return this.props.navigation.addListener('didFocus', () => {
      setTimeout(() => {
        // setTimeout workaround
        // This was being executed before the blur, giving a wrong behaviour
        // when navigating between two places using the bottom tab.
        this.props.setFabBusiness(this.place);
      }, 0);
    });
  }

  hideFabOnBlur(): NavigationEventSubscription {
    return this.props.navigation.addListener('willBlur', () => {
      this.props.setFabBusiness(null);
    });
  }

  render() {
    const place = this.place;
    const whatsapp = this.whatsapp;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.titleContainer}>
          <Title style={styles.name}>{place.name}</Title>
        </View>

        <View style={styles.actionsContainer}>
          {place.phones && place.phones.length && (
            <BusinessActionButton
              onPress={() => call(place.phones[0].number)}
              icon="phone-outline"
              backgroundColor="#2962ff"
            />
          )}
          {whatsapp && (
            <BusinessActionButton
              onPress={() => sendWhatsapp(whatsapp)}
              icon="whatsapp"
              backgroundColor="#00e676"
            />
          )}
          {place.point && (
            <BusinessActionButton
              onPress={() => openLocation(place.point, place.name)}
              icon="map-marker-outline"
              backgroundColor="#00bfa5"
            />
          )}
        </View>

        {place.summary && (
          <View style={styles.infoContainer}>
            <Text>{place.summary}</Text>
          </View>
        )}

        {this.hasInfo && (
          <View style={[styles.infoContainer, { paddingTop: 8 }]}>
            {place.hasDelivery && (
              <Badge visible={true} size={24} style={styles.badge}>
                delivery
              </Badge>
            )}
            {place.address && (
              <BusinessInfo label="DIRECCIÓN" value={place.address} />
            )}
            {place.phones && place.phones.length && (
              <BusinessInfo
                label="TELÉFONO"
                value={place.phones.map(p => p.number)}
                isMultiple={true}
              />
            )}
            {place.email && <BusinessInfo label="EMAIL" value={place.email} />}
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  category: {
    color: '#444',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 16,
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
  badge: {
    alignSelf: 'flex-start',
    marginVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
});

const mapDispatchToProps = {
  setFabBusiness: appSlice.actions.setFabBusiness,
};

export default connect(null, mapDispatchToProps)(BusinessDetailScreen);
