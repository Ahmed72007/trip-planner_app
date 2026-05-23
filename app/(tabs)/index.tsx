import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTripStore } from '../../store/useTripStore';
import { useTheme } from '../../constants/useTheme';
import type { ThemeColors } from '../../constants/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Style Factory ────────────────────────────────────────────────────────────
function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: { padding: 20, paddingTop: 16 },
    header: { marginBottom: 28 },
    greeting: { fontSize: 32, fontWeight: '900', color: C.textPrimary, letterSpacing: -1 },
    subGreeting: { fontSize: 16, color: C.textSecondary, fontWeight: '600', marginTop: 5 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 28 },
    statCard: {
      flex: 1,
      backgroundColor: C.accent + '18',
      padding: 20, borderRadius: 25,
      alignItems: 'center',
      borderWidth: 2, borderColor: C.accent,
    },
    statNumber: { fontSize: 32, fontWeight: '900', color: C.textPrimary },
    statLabel: { fontSize: 12, color: C.accent, fontWeight: '800', textTransform: 'uppercase', marginTop: 5 },

    // Toggle Tabs
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: C.surface,
      borderRadius: 20, padding: 5,
      marginBottom: 25,
      borderWidth: 2, borderColor: C.border,
    },
    toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 15, alignItems: 'center' },
    toggleBtnActive: { backgroundColor: C.surfaceLight },
    toggleText: { color: C.textMuted, fontWeight: '800', fontSize: 14 },
    toggleTextActive: { color: C.textPrimary },

    section: { flex: 1 },

    // Trip Card
    card: {
      backgroundColor: C.surface,
      padding: 25, borderRadius: 30,
      borderWidth: 3, borderColor: C.border,
      marginBottom: 20,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: 26, fontWeight: '900', color: C.textPrimary, flex: 1 },
    cardEmoji: { fontSize: 28, marginLeft: 10 },
    cardSub: { fontSize: 16, color: C.accent, fontWeight: '800', marginTop: 15 },

    // Guide Card
    guideCard: {
      backgroundColor: C.surface,
      padding: 25, borderRadius: 30,
      borderWidth: 3, borderColor: C.success,
      marginBottom: 20,
    },
    guideTitle: { fontSize: 22, fontWeight: '900', color: C.textPrimary, flex: 1, lineHeight: 28 },
    guideCity: { fontSize: 14, color: C.success, fontWeight: '800', marginTop: 5, textTransform: 'uppercase' },
    guideDesc: { color: C.textSecondary, fontSize: 14, marginTop: 10, lineHeight: 20 },
    guideBadge: {
      backgroundColor: C.success + '22',
      alignSelf: 'flex-start',
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 10, marginTop: 15,
    },
    guideBadgeText: { color: C.success, fontWeight: '800', fontSize: 12 },

    emptyState: {
      alignItems: 'center', marginTop: 20, padding: 30,
      backgroundColor: C.surfaceLight,
      borderRadius: 30, borderWidth: 2,
      borderColor: C.border, borderStyle: 'dashed',
    },
    emptyEmoji: { fontSize: 60, marginBottom: 15 },
    emptyTitle: { color: C.textPrimary, fontSize: 22, fontWeight: '900', marginBottom: 10 },
    emptyText: { color: C.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const trips = useTripStore(s => s.trips);
  const guides = useTripStore(s => (s as any).guides || []);

  const [activeTab, setActiveTab] = useState<'trips' | 'guides'>('trips');
  const [isCheckingFirstLaunch, setIsCheckingFirstLaunch] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // await AsyncStorage.removeItem('@has_launched');
        const hasLaunched = await AsyncStorage.getItem('@has_launched');
        if (hasLaunched === null) {
          router.replace('/welcome');
        } else {
          setIsCheckingFirstLaunch(false);
        }
      } catch (error) {
        setIsCheckingFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isCheckingFirstLaunch) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const totalTrips = trips.length;
  const totalGuides = guides.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Ready to explore? 🌍</Text>
          <Text style={styles.subGreeting}>Your adventure dashboard</Text>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalGuides}</Text>
            <Text style={styles.statLabel}>Guides Published</Text>
          </View>
        </View>

        {/* TOGGLE TABS */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'trips' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('trips')}
          >
            <Text style={[styles.toggleText, activeTab === 'trips' && styles.toggleTextActive]}>My Trips 🧳</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'guides' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('guides')}
          >
            <Text style={[styles.toggleText, activeTab === 'guides' && styles.toggleTextActive]}>My Guides 📖</Text>
          </TouchableOpacity>
        </View>

        {/* LISTINGS */}
        <View style={styles.section}>

          {activeTab === 'trips' && (
            trips.length > 0 ? trips.map((trip) => (
              <TouchableOpacity key={trip.id} style={styles.card} onPress={() => router.push(`/trip/${trip.id}`)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{trip.city}</Text>
                  <Text style={styles.cardEmoji}>✈️</Text>
                </View>
                <Text style={styles.cardSub}>{trip.startDate} {trip.endDate !== 'TBD' ? `→ ${trip.endDate}` : ''}</Text>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎒</Text>
                <Text style={styles.emptyTitle}>No trips yet!</Text>
                <Text style={styles.emptyText}>Tap the + below to plan one.</Text>
              </View>
            )
          )}

          {activeTab === 'guides' && (
            guides.length > 0 ? guides.map((guide: any) => (
              <TouchableOpacity key={guide.id} style={styles.guideCard} activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.cardEmoji}>📍</Text>
                </View>
                <Text style={styles.guideCity}>{guide.city}</Text>
                <Text style={styles.guideDesc} numberOfLines={2}>{guide.description}</Text>
                <View style={styles.guideBadge}>
                  <Text style={styles.guideBadgeText}>{guide.places?.length || 0} Curated Spots</Text>
                </View>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📓</Text>
                <Text style={styles.emptyTitle}>No guides published</Text>
                <Text style={styles.emptyText}>Tap the + below to share your expertise.</Text>
              </View>
            )
          )}

        </View>
      </ScrollView>
    </View>
  );
}