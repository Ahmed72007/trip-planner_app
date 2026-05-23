import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { JournalEntry as JournalEntryType } from '../types/trip';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface JournalEntryProps {
  entry: JournalEntryType;
  isLast?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
}

const MOOD_ICONS: Record<string, string> = {
  amazing: '🤩',
  good: '😊',
  okay: '😐',
  bad: '😔',
};

export function JournalEntryCard({ entry, isLast, onPress, onDelete }: JournalEntryProps) {
  const moodIcon = entry.mood ? MOOD_ICONS[entry.mood] : null;

  return (
    <View style={styles.wrapper}>
      {/* Timeline connector */}
      <View style={styles.timeline}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.date}>{entry.date}</Text>
            {moodIcon && <Text style={styles.mood}>{moodIcon}</Text>}
          </View>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Text */}
        <Text style={styles.text} numberOfLines={4}>{entry.text}</Text>

        {/* Images */}
        {entry.images.length > 0 && (
          <View style={styles.imagesGrid}>
            {entry.images.slice(0, 3).map((img, idx) => (
              <View key={idx} style={[styles.imageWrapper, entry.images.length === 1 && styles.imageFull]}>
                <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
                {idx === 2 && entry.images.length > 3 && (
                  <View style={styles.moreOverlay}>
                    <Text style={styles.moreText}>+{entry.images.length - 3}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  timeline: {
    alignItems: 'center',
    width: 24,
    paddingTop: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.accentDark,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  date: { fontSize: FontSize.xs, color: Colors.textSecondary },
  mood: { fontSize: 16 },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 13, color: Colors.textMuted },
  text: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  imagesGrid: {
    flexDirection: 'row',
    gap: Spacing.xs,
    height: 100,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  imageFull: { flex: 1 },
  image: { width: '100%', height: '100%' },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.lg,
  },
});
