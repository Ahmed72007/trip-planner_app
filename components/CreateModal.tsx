import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../constants/useTheme';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'plan' | 'guide') => void;
}

export function CreateModal({ visible, onClose, onSelect }: CreateModalProps) {
  const { colors, isDark } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.centeredView}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.accent }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>What's the move? 🖊️</Text>

            <TouchableOpacity style={styles.optionBtn} onPress={() => onSelect('plan')}>
              <Text style={styles.icon}>🗺️</Text>
              <View>
                <Text style={[styles.btnText, { color: colors.textPrimary }]}>Plan a Trip</Text>
                <Text style={[styles.btnSub, { color: colors.textSecondary }]}>Doodle a new itinerary</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionBtn, styles.borderTop, { borderColor: colors.divider }]}
              onPress={() => onSelect('guide')}
            >
              <Text style={styles.icon}>📖</Text>
              <View>
                <Text style={[styles.btnText, { color: colors.textPrimary }]}>Publish a Guide</Text>
                <Text style={[styles.btnSub, { color: colors.textSecondary }]}>Share your sketches</Text>
              </View>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
}

// Only layout/non-color styles live here; all colors are inline
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  centeredView: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  modalCard: {
    width: '85%',
    borderRadius: 40, borderWidth: 3,
    padding: 24,
    shadowOpacity: 0.3, shadowRadius: 20,
  },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 24 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 10 },
  borderTop: { borderTopWidth: 2, marginTop: 10, paddingTop: 28 },
  icon: { fontSize: 32, marginRight: 20 },
  btnText: { fontSize: 19, fontWeight: '700' },
  btnSub: { fontSize: 13, marginTop: 2 },
});