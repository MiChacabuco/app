import React from 'react';

import { connect } from 'react-redux';
import { Portal, FAB } from 'react-native-paper';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import {
  openFacebook,
  openInstagram,
  openURL,
  sendEmail,
} from '../../../../../utils';
import { MainState } from '../../../../../reducers/slices';
import { Business } from '../../../models/business';

interface BusinessFABProps {
  business: Business;
}

interface BusinessFABState {
  isOpen: boolean;
}

class BusinessFAB extends React.Component<BusinessFABProps, BusinessFABState> {
  state = {
    isOpen: false,
  };

  componentDidUpdate(prevProps: Readonly<BusinessFABProps>) {
    if (prevProps.business && !this.props.business) {
      // Close FAB when it has no place anymore
      this.setState({ isOpen: false });
    }
  }

  get actions() {
    const { business } = this.props;
    if (!business) {
      return [];
    }
    const actions = [];
    if (business.instagram) {
      actions.unshift(
        this.getAction('instagram', '#e03665', 'Instagram', () =>
          openInstagram(business.instagram)
        )
      );
    }
    if (business.facebook) {
      actions.unshift(
        this.getAction('facebook', '#4862a3', 'Facebook', () =>
          openFacebook(business.facebook)
        )
      );
    }
    if (business.website) {
      actions.unshift(
        this.getAction('web', '#aa00ff', 'Web', () => openURL(business.website))
      );
    }
    if (business.email) {
      actions.unshift(
        this.getAction('email', '#ff1744', 'Email', () =>
          sendEmail(business.email)
        )
      );
    }
    return actions;
  }

  getAction(icon, color, label, onPress) {
    return { icon, color, label, onPress };
  }

  render() {
    const actions = this.actions;
    if (!actions.length) {
      return null;
    }
    return (
      <Portal>
        <FAB.Group
          visible={this.props.business !== null}
          open={this.state.isOpen}
          icon={this.state.isOpen ? 'close' : 'plus'}
          actions={actions}
          onStateChange={({ open }) => this.setState({ isOpen: open })}
          style={{ paddingBottom: 56 + getBottomSpace() }}
        />
      </Portal>
    );
  }
}

const mapStateToProps = (state: { app: MainState }) => ({
  business: state.app.fabBusiness,
});

export default connect(mapStateToProps, null)(BusinessFAB);
