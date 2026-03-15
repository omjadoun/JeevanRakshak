import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={COLORS.textSecondary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin,
  },
  label: {
    ...FONTS.body2,
    marginBottom: SIZES.base / 2,
    color: COLORS.text,
    fontWeight: '600',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    fontSize: SIZES.font,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputWithLeftIcon: {
    paddingLeft: SIZES.padding * 2.5,
  },
  inputWithRightIcon: {
    paddingRight: SIZES.padding * 2.5,
  },
  leftIcon: {
    position: 'absolute',
    left: SIZES.base,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: SIZES.base,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.error,
    marginTop: SIZES.base / 2,
  },
});

export default Input;
