import React from 'react';

import { View } from 'react-native';
import { Text, Caption } from 'react-native-paper';

interface PlaceInfoProps {
  label: string;
  value: any;
  isMultiple?: boolean;
}

const SelectableText = ({ text }) => <Text selectable={true}>{text}</Text>;

const BusinessInfo = (props: PlaceInfoProps) => (
  <View style={{ marginTop: 8 }}>
    <Caption>{props.label}</Caption>
    {props.isMultiple ? (
      <View>
        {props.value.map(v => (
          <SelectableText text={v} key={v} />
        ))}
      </View>
    ) : (
      <SelectableText text={props.value} />
    )}
  </View>
);

export default BusinessInfo;
