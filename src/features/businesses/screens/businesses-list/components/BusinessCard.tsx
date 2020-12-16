import React from 'react';
import { StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';
import {
  NavigationScreenProp,
  NavigationState,
  withNavigation,
} from 'react-navigation';
import { Badge, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '../../../../../theme';
import appSlice from '../../../../../reducers/slices';
import Touchable from '../../../../../components/Touchable';
import BusinessAvatar from '../../../components/BusinessAvatar';
import { formatDistance, setTimeoutWorkaround } from '../../../../../utils';
import { Business } from '../../../models/business';

export interface BusinessCardProps {
  business: Business;
  setFabBusiness?: (place: Business) => void;
  navigation?: NavigationScreenProp<NavigationState>;
}

class BusinessCard extends React.Component<BusinessCardProps> {
  get subtitle(): string {
    const { business, navigation } = this.props;
    const subtitleField = navigation.getParam('subtitleField', 'summary');
    return business[subtitleField];
  }

  goToBusinessDetail(business: Business) {
    setTimeoutWorkaround(() => {
      this.props.setFabBusiness(business);
      this.props.navigation.navigate('BusinessDetail', { business });
    });
  }

  render() {
    const { business } = this.props;
    const isSlim = this.props.navigation.getParam('isSlim', false);

    return (
      <Touchable onPress={() => this.goToBusinessDetail(business)}>
        <Card style={styles.card} elevation={0}>
          <Card.Title
            title={business.name}
            subtitle={this.subtitle}
            left={
              isSlim
                ? null
                : () => <BusinessAvatar business={business} size={56} />
            }
            leftStyle={{ marginRight: 32 }}
            rightStyle={{ alignSelf: 'flex-start' }}
            right={() =>
              business.distance && (
                <View style={styles.distanceBadgeContainer}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    color="#fff"
                  />
                  <Badge visible={true} size={24} style={styles.distanceBadge}>
                    {formatDistance(business.distance)}
                  </Badge>
                </View>
              )
            }
            titleStyle={styles.title}
          />
        </Card>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
    elevation: 1,
  },
  title: {
    fontSize: 18,
  },
  distanceBadgeContainer: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 2,
  },
  distanceBadge: {
    borderRadius: 0,
    backgroundColor: theme.colors.accent,
  },
});

const mapDispatchToProps = {
  setFabBusiness: appSlice.actions.setFabBusiness,
};

const PlaceCardConnected = connect(null, mapDispatchToProps)(BusinessCard);

export default withNavigation(PlaceCardConnected);
