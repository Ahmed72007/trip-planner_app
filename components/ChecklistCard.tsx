import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Checklist } from '../types/trip';
import { useTheme } from '../constants/useTheme';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../constants/theme';

interface ChecklistCardProps {
  checklist: Checklist;
  onToggleItem: (itemId: string) => void;
  onAddItem: (text: string) => void;
  onDeleteItem: (itemId: string) => void;
  onDelete?: () => void;
}

export function ChecklistCard({ checklist, onToggleItem, onAddItem, onDeleteItem, onDelete }: ChecklistCardProps) {
  const { colors } = useTheme();
  const [newItemText, setNewItemText] = useState('');
  const [expanded, setExpanded] = useState(true);

  const completedCount = checklist.items.filter(i => i.completed).length;
  const total = checklist.items.length;
  const progress = total > 0 ? completedCount / total : 0;

  const handleAdd = () => {
    if (newItemText.trim()) { onAddItem(newItemText.trim()); setNewItemText(''); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{checklist.icon || '📋'}</Text>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{checklist.title}</Text>
            <Text style={[styles.count, { color: colors.textSecondary }]}>{completedCount}/{total} completed</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteIcon}>🗑</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.chevron, { color: colors.textMuted }]}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.success }]} />
      </View>

      {expanded && (
        <View style={styles.items}>
          {checklist.items.map(item => (
            <TouchableOpacity
              key={item.id} style={styles.item}
              onPress={() => onToggleItem(item.id)} activeOpacity={0.75}
            >
              <View style={[
                styles.checkbox, { borderColor: colors.border },
                item.completed && { backgroundColor: colors.success, borderColor: colors.success },
              ]}>
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[
                styles.itemText, { color: colors.textPrimary },
                item.completed && { textDecorationLine: 'line-through', color: colors.textMuted },
              ]}>
                {item.text}
              </Text>
              <TouchableOpacity onPress={() => onDeleteItem(item.id)} style={styles.itemDelete}>
                <Text style={[styles.itemDeleteText, { color: colors.textMuted }]}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <View style={[styles.addRow, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              value={newItemText}
              onChangeText={setNewItemText}
              placeholder="Add item…"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.accent }]} onPress={handleAdd}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: BorderRadius.xl, marginBottom: Spacing.md, overflow: 'hidden', borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerIcon: { fontSize: 24 },
  title: { fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  count: { fontSize: FontSize.xs },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 16 },
  chevron: { fontSize: 12 },
  progressTrack: { height: 3 },
  progressFill: { height: '100%' },
  items: { padding: Spacing.md, gap: Spacing.xs },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.md },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#FFF', fontSize: 12, fontWeight: FontWeight.bold },
  itemText: { flex: 1, fontSize: FontSize.sm },
  itemDelete: { padding: 4 },
  itemDeleteText: { fontSize: 12 },
  addRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.sm, borderRadius: BorderRadius.md, paddingLeft: Spacing.md, overflow: 'hidden' },
  input: { flex: 1, fontSize: FontSize.sm, paddingVertical: Spacing.md },
  addBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  addBtnText: { color: '#FFF', fontSize: FontSize.xl, fontWeight: FontWeight.bold },
});
