import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '../types/trip';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing, CategoryColors } from '../constants/theme';

interface ExpenseItemProps {
  expense: Expense;
  memberNames?: Record<string, string>;
  onPress?: () => void;
  onDelete?: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍽️',
  transport: '🚗',
  accommodation: '🏨',
  activities: '🎯',
  shopping: '🛍️',
  other: '💸',
};

export function ExpenseItem({ expense, memberNames = {}, onPress, onDelete }: ExpenseItemProps) {
  const catColor = CategoryColors[expense.category] || Colors.accent;
  const catIcon = CATEGORY_ICONS[expense.category] || '💸';
  const paidByName = memberNames[expense.paidBy] || expense.paidBy;
  const splitCount = expense.splitBetween.length;
  const perPerson = splitCount > 1 ? (expense.amount / splitCount).toFixed(2) : null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconBox, { backgroundColor: catColor + '20' }]}>
        <Text style={styles.icon}>{catIcon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.note} numberOfLines={1}>{expense.note || 'Expense'}</Text>
          <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.meta}>Paid by {paidByName}</Text>
          {perPerson && (
            <Text style={styles.split}>${perPerson}/person</Text>
          )}
        </View>
        <View style={styles.row}>
          <View style={[styles.badge, { backgroundColor: catColor + '15' }]}>
            <Text style={[styles.badgeText, { color: catColor }]}>{expense.category}</Text>
          </View>
          <Text style={styles.date}>{expense.date}</Text>
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  content: { flex: 1, gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  note: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.mint,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  split: {
    fontSize: FontSize.xs,
    color: Colors.amber,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  deleteBtn: { padding: Spacing.xs },
  deleteIcon: { fontSize: 14, color: Colors.textMuted },
});
