import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/Theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: SIZES.radius,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...SHADOWS.small,
    };

    const sizeStyles = {
      small: {
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.padding * 1.5,
      },
      medium: {
        paddingVertical: SIZES.base * 1.5,
        paddingHorizontal: SIZES.padding * 2,
      },
      large: {
        paddingVertical: SIZES.base * 2,
        paddingHorizontal: SIZES.padding * 3,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: COLORS.primary,
      },
      secondary: {
        backgroundColor: COLORS.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: COLORS.error,
      },
      success: {
        backgroundColor: COLORS.success,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
      ...style,
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: '600',
    };

    const variantStyles = {
      primary: {
        color: COLORS.surface,
      },
      secondary: {
        color: COLORS.surface,
      },
      outline: {
        color: COLORS.primary,
      },
      ghost: {
        color: COLORS.primary,
      },
      danger: {
        color: COLORS.surface,
      },
      success: {
        color: COLORS.surface,
      },
    };

    const sizeStyles = {
      small: {
        fontSize: 12,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.surface} />
      ) : (
        <>
          {icon && icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
