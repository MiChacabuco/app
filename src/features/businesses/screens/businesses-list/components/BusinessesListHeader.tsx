import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Caption, Chip, Switch } from 'react-native-paper';

import { theme } from '../../../../../theme';

const chipTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    text: '#fff',
  },
};

interface BusinessesListHeaderProps {
  total: number;
  isDistanceOn: boolean;
  toggleDistance: (on: boolean) => Promise<void>;
}

interface BusinessesListHeaderState {
  isDistanceOn: boolean;
}

class BusinessesListHeader extends React.Component<
  BusinessesListHeaderProps,
  BusinessesListHeaderState
> {
  state = {
    isDistanceOn: false,
  };

  componentDidMount() {
    this.setState({ isDistanceOn: this.props.isDistanceOn });
  }

  get isDistanceOn(): boolean {
    return this.state.isDistanceOn;
  }

  set isDistanceOn(on: boolean) {
    this.setState({ isDistanceOn: on });
    this.props.toggleDistance(on).catch(() => {
      this.setState({ isDistanceOn: !on });
    });
  }

  render() {
    const { total } = this.props;

    return (
      <View style={styles.container}>
        <Chip
          theme={chipTheme}
          style={{ backgroundColor: theme.colors.accent }}
        >
          {total} resultado{total > 1 && 's'}
        </Chip>
        <View style={styles.switchContainer}>
          <Caption style={styles.switchCaption}>Distancia</Caption>
          <Switch
            value={this.isDistanceOn}
            onValueChange={value => (this.isDistanceOn = value)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    elevation: 1,
  },
  switchCaption: {
    fontSize: 14,
    marginRight: 8,
  },
});

export default BusinessesListHeader;
