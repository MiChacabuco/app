import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Caption, Headline } from 'react-native-paper';

import NoResultsSvg from '../../../../../components/NoResultsSvg';
import PillButton from '../../../../../components/PillButton';
import { theme } from '../../../../../theme';

interface NoResultsProps {
  clear?: () => void;
  label?: string;
}

const NoResults = (props: NoResultsProps) => (
  <View style={styles.noResultsContainer}>
    <NoResultsSvg widthPct={0.75} />
    <Headline style={styles.headline}>Sin resultados</Headline>
    <Caption style={{ textAlign: 'center' }}>
      No hay {props.label || 'resultados'} que coincidan con su búsqueda.
    </Caption>
    {props.clear && (
      <PillButton onPress={props.clear} style={styles.button}>
        Ver todos
      </PillButton>
    )}
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

export default NoResults;
