import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GradientCard from '../../../../../components/GradientCard';

interface HomeCardProps {
  title: string;
  subtitle: string;
  colors: string[];
  onPress: () => any;
  isEnabled?: boolean;
  content?: string;
  children?: React.ReactNode;
}

const HomeCard = (props: HomeCardProps) => (
  <GradientCard
    colors={props.colors}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    cardProps={{
      onPress: props.isEnabled ? props.onPress : null,
      style: { elevation: 2 },
    }}
  >
    <View style={styles.container}>
      {/* Information */}
      <View style={{ flex: 8 }}>
        <Card.Title
          title={props.title}
          subtitle={props.subtitle}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
        />
        {props.content !== undefined && (
          <Card.Content style={{ paddingBottom: props.children ? 0 : 8 }}>
            <Text style={styles.contentText}>{props.content}</Text>
          </Card.Content>
        )}
      </View>

      {/* Navigation icon */}
      {props.isEnabled && (
        <View style={styles.navigationIcon}>
          <MaterialCommunityIcons name="chevron-right" size={40} color="#fff" />
        </View>
      )}
    </View>
  </GradientCard>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingRight: 8,
    paddingBottom: 2,
  },
  title: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 2,
    textShadowOffset: { height: 1, width: 0 },
    maxWidth: '90%',
  },
  contentText: {
    color: '#fff',
    fontSize: 16,
  },
  navigationIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default HomeCard;
