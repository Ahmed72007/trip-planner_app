import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useTripStore } from '../../../store/useTripStore';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../constants/useTheme';
import type { ThemeColors } from '../../../constants/useTheme';

const MOODS = ['🤩', '🥰', '😌', '😎', '🤪', '🤯', '😴', '😭', '❤️'];

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: { padding: 20 },
    loadingContainer: { flex: 1, backgroundColor: C.background, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: C.textMuted, marginTop: 15, fontWeight: 'bold' },
    header: { marginBottom: 25, marginTop: 40 },
    headerTitle: { fontSize: 28, fontWeight: '900', color: C.textPrimary },
    headerSub: { fontSize: 16, color: C.textSecondary, fontWeight: '600', marginTop: 5 },
    addBtn: { backgroundColor: C.accent, paddingVertical: 18, borderRadius: 20, alignItems: 'center', borderWidth: 3, borderColor: C.border, marginBottom: 30 },
    addBtnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
    timeline: { flex: 1 },
    entryCard: { backgroundColor: C.surface, padding: 20, borderRadius: 20, borderWidth: 2, borderColor: C.border, marginBottom: 20, borderLeftWidth: 6, borderLeftColor: C.accent },
    entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    displayMood: { fontSize: 28 },
    dateBubble: { backgroundColor: C.accent + '26', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    dateText: { color: C.accent, fontWeight: '800', fontSize: 12 },
    timelineImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15, borderWidth: 2, borderColor: C.border },
    entryText: { color: C.textPrimary, fontSize: 16, lineHeight: 24, fontWeight: '500' },
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyEmoji: { fontSize: 60, marginBottom: 15 },
    emptyTitle: { color: C.textPrimary, fontSize: 22, fontWeight: '900', marginBottom: 8 },
    emptyText: { color: C.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: C.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 3, borderColor: C.border, borderBottomWidth: 0, maxHeight: '90%' },
    modalTitle: { fontSize: 24, fontWeight: '900', color: C.textPrimary, marginBottom: 20 },
    fieldLabel: { color: C.textMuted, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
    moodScroll: { marginBottom: 25 },
    moodBtn: { backgroundColor: C.background, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 2, borderColor: C.border },
    moodBtnActive: { backgroundColor: C.accent + '33', borderColor: C.accent },
    moodEmoji: { fontSize: 24 },
    uploadBtn: { backgroundColor: C.background, borderRadius: 20, padding: 30, alignItems: 'center', borderWidth: 2, borderColor: C.border, borderStyle: 'dashed', marginBottom: 20 },
    uploadIcon: { fontSize: 40, marginBottom: 10 },
    uploadText: { color: C.textMuted, fontWeight: 'bold' },
    imagePreviewContainer: { marginBottom: 20, position: 'relative' },
    imagePreview: { width: '100%', height: 200, borderRadius: 20, borderWidth: 2, borderColor: C.accent },
    removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    removeImageText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    input: { backgroundColor: C.background, borderRadius: 20, padding: 20, color: C.textPrimary, fontSize: 16, borderWidth: 2, borderColor: C.border, marginBottom: 20, minHeight: 120 },
    modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 20 },
    cancelBtn: { paddingVertical: 15, paddingHorizontal: 30 },
    cancelText: { color: C.textMuted, fontSize: 16, fontWeight: 'bold' },
    saveBtn: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 15 },
    saveText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  });
}

export default function JournalScreen() {
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const trips = useTripStore(s => s.trips);
  const updateTrip = useTripStore(s => (s as any).updateTrip);
  const trip = trips.find(t => t.id === tripId);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [modalVisible, setModalVisible] = useState(false);
  const [entryText, setEntryText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>('🤩');

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.loadingText}>Loading Journal...</Text>
      </View>
    );
  }

  const entries = trip.journalEntries || [];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 0.8,
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleSave = () => {
    if (!entryText.trim() && !selectedImage) return;
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: entryText.trim(), imageUri: selectedImage, mood: selectedMood,
    };
    if (updateTrip) updateTrip(tripId, { journalEntries: [newEntry, ...entries] });
    setEntryText(''); setSelectedImage(null); setSelectedMood('🤩'); setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Travel Diary ✍️</Text>
          <Text style={styles.headerSub}>Notes, photos, and vibes</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ New Memory</Text>
        </TouchableOpacity>
        <View style={styles.timeline}>
          {entries.length > 0 ? (
            entries.map((entry: any, index: number) => (
              <View key={entry.id || index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.dateBubble}><Text style={styles.dateText}>{entry.date || 'Today'}</Text></View>
                  <Text style={styles.displayMood}>{entry.mood || '✨'}</Text>
                </View>
                {entry.imageUri && <Image source={{ uri: entry.imageUri }} style={styles.timelineImage} />}
                {entry.text ? <Text style={styles.entryText}>{entry.text}</Text> : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📸</Text>
              <Text style={styles.emptyTitle}>Blank Canvas</Text>
              <Text style={styles.emptyText}>No entries yet. Add a photo or write down a memory!</Text>
            </View>
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Capture the Moment 📸</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>How was the vibe? ✨</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
                {MOODS.map(m => (
                  <TouchableOpacity key={m} style={[styles.moodBtn, selectedMood === m && styles.moodBtnActive]} onPress={() => setSelectedMood(m)}>
                    <Text style={styles.moodEmoji}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => setSelectedImage(null)}>
                    <Text style={styles.removeImageText}>❌ Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                  <Text style={styles.uploadIcon}>🖼️</Text>
                  <Text style={styles.uploadText}>Tap to add a photo</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.fieldLabel}>Journal Notes</Text>
              <TextInput style={styles.input} placeholder="What made today special?" placeholderTextColor={colors.textMuted} value={entryText} onChangeText={setEntryText} multiline textAlignVertical="top" />
              <View style={styles.modalBtns}>
                <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedImage(null); }} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}