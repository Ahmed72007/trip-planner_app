import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useTripStore } from '../../../store/useTripStore';
import { ExpenseCategory } from '../../../types/trip';
import { useTheme } from '../../../constants/useTheme';
import type { ThemeColors } from '../../../constants/useTheme';

const CATEGORIES: ExpenseCategory[] = ['food', 'transport', 'accommodation', 'activities', 'shopping', 'other'];
const CAT_ICONS: Record<string, string> = { food: '🍽️', transport: '🚗', accommodation: '🏨', activities: '🎯', shopping: '🛍️', other: '💸' };

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: { padding: 20 },
    loadingContainer: { flex: 1, backgroundColor: C.background, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: C.textMuted, marginTop: 15, fontWeight: 'bold' },
    totalCard: {
      backgroundColor: C.accent + '1A', borderRadius: 30, padding: 30, alignItems: 'center',
      borderWidth: 3, borderColor: C.accent, marginBottom: 20, marginTop: 60,
    },
    totalLabel: { fontSize: 14, color: C.textMuted, fontWeight: 'bold', textTransform: 'uppercase' },
    totalAmount: { fontSize: 48, fontWeight: '900', color: C.textPrimary, marginTop: 5 },
    perPerson: { fontSize: 14, color: C.textMuted, marginTop: 8 },
    addBtn: {
      backgroundColor: C.accent, borderRadius: 25, paddingVertical: 18,
      alignItems: 'center', borderWidth: 2, borderColor: C.border, marginBottom: 30
    },
    addBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: C.textPrimary, marginBottom: 15 },
    listSection: { gap: 12 },
    expenseItem: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
      padding: 15, borderRadius: 20, borderWidth: 2, borderColor: C.border, marginBottom: 10
    },
    iconBox: { width: 44, height: 44, borderRadius: 15, backgroundColor: C.surfaceLight, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
    itemIcon: { fontSize: 20 },
    itemDetails: { flex: 1 },
    itemNote: { color: C.textPrimary, fontSize: 16, fontWeight: '700' },
    badgeRow: { flexDirection: 'row', marginTop: 4 },
    sourceBadge: { color: C.accent, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
    amountBox: { alignItems: 'flex-end' },
    itemAmount: { color: C.success, fontSize: 18, fontWeight: '900' },
    deleteBtn: { marginTop: 8, fontSize: 16, opacity: 0.7 },
    emptyText: { color: C.textMuted, textAlign: 'center', marginTop: 20 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: C.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 3, borderColor: C.border, borderBottomWidth: 0 },
    modalTitle: { fontSize: 24, fontWeight: '900', color: C.textPrimary, marginBottom: 20 },
    input: { backgroundColor: C.background, borderRadius: 15, padding: 18, color: C.textPrimary, fontSize: 16, borderWidth: 2, borderColor: C.border, marginBottom: 15 },
    fieldLabel: { fontSize: 14, color: C.textMuted, fontWeight: 'bold', marginBottom: 10 },
    catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: C.background, borderRadius: 20, borderWidth: 2, borderColor: C.border, marginRight: 10 },
    catChipActive: { backgroundColor: C.accent + '33', borderColor: C.accent },
    catChipText: { color: C.textMuted, marginLeft: 5, fontWeight: '700' },
    catChipTextActive: { color: C.textPrimary },
    modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 30 },
    cancelBtn: { paddingVertical: 15, paddingHorizontal: 30 },
    cancelText: { color: C.textMuted, fontSize: 16, fontWeight: 'bold' },
    saveBtn: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 15 },
    saveText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  });
}

export default function ExpensesScreen() {
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const { trips, addExpense, removeExpense } = useTripStore();
  const trip = trips.find(t => t.id === tripId);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'food' as ExpenseCategory, note: '', paidBy: 'user_1' });

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.loadingText}>Loading Expenses...</Text>
      </View>
    );
  }

  const itineraryCosts = (trip.places || [])
    .filter(p => p.cost && p.cost > 0)
    .map(p => ({ id: `place-${p.id}`, category: 'activities' as ExpenseCategory, amount: p.cost, note: p.name, source: 'Itinerary' }));

  const arrangementCosts = (trip.arrangements || [])
    .filter(a => a.cost && a.cost > 0)
    .map(a => ({ id: `arr-${a.id}`, category: 'accommodation' as ExpenseCategory, amount: a.cost, note: a.title, source: 'Booking' }));

  const manualExpenses = (trip.expenses || []).map(e => ({ ...e, source: 'Manual' }));
  const allExpenses = [...itineraryCosts, ...arrangementCosts, ...manualExpenses];
  const total = allExpenses.reduce((a, e) => a + (Number(e.amount) || 0), 0);

  const handleAdd = () => {
    if (!form.amount || isNaN(parseFloat(form.amount))) { Alert.alert('Enter a valid amount'); return; }
    const memberIds = trip.members ? trip.members.map(m => m.id) : ['user_1'];
    addExpense(tripId, {
      amount: parseFloat(form.amount), currency: 'USD', category: form.category,
      paidBy: form.paidBy, splitBetween: memberIds,
      date: new Date().toISOString().split('T')[0], note: form.note,
    });
    setForm({ amount: '', category: 'food', note: '', paidBy: 'user_1' });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Trip Cost</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          {trip.members && trip.members.length > 1 && (
            <Text style={styles.perPerson}>~${(total / trip.members.length).toFixed(2)} per person</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Manual Expense</Text>
        </TouchableOpacity>
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>All Expenses</Text>
          {allExpenses.length > 0 ? (
            allExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.iconBox}><Text style={styles.itemIcon}>{CAT_ICONS[expense.category] || '💸'}</Text></View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemNote}>{expense.note || expense.category}</Text>
                  <View style={styles.badgeRow}><Text style={styles.sourceBadge}>{expense.source}</Text></View>
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.itemAmount}>${expense.amount.toFixed(2)}</Text>
                  {expense.source === 'Manual' && (
                    <TouchableOpacity onPress={() => removeExpense(tripId, expense.id as string)}>
                      <Text style={styles.deleteBtn}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No expenses yet. Add one or put costs in your itinerary!</Text>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>New Expense 💸</Text>
            <TextInput style={styles.input} placeholder="Amount (e.g. 45.00)" placeholderTextColor={colors.textMuted} value={form.amount} onChangeText={v => setForm(f => ({ ...f, amount: v }))} keyboardType="decimal-pad" />
            <TextInput style={styles.input} placeholder="What was it for?" placeholderTextColor={colors.textMuted} value={form.note} onChangeText={v => setForm(f => ({ ...f, note: v }))} />
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} style={[styles.catChip, form.category === cat && styles.catChipActive]} onPress={() => setForm(f => ({ ...f, category: cat }))}>
                  <Text>{CAT_ICONS[cat]}</Text>
                  <Text style={[styles.catChipText, form.category === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}