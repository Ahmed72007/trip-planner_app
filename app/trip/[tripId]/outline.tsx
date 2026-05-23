import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useTripStore } from '../../../store/useTripStore';
import { TripScreenWrapper } from '../../../components/TripScreenWrapper';
import { useTheme } from '../../../constants/useTheme';
import type { ThemeColors } from '../../../constants/useTheme';
import * as Linking from 'expo-linking';

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    heroCard: {
      alignItems: 'center',
      backgroundColor: C.surface,
      padding: 30, borderRadius: 30,
      borderWidth: 3, borderColor: C.accent,
      marginBottom: 20,
    },
    heroEmoji: { fontSize: 50, marginBottom: 10 },
    heroCity: { fontSize: 28, fontWeight: '900', color: C.textPrimary },
    heroCountry: { fontSize: 16, color: C.textSecondary, marginTop: 5, fontWeight: '700' },
    heroDates: { fontSize: 14, color: C.accent, marginTop: 10, fontWeight: 'bold' },
    shareBtn: {
      backgroundColor: C.accent + '22',
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      paddingVertical: 18, borderRadius: 20,
      borderWidth: 2, borderColor: C.accent,
      marginBottom: 30,
    },
    shareIcon: { fontSize: 20, marginRight: 10 },
    shareText: { color: C.accent, fontSize: 18, fontWeight: '900' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 30 },
    statCard: {
      flex: 1, minWidth: '40%',
      backgroundColor: C.surfaceLight,
      borderRadius: 20, padding: 20, alignItems: 'center',
      borderWidth: 2, borderColor: C.border,
    },
    statIcon: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 24, fontWeight: '900', color: C.textPrimary },
    statLabel: { fontSize: 12, color: C.textSecondary, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: C.textPrimary, marginBottom: 15 },
    memberRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: C.surface,
      padding: 15, borderRadius: 20,
      borderWidth: 2, borderColor: C.border,
      marginBottom: 10,
    },
    memberAvatar: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: C.accent + '30',
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 2, borderColor: C.accent,
      marginRight: 15,
    },
    memberAvatarText: { color: C.textPrimary, fontWeight: '900', fontSize: 18 },
    memberName: { fontSize: 18, fontWeight: '700', color: C.textPrimary, flex: 1 },
    hostBadge: {
      backgroundColor: C.surfaceLight,
      color: C.textSecondary,
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 10, overflow: 'hidden',
      fontWeight: '800', fontSize: 12,
    },
  });
}

export default function OutlineScreen() {
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const trip = useTripStore(s => s.trips.find(t => t.id === tripId));
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!trip) return null;

  const totalCost = (trip.expenses || []).reduce((a: any, e: any) => a + (e.amount || 0), 0);
  const totalPlaces = trip.places?.length || 0;

  const handleShareTrip = async () => {
    try {
      const inviteUrl = Linking.createURL(`/join/${tripId}`);
      await Share.share({
        message: `Pack your bags! We're going to ${trip.city}. Tap here to join the squad and see the itinerary: ${inviteUrl}`,
        url: Platform.OS === 'ios' ? inviteUrl : undefined,
        title: `Join my trip to ${trip.city}!`,
      });
    } catch (error: any) {
      console.error('Share failed:', error.message);
    }
  };

  return (
    <TripScreenWrapper tripId={tripId as string}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>✈️</Text>
        <Text style={styles.heroCity}>{trip.city}</Text>
        {trip.country && <Text style={styles.heroCountry}>{trip.country}</Text>}
        <Text style={styles.heroDates}>{trip.startDate} → {trip.endDate}</Text>
      </View>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShareTrip}>
        <Text style={styles.shareIcon}>🔗</Text>
        <Text style={styles.shareText}>Invite Friends</Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        {[
          { label: 'Days', value: trip.days, icon: '📅' },
          { label: 'Places', value: totalPlaces, icon: '📍' },
          { label: 'Members', value: trip.members?.length || 1, icon: '👥' },
          { label: 'Expenses', value: `$${totalCost.toFixed(0)}`, icon: '💰' },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Squad</Text>
        {(trip.members || []).map((member: any, index: number) => (
          <View key={member.id} style={styles.memberRow}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>{member.name[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.memberName}>{member.name}</Text>
            {index === 0 && <Text style={styles.hostBadge}>Host</Text>}
          </View>
        ))}
      </View>
    </TripScreenWrapper>
  );
}