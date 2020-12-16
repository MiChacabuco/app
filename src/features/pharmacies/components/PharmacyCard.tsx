import React from 'react';
import { YellowBox } from 'react-native';

import { connect } from 'react-redux';
import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import HomeCard from '../../home/screens/home/components/HomeCard';
import appSlice from '../../../reducers/slices';
import { PharmacyShift } from '../models/pharmacy-shift';
import { Business } from '../../businesses/models/business';

YellowBox.ignoreWarnings(['Setting a timer']);

interface PharmacyCardProps {
  shift?: PharmacyShift;
  navigation: NavigationScreenProp<any>;
  setFabBusiness: (business: Business) => any;
}

class PharmacyCard extends React.Component<PharmacyCardProps, null> {
  goToPharmacyDetail() {
    const { shift } = this.props;
    const start = format(new Date(shift.start), "d/M H:mm'hs'", { locale: es });
    const end = format(new Date(shift.end), "d/M H:mm'hs'", { locale: es });
    const { pharmacy } = shift;
    const business = {
      ...pharmacy,
      // Add type of place (pharmacy) in the name
      name: `Farmacia ${pharmacy.name}`,
      summary: `Farmacia de turno desde el ${start} hasta el ${end}.`,
    };
    setTimeout(() => {
      // setTimeout workaround to navigate after press animation
      this.props.setFabBusiness(business);
      this.props.navigation.navigate('BusinessDetail', { business });
    }, 0);
  }

  render() {
    const pharmacy = this.props.shift?.pharmacy;

    return (
      <HomeCard
        title="Farmacia de turno"
        subtitle={pharmacy?.name ?? 'Cargando ...'}
        colors={['#00897b', '#1de9b6']}
        content={pharmacy?.address ?? ''}
        onPress={() => this.goToPharmacyDetail()}
        isEnabled={true}
      />
    );
  }
}

const mapDispatchToProps = {
  setFabBusiness: appSlice.actions.setFabBusiness,
};

const ConnectedPharmacyCard = connect(null, mapDispatchToProps)(PharmacyCard);

export default withNavigation(ConnectedPharmacyCard);
