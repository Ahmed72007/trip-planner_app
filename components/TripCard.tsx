import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Trip } from '../types/trip';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface TripCardProps {
  trip: Trip;
}

const CITY_EMOJIS: Record<string, string> = {
  paris: '🗼', tokyo: '🗾', 'new york': '🗽', london: '🎡', rome: '🏛️', dubai: '🌇',
  default: '✈️',
};

const GRADIENT_COLORS = [
  ['#7C6EF6', '#4ECDC4'],
  ['#FF6B6B', '#FFB74D'],
  ['#4ECDC4', '#64B5F6'],
  ['#F48FB1', '#7C6EF6'],
  ['#AED581', '#4ECDC4'],
];

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const cityKey = trip.city.toLowerCase();
  const emoji = CITY_EMOJIS[cityKey] || CITY_EMOJIS.default;
  const gradientIdx = trip.id.charCodeAt(0) % GRADIENT_COLORS.length;
  const [color1, color2] = GRADIENT_COLORS[gradientIdx];

  const totalCost = trip.expenses.reduce((acc, e) => acc + e.amount, 0);
  const daysUntil = Math.ceil((new Date(trip.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push(`/trip/${trip.id}`)}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        activeOpacity={1}
      >
        {/* Top color banner */}
        <View style={[styles.banner, { backgroundColor: color1 }]}>
          <Text style={styles.bannerEmoji}>{emoji}</Text>
          <View style={styles.bannerOverlay}>
            <Text style={styles.city}>{trip.city}</Text>
            <Text style={styles.country}>{trip.country}</Text>
          </View>
          <View style={styles.daysBadge}>
            <Text style={styles.daysText}>{trip.days}d</Text>
          </View>
        </View>

        {/* Bottom info */}
        <View style={styles.info}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.dates}>{trip.startDate} → {trip.endDate}</Text>
            </View>
            {daysUntil > 0 && (
              <View style={styles.countdown}>
                <Text style={styles.countdownNum}>{daysUntil}</Text>
                <Text style={styles.countdownLabel}>days away</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>📍</Text>
              <Text style={styles.statText}>{trip.places.length} places</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>💰</Text>
              <Text style={styles.statText}>${totalCost.toFixed(0)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>👥</Text>
              <Text style={styles.statText}>{trip.members.length} people</Text>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.prefs}>
            {trip.preferences.slice(0, 3).map(pref => (
              <View key={pref} style={styles.prefBadge}>
                <Text style={styles.prefText}>{pref}</Text>
              </View>
            ))}
            {trip.preferences.length > 3 && (
              <Text style={styles.morePref}>+{trip.preferences.length - 3}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  banner: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  bannerEmoji: { fontSize: 40 },
  bannerOverlay: { flex: 1 },
  city: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.textPrimary,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  country: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  daysBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  daysText: { color: Colors.textPrimary, fontWeight: FontWeight.bold, fontSize: FontSize.md },
  info: { padding: Spacing.lg, gap: Spacing.md },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tripTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  dates: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  countdown: { alignItems: 'flex-end' },
  countdownNum: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.accent },
  countdownLabel: { fontSize: 10, color: Colors.textMuted },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statEmoji: { fontSize: 13 },
  statText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  prefs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  prefBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  prefText: { fontSize: 10, color: Colors.accentLight, textTransform: 'capitalize' },
  morePref: { fontSize: 10, color: Colors.textMuted, alignSelf: 'center' },
});
