import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';
import { getCurrentRank, getNextRank, getRankProgress } from '../utils/missions';

interface RankBarProps {
  exp: number;
  onPress?: () => void;
}

export function RankBar({ exp, onPress }: RankBarProps) {
  const { colors } = useTheme();
  const currentRank = getCurrentRank(exp);
  const nextRank = getNextRank(exp);
  const progress = getRankProgress(exp);

  const animatedWidth = useSharedValue(0);
  React.useEffect(() => {
    animatedWidth.value = withTiming(progress, { duration: 1000, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({ width: `${animatedWidth.value * 100}%` }));

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.rankRow}>
        <View style={styles.rankLeft}>
          <Text style={styles.rankIcon}>{currentRank.icon}</Text>
          <View>
            <Text style={[styles.rankName, { color: currentRank.color }]}>{currentRank.name}</Text>
            <Text style={[styles.exp, { color: colors.textSecondary }]}>{exp} EXP total</Text>
          </View>
        </View>
        {nextRank && (
          <View style={styles.nextRank}>
            <Text style={[styles.nextLabel, { color: colors.textMuted }]}>Next: {nextRank.name}</Text>
            <Text style={styles.nextIcon}>{nextRank.icon}</Text>
          </View>
        )}
        {!nextRank && (
          <View style={[styles.maxBadge, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.maxText, { color: colors.accent }]}>MAX RANK 🏆</Text>
          </View>
        )}
      </View>

      <View style={[styles.barTrack, { backgroundColor: colors.surface }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: currentRank.color }, barStyle]} />
      </View>

      {nextRank && (
        <View style={styles.labelsRow}>
          <Text style={[styles.labelText, { color: colors.textMuted }]}>{currentRank.minExp} EXP</Text>
          <Text style={[styles.labelText, { color: colors.textMuted }]}>{nextRank.minExp} EXP</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: BorderRadius.xl, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rankIcon: { fontSize: 28 },
  rankName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  exp: { fontSize: FontSize.xs },
  nextRank: { alignItems: 'flex-end', gap: 2 },
  nextLabel: { fontSize: FontSize.xs },
  nextIcon: { fontSize: 20 },
  maxBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.round },
  maxText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  barTrack: { height: 8, borderRadius: BorderRadius.round, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: BorderRadius.round },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  labelText: { fontSize: 10 },
});
