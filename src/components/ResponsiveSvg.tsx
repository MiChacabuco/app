import React from 'react';
import Svg from 'react-native-svg';
import { Dimensions } from 'react-native';

interface Props {
  width: number;
  height: number;
  widthPct: number;
  children: React.ReactNode;
}
const { width } = Dimensions.get('window');

const ResponsiveSvg = (props: Props) => {
  const svgWidth = width * props.widthPct;
  const svgHeight = props.height * (svgWidth / props.width);

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${props.width} ${props.height}`}
    >
      {props.children}
    </Svg>
  );
};

export default ResponsiveSvg;
