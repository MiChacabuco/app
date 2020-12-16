import React from 'react';
import { StyleSheet, View } from 'react-native';

import NewsCard, { NewsCardProps } from './NewsCard';

const NewsCardItem = (props: NewsCardProps) => (
  <View style={styles.container}>
    <NewsCard {...props} />
  </View>
);

const propsAreEqual = (prevProps: NewsCardProps, nextProps: NewsCardProps) => {
  return prevProps.news.Id === nextProps.news.Id;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
});

export default React.memo(NewsCardItem, propsAreEqual);
