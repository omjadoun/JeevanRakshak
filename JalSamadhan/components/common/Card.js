import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/Theme';

const Card = ({
  children,
  style,
  variant = 'default',
  padding = true,
  margin = false,
  onPress,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
    };

    const variantStyles = {
      default: {
        ...SHADOWS.medium,
      },
      elevated: {
        ...SHADOWS.large,
      },
      outlined: {
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      flat: {},
    };

    const paddingStyle = padding ? {
      padding: SIZES.padding,
    } : {};

    const marginStyle = margin ? {
      margin: SIZES.margin,
    } : {};

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyle,
      ...marginStyle,
      ...style,
    };
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={getCardStyle()} onPress={onPress} {...props}>
      {children}
    </CardComponent>
  );
};

export default Card;
