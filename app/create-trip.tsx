import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTripStore } from '../store/useTripStore';
import { supabase } from '../lib/supabase';
import { OSMPlacesInput } from '../components/OSMPlacesInput';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../constants/useTheme';
import type { ThemeColors } from '../constants/useTheme';

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    inner: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    backBtn: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: C.surfaceLight,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 2, borderColor: C.border,
    },
    backArrow: { color: C.textPrimary, fontSize: 20, fontWeight: 'bold' },
    content: { flex: 1, padding: 30, justifyContent: 'center' },
    title: { fontSize: 36, fontWeight: '900', color: C.textPrimary, marginBottom: 10, letterSpacing: -1 },
    subtitle: { fontSize: 18, color: C.textSecondary, fontWeight: '600', marginBottom: 40 },
    form: { marginBottom: 40 },
    label: { color: C.textSecondary, fontWeight: 'bold', marginBottom: 10, marginLeft: 5, fontSize: 14, textTransform: 'uppercase' },
    dateSelectorBtn: {
      backgroundColor: C.surfaceLight, borderRadius: 20, padding: 20,
      borderWidth: 2, borderColor: C.border,
      flexDirection: 'row', alignItems: 'center',
    },
    dateSelectorIcon: { fontSize: 20, marginRight: 15 },
    dateSelectorTextPlaceholder: { color: C.textMuted, fontSize: 18, fontWeight: '600' },
    dateSelectorTextActive: { color: C.textPrimary, fontSize: 18, fontWeight: '700' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalSheet: {
      backgroundColor: C.surface,
      borderTopLeftRadius: 30, borderTopRightRadius: 30,
      paddingBottom: 40, overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 25, borderBottomWidth: 1, borderBottomColor: C.divider,
    },
    modalTitle: { color: C.textPrimary, fontSize: 20, fontWeight: '900' },
    closeModalText: { color: C.accent, fontSize: 16, fontWeight: 'bold' },
    createBtn: {
      backgroundColor: C.accent, paddingVertical: 20, borderRadius: 25,
      alignItems: 'center', borderWidth: 3, borderColor: C.surfaceLight,
      shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 15,
    },
    createBtnDisabled: { backgroundColor: C.border, shadowOpacity: 0 },
    createBtnText: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  });
}

export default function CreateTripScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isOnboarding } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const addTrip = useTripStore(s => (s as any).addTrip);

  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString); setEndDate('');
    } else if (startDate && !endDate) {
      const end = new Date(day.dateString);
      if (end > new Date(startDate)) {
        setEndDate(day.dateString);
        setTimeout(() => setShowCalendar(false), 500);
      } else {
        setStartDate(day.dateString);
      }
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    if (startDate) marked[startDate] = { startingDay: true, color: colors.accent, textColor: '#FFF' };
    if (endDate) {
      marked[endDate] = { endingDay: true, color: colors.accent, textColor: '#FFF' };
      let curr = new Date(startDate);
      curr.setDate(curr.getDate() + 1);
      const end = new Date(endDate);
      while (curr < end) {
        const dateStr = curr.toISOString().split('T')[0];
        marked[dateStr] = { color: colors.accent + '40', textColor: colors.textPrimary };
        curr.setDate(curr.getDate() + 1);
      }
    }
    return marked;
  };

  const formatDateForUI = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCreateTrip = async () => {
    if (!city.trim()) return;
    let totalDays = 3;
    if (startDate && endDate) {
      const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
      totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    const baseTrip = {
      city: city.trim(), country: '',
      startDate: formatDateForUI(startDate) || 'TBD',
      endDate: formatDateForUI(endDate) || 'TBD',
      days: totalDays,
      members: [{ id: 'user_1', name: 'Me' }],
      preferences: [], places: [], arrangements: [], expenses: [], journal: [],
    };
    let finalTripId;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase.from('trips').insert([{
        user_id: user.id, city: baseTrip.city, days: baseTrip.days, itinerary_json: baseTrip
      }]).select();
      if (error) { Alert.alert("Cloud Error", "Could not save to our servers."); console.error(error); return; }
      finalTripId = data[0].id;
      addTrip({ id: finalTripId, ...baseTrip });
    } else {
      finalTripId = `trip_${Date.now()}`;
      addTrip({ id: finalTripId, ...baseTrip });
    }
    if (isOnboarding === 'true') {
      router.replace({ pathname: '/trip/[tripId]', params: { tripId: finalTripId, isOnboarding: 'true' } });
    } else {
      router.replace(`/trip/${finalTripId}`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Where to next? 🌍</Text>
          <Text style={styles.subtitle}>Let's sketch out a new adventure.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Destination City</Text>
            <View style={{ zIndex: 10 }}>
              <OSMPlacesInput
                placeholder="e.g. Tokyo, Paris, New York..."
                type="city"
                onSelect={(data) => setCity(data.name)}
              />
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Trip Dates</Text>
            <TouchableOpacity style={styles.dateSelectorBtn} onPress={() => setShowCalendar(true)}>
              <Text style={styles.dateSelectorIcon}>🗓️</Text>
              <Text style={startDate ? styles.dateSelectorTextActive : styles.dateSelectorTextPlaceholder}>
                {startDate && endDate
                  ? `${formatDateForUI(startDate)}  →  ${formatDateForUI(endDate)}`
                  : startDate
                    ? `${formatDateForUI(startDate)}  →  Select End Date`
                    : 'Tap to select your dates'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.createBtn, !city.trim() && styles.createBtnDisabled]}
            onPress={handleCreateTrip}
            disabled={!city.trim()}
          >
            <Text style={styles.createBtnText}>Start Doodle Plan ✨</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showCalendar} animationType="slide" transparent={true}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Dates</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Text style={styles.closeModalText}>Done</Text>
                </TouchableOpacity>
              </View>
              <Calendar
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={onDayPress}
                theme={{
                  backgroundColor: colors.surface,
                  calendarBackground: colors.surface,
                  textSectionTitleColor: colors.textSecondary,
                  selectedDayBackgroundColor: colors.accent,
                  selectedDayTextColor: '#FFF',
                  todayTextColor: colors.success,
                  dayTextColor: colors.textPrimary,
                  textDisabledColor: colors.textMuted,
                  monthTextColor: colors.textPrimary,
                  arrowColor: colors.accent,
                  textDayFontWeight: '600',
                  textMonthFontWeight: 'bold',
                }}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}