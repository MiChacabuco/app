import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { Caption, Headline } from 'react-native-paper';

import PillButton from '../../../components/PillButton';
import SearchEngineSvg from './SearchEngineSvg';
import { theme } from '../../../theme';

interface SearchPlaceholderProps {
  navigation: NavigationScreenProp<any>;
}

const BusinessSearchPlaceholder = (props: SearchPlaceholderProps) => (
  <View style={styles.noResultsContainer}>
    <SearchEngineSvg widthPct={0.75} />
    <Headline style={styles.headline}>
      Guía de comercios y profesionales
    </Headline>
    <Caption style={{ textAlign: 'center' }}>
      Busque comercios y profesionales por nombre o rubro.
    </Caption>
    <PillButton
      onPress={() => props.navigation.getParam('activateSearch')()}
      icon="magnify"
      style={styles.button}
    >
      Buscar
    </PillButton>
  </View>
);

const styles = StyleSheet.create({
  headline: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: theme.colors.accent,
  },
});

export default withNavigation(BusinessSearchPlaceholder);
