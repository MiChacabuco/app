import React from 'react';

import { Card } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

import { theme } from '../theme';

export interface GradientCardProps {
  cardProps?: {};
  colors: string[];
  children: React.ReactNode;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

const GradientCard = (props: GradientCardProps) => (
  <Card {...props.cardProps} elevation={0}>
    <LinearGradient
      style={{ borderRadius: theme.roundness }}
      colors={props.colors}
      start={props.start}
      end={props.end}
    >
      {props.children}
    </LinearGradient>
  </Card>
);

export default GradientCard;
