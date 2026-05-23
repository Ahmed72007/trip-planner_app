import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: GlassButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  return (
    <AnimatedTouchable
      style={[animatedStyle, containerStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.textInverse : Colors.accent} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], icon ? styles.textWithIcon : null, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: {
    backgroundColor: Colors.accent,
  },
  secondary: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  size_sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
  size_md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  size_lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl },

  // Text
  text: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.2,
  },
  text_primary: { color: Colors.textPrimary },
  text_secondary: { color: Colors.textPrimary },
  text_outline: { color: Colors.accent },
  text_ghost: { color: Colors.accent },

  textSize_sm: { fontSize: FontSize.sm },
  textSize_md: { fontSize: FontSize.md },
  textSize_lg: { fontSize: FontSize.lg },
  textWithIcon: { marginLeft: 4 },
});
