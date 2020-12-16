import React from 'react';
import { StyleSheet, View } from 'react-native';

import BusinessCard, { BusinessCardProps } from './BusinessCard';

const BusinessCardItem = (props: BusinessCardProps) => (
  <View style={styles.container}>
    <BusinessCard {...props} />
  </View>
);

const propsAreEqual = (
  prevProps: BusinessCardProps,
  nextProps: BusinessCardProps
) => {
  const prevPlace = prevProps.business;
  const nextPlace = nextProps.business;
  return (
    prevPlace.id === nextPlace.id && prevPlace.distance === nextPlace.distance
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
});

export default React.memo(BusinessCardItem, propsAreEqual);
