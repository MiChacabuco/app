import React from 'react';

import { Avatar } from 'react-native-paper';

import { theme } from '../../../theme';
import { Business } from '../models/business';
import { getImage } from '../../../utils';

interface BusinessAvatarProps {
  business: Business;
  size: number;
  imageSize?: number;
}

const BusinessAvatar = (props: BusinessAvatarProps) => {
  const { business, size } = props;
  const imageSize = props.imageSize ?? size;

  if (business.avatar) {
    const dimensions = {
      width: imageSize,
      height: imageSize,
    };
    const uri = getImage(business.avatar, { dimensions });
    return <Avatar.Image size={size} source={{ uri }} />;
  } else {
    return (
      <Avatar.Text
        size={size}
        label={business.name[0]}
        style={{ backgroundColor: theme.colors.accent }}
      />
    );
  }
};

export default BusinessAvatar;
