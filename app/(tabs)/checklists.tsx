import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Modal, Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/useUserStore';
import { ChecklistCard } from '../../components/ChecklistCard';
import { useTheme } from '../../constants/useTheme';
import type { ThemeColors } from '../../constants/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';
import { showAlert } from '../../utils/alert';

const CHECKLIST_ICONS = ['📋', '🎒', '✈️', '🏖️', '🗺️', '📸', '💊', '🎯', '🛍️', '📝'];

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: { padding: Spacing.xl },
    header: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: Spacing.xl,
    },
    title: { fontSize: FontSize.xxxl, fontWeight: FontWeight.heavy, color: C.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: C.textSecondary },
    addBtn: {
      backgroundColor: C.accent,
      paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.round,
    },
    addBtnText: { color: '#FFF', fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
    emptyState: { alignItems: 'center', paddingVertical: 60, gap: Spacing.md },
    emptyEmoji: { fontSize: 50 },
    emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: C.textPrimary },
    emptyText: { fontSize: FontSize.sm, color: C.textSecondary, textAlign: 'center' },
    backdrop: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
    },
    modalCard: {
      backgroundColor: C.surface, borderRadius: BorderRadius.xxl,
      padding: Spacing.xxl, width: '100%',
      borderWidth: 1, borderColor: C.border, gap: Spacing.md,
    },
    modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: C.textPrimary },
    pickerLabel: { fontSize: FontSize.sm, color: C.textSecondary },
    iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    iconOption: {
      width: 44, height: 44, borderRadius: BorderRadius.md,
      backgroundColor: C.surfaceLight, alignItems: 'center', justifyContent: 'center',
      borderWidth: 2, borderColor: 'transparent',
    },
    iconSelected: { borderColor: C.accent },
    iconOptionText: { fontSize: 22 },
    input: {
      backgroundColor: C.surfaceLight, borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
      color: C.textPrimary, fontSize: FontSize.md,
      borderWidth: 1, borderColor: C.border,
    },
    modalActions: { flexDirection: 'row', gap: Spacing.md, justifyContent: 'flex-end' },
    cancelBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
    cancelText: { color: C.textSecondary, fontSize: FontSize.md },
    createBtn: {
      backgroundColor: C.accent,
      paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.round,
    },
    createText: { color: '#FFF', fontWeight: FontWeight.semibold, fontSize: FontSize.md },
  });
}

export default function ChecklistsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { checklists, addChecklist, deleteChecklist, addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📋');

  const handleCreate = () => {
    if (newTitle.trim()) {
      addChecklist(newTitle.trim(), selectedIcon);
      setNewTitle(''); setSelectedIcon('📋'); setModalVisible(false);
    }
  };

  const handleDelete = (id: string) => {
    showAlert('Delete Checklist', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteChecklist(id) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Checklists ✅</Text>
            <Text style={styles.subtitle}>{checklists.length} lists</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {checklists.map(checklist => (
          <ChecklistCard
            key={checklist.id}
            checklist={checklist}
            onToggleItem={(itemId) => toggleChecklistItem(checklist.id, itemId)}
            onAddItem={(text) => addChecklistItem(checklist.id, text)}
            onDeleteItem={(itemId) => deleteChecklistItem(checklist.id, itemId)}
            onDelete={() => handleDelete(checklist.id)}
          />
        ))}

        {checklists.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No checklists yet</Text>
            <Text style={styles.emptyText}>Create a packing list or travel tasks</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>New Checklist</Text>
            <Text style={styles.pickerLabel}>Choose an icon</Text>
            <View style={styles.iconGrid}>
              {CHECKLIST_ICONS.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconOption, selectedIcon === icon && styles.iconSelected]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconOptionText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Checklist title…"
              placeholderTextColor={colors.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.createText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
