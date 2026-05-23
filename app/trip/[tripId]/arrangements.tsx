import React, { useState, useMemo } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, Linking, Image } from 'react-native';
import { useTripStore } from '../../../store/useTripStore';
import { OSMPlacesInput } from '../../../components/OSMPlacesInput';
import { TripScreenWrapper } from '../../../components/TripScreenWrapper';
import { useTheme } from '../../../constants/useTheme';
import type { ThemeColors } from '../../../constants/useTheme';

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    section: { marginBottom: 35 },
    sectionTitle: { color: C.textPrimary, fontSize: 24, fontWeight: '900', marginBottom: 15 },
    card: { flexDirection: 'row', backgroundColor: C.surface, padding: 15, borderRadius: 20, borderWidth: 2, borderColor: C.border, marginBottom: 12 },
    iconBox: { width: 48, height: 48, backgroundColor: C.surfaceLight, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
    icon: { fontSize: 24 },
    cardDetails: { flex: 1, justifyContent: 'center' },
    cardTitle: { color: C.textPrimary, fontSize: 18, fontWeight: '800' },
    cardNote: { color: C.textSecondary, fontSize: 14, marginTop: 4, fontWeight: '500' },
    costBadge: { backgroundColor: C.success + '1A', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
    costText: { color: C.success, fontSize: 12, fontWeight: '800' },
    emptyText: { color: C.textMuted, fontStyle: 'italic', marginBottom: 10, marginLeft: 5 },
    addBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: C.border, borderRadius: 20, padding: 15, alignItems: 'center', marginTop: 5 },
    addBtnText: { color: C.textSecondary, fontWeight: '700', fontSize: 16 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: C.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 3, borderColor: C.border, borderBottomWidth: 0, maxHeight: '90%' },
    modalTitle: { fontSize: 24, fontWeight: '900', color: C.textPrimary, marginBottom: 20 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    typeBtn: { flex: 1, paddingVertical: 15, borderRadius: 15, borderWidth: 2, borderColor: C.border, alignItems: 'center', backgroundColor: C.background },
    typeBtnActive: { borderColor: C.accent, backgroundColor: C.accent + '26' },
    typeBtnText: { color: C.textSecondary, fontWeight: '700', fontSize: 16 },
    typeBtnTextActive: { color: C.accent, fontWeight: '900' },
    fieldLabel: { color: C.textMuted, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
    input: { backgroundColor: C.background, borderRadius: 15, padding: 18, color: C.textPrimary, fontSize: 16, borderWidth: 2, borderColor: C.border, marginBottom: 20 },
    modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 20 },
    cancelBtn: { paddingVertical: 15, paddingHorizontal: 30 },
    cancelText: { color: C.textMuted, fontSize: 16, fontWeight: 'bold' },
    saveBtn: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 30, paddingVertical: 15 },
    saveText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  });
}

export default function ArrangementsScreen() {
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const trips = useTripStore(s => s.trips);
  const updateTrip = useTripStore(s => (s as any).updateTrip);
  const trip = trips.find(t => t.id === tripId);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<'transport' | 'hotel'>('transport');
  const [formTitle, setFormTitle] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formCost, setFormCost] = useState('');

  if (!trip) return null;

  const arrangements = trip.arrangements || [];
  const flights = arrangements.filter((a: any) => a.type === 'transport');
  const hotels = arrangements.filter((a: any) => a.type === 'hotel');

  const openModal = (type: 'transport' | 'hotel') => {
    setFormType(type); setFormTitle(''); setFormNotes(''); setFormCost(''); setModalVisible(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;
    const newArrangement = {
      id: Date.now().toString(), type: formType,
      title: formTitle.trim(), notes: formNotes.trim(), cost: parseFloat(formCost) || 0,
    };
    if (updateTrip) updateTrip(tripId, { arrangements: [...arrangements, newArrangement] });
    setModalVisible(false);
  };

  const renderCard = (item: any, icon: string) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.iconBox}><Text style={styles.icon}>{icon}</Text></View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardNote}>{item.notes || 'No notes added'}</Text>
        {item.cost && item.cost > 0 ? (
          <View style={styles.costBadge}><Text style={styles.costText}>${item.cost} (Synced to Expenses)</Text></View>
        ) : null}
      </View>
    </View>
  );

  return (
    <TripScreenWrapper tripId={tripId as string}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flights & Travel ✈️</Text>
        {flights.length > 0 ? flights.map((f: any) => renderCard(f, '🛫')) : (
          <Text style={styles.emptyText}>No transport booked yet.</Text>
        )}
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal('transport')}>
          <Text style={styles.addBtnText}>+ Add Flight / Train</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hotels & Stays 🏨</Text>
        {hotels.length > 0 ? hotels.map((h: any) => renderCard(h, '🛏️')) : (
          <Text style={styles.emptyText}>No accommodation booked yet.</Text>
        )}
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal('hotel')}>
          <Text style={styles.addBtnText}>+ Add Stay</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>New Booking 🎫</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeBtn, formType === 'transport' && styles.typeBtnActive]} onPress={() => setFormType('transport')}>
                <Text style={[styles.typeBtnText, formType === 'transport' && styles.typeBtnTextActive]}>✈️ Transport</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, formType === 'hotel' && styles.typeBtnActive]} onPress={() => setFormType('hotel')}>
                <Text style={[styles.typeBtnText, formType === 'hotel' && styles.typeBtnTextActive]}>🏨 Stay</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>Name / Title</Text>
            <View style={{ zIndex: 10 }}>
              <OSMPlacesInput
                placeholder={formType === 'transport' ? "e.g. JFK Airport, Delta..." : "e.g. The Ritz-Carlton"}
                onSelect={(data) => setFormTitle(data.name)}
                type="establishment"
              />
            </View>
            <Text style={styles.fieldLabel}>Confirmation # / Notes</Text>
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Booking ref, address, or times..." placeholderTextColor={colors.textMuted} value={formNotes} onChangeText={setFormNotes} multiline textAlignVertical="top" />
            <Text style={styles.fieldLabel}>Cost ($) - Auto-Syncs to Expenses!</Text>
            <TextInput style={styles.input} placeholder="e.g. 450.00" placeholderTextColor={colors.textMuted} value={formCost} onChangeText={setFormCost} keyboardType="decimal-pad" />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Save Booking</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </TripScreenWrapper>
  );
}