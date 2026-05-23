import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Mission } from '../types/trip';
import { useTheme } from '../constants/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface MissionCardProps {
  mission: Mission;
  onPress?: () => void;
}

export function MissionCard({ mission, onPress }: MissionCardProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: colors.surfaceLight, borderColor: colors.border },
          mission.completed && { opacity: 0.6, borderColor: colors.success + '40' },
        ]}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        activeOpacity={1}
      >
        <View style={[
          styles.iconBox,
          { backgroundColor: colors.accent + '20' },
          mission.completed && { backgroundColor: colors.success + '20' },
        ]}>
          <Text style={styles.icon}>{mission.icon}</Text>
        </View>

        <View style={styles.content}>
          <Text style={[
            styles.title,
            { color: colors.textPrimary },
            mission.completed && { textDecorationLine: 'line-through', color: colors.textMuted },
          ]}>
            {mission.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{mission.description}</Text>
          <View style={styles.expRow}>
            <Text style={[styles.expLabel, { color: colors.textMuted }]}>Reward:</Text>
            <Text style={[styles.expValue, { color: colors.accent }]}>+{mission.expReward} EXP</Text>
          </View>
        </View>

        {mission.completed ? (
          <View style={[styles.doneBadge, { backgroundColor: colors.success + '30' }]}>
            <Text style={[styles.doneIcon, { color: colors.success }]}>✓</Text>
          </View>
        ) : (
          <View style={[styles.pendingBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.pendingText, { color: colors.textMuted }]}>{mission.type}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Layout-only styles; all colors applied inline
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderWidth: 1, gap: Spacing.md,
  },
  iconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22 },
  content: { flex: 1, gap: 3 },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  description: { fontSize: FontSize.xs },
  expRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  expLabel: { fontSize: FontSize.xs },
  expValue: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  doneBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  doneIcon: { fontWeight: FontWeight.bold, fontSize: 14 },
  pendingBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.round, borderWidth: 1 },
  pendingText: { fontSize: 9, textTransform: 'capitalize' },
});
