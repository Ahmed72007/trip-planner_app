import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '../../store/useTripStore';
import { useUserStore } from '../../store/useUserStore';
import { generateItinerary } from '../../utils/ai';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, PreferenceColors } from '../../constants/theme';
import { TripPreference } from '../../types/trip';

const PREFERENCES: { id: TripPreference; emoji: string; label: string }[] = [
  { id: 'adventure', emoji: '⛰️', label: 'Adventure' },
  { id: 'food', emoji: '🍽️', label: 'Food' },
  { id: 'culture', emoji: '🎭', label: 'Culture' },
  { id: 'nature', emoji: '🌿', label: 'Nature' },
  { id: 'nightlife', emoji: '🌙', label: 'Nightlife' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping' },
  { id: 'relaxation', emoji: '🧘', label: 'Relax' },
  { id: 'photography', emoji: '📸', label: 'Photos' },
  { id: 'history', emoji: '🏛️', label: 'History' },
  { id: 'art', emoji: '🎨', label: 'Art' },
];

const POPULAR_CITIES = ['Paris', 'Tokyo', 'New York', 'London', 'Rome', 'Dubai', 'Barcelona', 'Bali'];

export default function CreateTripScreen() {
  const router = useRouter();
  const { addTrip, addPlaces } = useTripStore();
  const { checkAndCompleteMissions, addExp } = useUserStore();

  const [step, setStep] = useState(1);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [days, setDays] = useState(3);
  const [prefs, setPrefs] = useState<TripPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const togglePref = (pref: TripPreference) => {
    setPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleGenerate = async () => {
    if (!city.trim()) {
      Alert.alert('Missing city', 'Please enter a destination city.');
      return;
    }
    setLoading(true);
    try {
      const tripId = addTrip({
        title: `${city} Adventure`,
        city: city.trim(),
        country: country.trim() || '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + days * 86400000).toISOString().split('T')[0],
        days,
        preferences: prefs,
        members: [{ id: 'user_1', name: 'You' }],
      });

      if (useAI) {
        const result = await generateItinerary(city, days, prefs);
        addPlaces(tripId, result.places);
      }

      // Gamification: complete missions
      checkAndCompleteMissions('create_trip', 1);

      router.replace(`/trip/${tripId}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan a Trip</Text>
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map(s => (
            <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Destination */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 1</Text>
          <Text style={styles.stepTitle}>Where to? 🌍</Text>

          <TextInput
            style={styles.input}
            placeholder="City (e.g. Paris)"
            placeholderTextColor={Colors.textMuted}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Country (optional)"
            placeholderTextColor={Colors.textMuted}
            value={country}
            onChangeText={setCountry}
          />

          {/* Popular cities */}
          <Text style={styles.popularLabel}>Popular destinations</Text>
          <View style={styles.cityGrid}>
            {POPULAR_CITIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.cityTag, city === c && styles.cityTagActive]}
                onPress={() => setCity(c)}
              >
                <Text style={[styles.cityTagText, city === c && styles.cityTagTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Duration */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 2</Text>
          <Text style={styles.stepTitle}>How many days? 📅</Text>

          <View style={styles.daysRow}>
            <TouchableOpacity
              style={styles.dayBtn}
              onPress={() => setDays(d => Math.max(1, d - 1))}
            >
              <Text style={styles.dayBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.daysDisplay}>
              <Text style={styles.daysNum}>{days}</Text>
              <Text style={styles.daysLabel}>{days === 1 ? 'day' : 'days'}</Text>
            </View>
            <TouchableOpacity
              style={styles.dayBtn}
              onPress={() => setDays(d => Math.min(30, d + 1))}
            >
              <Text style={styles.dayBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Quick day presets */}
          <View style={styles.presetRow}>
            {[2, 3, 5, 7, 10, 14].map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.presetBtn, days === d && styles.presetBtnActive]}
                onPress={() => setDays(d)}
              >
                <Text style={[styles.presetText, days === d && styles.presetTextActive]}>{d}d</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 3: Preferences */}
        <View style={styles.stepSection}>
          <Text style={styles.stepLabel}>Step 3</Text>
          <Text style={styles.stepTitle}>What's your vibe? ✨</Text>
          <Text style={styles.stepSubtitle}>Select all that interest you</Text>

          <View style={styles.prefGrid}>
            {PREFERENCES.map(pref => {
              const active = prefs.includes(pref.id);
              const color = PreferenceColors[pref.id] || Colors.accent;
              return (
                <TouchableOpacity
                  key={pref.id}
                  style={[styles.prefTag, active && { backgroundColor: color + '25', borderColor: color }]}
                  onPress={() => togglePref(pref.id)}
                >
                  <Text style={styles.prefEmoji}>{pref.emoji}</Text>
                  <Text style={[styles.prefLabel, active && { color }]}>{pref.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* AI Toggle */}
        <View style={styles.aiToggleCard}>
          <View style={styles.aiToggleLeft}>
            <Text style={styles.aiToggleIcon}>✨</Text>
            <View>
              <Text style={styles.aiToggleTitle}>AI Itinerary</Text>
              <Text style={styles.aiToggleDesc}>Auto-generate places & schedule</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.aiToggleSwitch, useAI && styles.aiToggleSwitchOn]}
            onPress={() => setUseAI(!useAI)}
          >
            <Text style={styles.aiToggleSwitchText}>{useAI ? 'ON' : 'OFF'}</Text>
          </TouchableOpacity>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateBtn, loading && styles.generateBtnLoading]}
          onPress={handleGenerate}
          disabled={loading || !city.trim()}
          activeOpacity={0.85}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={Colors.textPrimary} />
              <Text style={styles.generateText}>Generating your trip…</Text>
            </View>
          ) : (
            <Text style={styles.generateText}>
              {useAI ? '✨ Generate AI Itinerary' : '→ Create Trip'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 16, color: Colors.textSecondary },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  stepIndicator: { flexDirection: 'row', gap: 6 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surfaceLight },
  stepDotActive: { backgroundColor: Colors.accent },
  scroll: { flex: 1 },
  content: { padding: Spacing.xl, gap: Spacing.xxl },
  stepSection: { gap: Spacing.md },
  stepLabel: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: FontWeight.bold, letterSpacing: 1.5, textTransform: 'uppercase' },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.textPrimary },
  stepSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: -Spacing.sm },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cityTag: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.round,
    borderWidth: 1, borderColor: Colors.border,
  },
  cityTagActive: { backgroundColor: Colors.accent + '25', borderColor: Colors.accent },
  cityTagText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  cityTagTextActive: { color: Colors.accentLight, fontWeight: FontWeight.semibold },
  daysRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xxl },
  dayBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  dayBtnText: { fontSize: FontSize.xxl, color: Colors.textPrimary },
  daysDisplay: { alignItems: 'center' },
  daysNum: { fontSize: 56, fontWeight: FontWeight.heavy, color: Colors.accent, lineHeight: 64 },
  daysLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  presetRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  presetBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.round,
    borderWidth: 1, borderColor: Colors.border,
  },
  presetBtnActive: { backgroundColor: Colors.accent + '25', borderColor: Colors.accent },
  presetText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  presetTextActive: { color: Colors.accentLight, fontWeight: FontWeight.semibold },
  prefGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  prefTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.round,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  prefEmoji: { fontSize: 16 },
  prefLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, textTransform: 'capitalize' },
  aiToggleCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, justifyContent: 'space-between',
    borderWidth: 1, borderColor: Colors.border,
  },
  aiToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  aiToggleIcon: { fontSize: 24 },
  aiToggleTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  aiToggleDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },
  aiToggleSwitch: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.round,
    borderWidth: 1, borderColor: Colors.border,
  },
  aiToggleSwitchOn: { backgroundColor: Colors.accent + '25', borderColor: Colors.accent },
  aiToggleSwitchText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  generateBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  generateBtnLoading: { opacity: 0.75 },
  loadingRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  generateText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
});
