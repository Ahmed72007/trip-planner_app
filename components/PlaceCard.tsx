import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Place } from '../types/trip';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';
import { CategoryColors } from '../constants/theme';

interface PlaceCardProps {
  place: Place;
  onPress?: () => void;
  onDelete?: () => void;
  showDay?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PlaceCard({ place, onPress, onDelete, showDay }: PlaceCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const categoryColor = CategoryColors[place.category || 'other'] || Colors.accent;

  return (
    <AnimatedTouchable
      style={[animatedStyle, styles.container]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      activeOpacity={1}
    >
      <View style={[styles.colorBar, { backgroundColor: categoryColor }]} />
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{place.image || '📍'}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          {place.cost > 0 && (
            <Text style={styles.cost}>${place.cost}</Text>
          )}
        </View>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🕐</Text>
            <Text style={styles.metaText}>{place.time}</Text>
          </View>
          {place.duration && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱</Text>
              <Text style={styles.metaText}>{place.duration}min</Text>
            </View>
          )}
          {showDay && (
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>Day {place.dayIndex + 1}</Text>
            </View>
          )}
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {place.category || 'other'}
            </Text>
          </View>
        </View>
        {place.notes && (
          <Text style={styles.notes} numberOfLines={2}>{place.notes}</Text>
        )}
        {place.addedBy === 'ai' && (
          <View style={styles.aiBadge}>
            <Text style={styles.aiText}>✨ AI Suggested</Text>
          </View>
        )}
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorBar: {
    width: 4,
  },
  emojiContainer: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  emoji: { fontSize: 22 },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  cost: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mint,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaIcon: { fontSize: 11 },
  metaText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  categoryText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, textTransform: 'capitalize' },
  notes: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  aiText: { fontSize: 10, color: Colors.accentLight },
  deleteBtn: {
    padding: Spacing.md,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: { fontSize: 14, color: Colors.textMuted },
});
