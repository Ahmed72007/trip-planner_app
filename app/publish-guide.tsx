import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTripStore } from '../store/useTripStore';
import { OSMPlacesInput } from '../components/OSMPlacesInput';
import { useTheme } from '../constants/useTheme';
import type { ThemeColors } from '../constants/useTheme';

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    inner: { flex: 1 },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 20, borderBottomWidth: 2, borderColor: C.border, backgroundColor: C.surface,
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surfaceLight, alignItems: 'center', justifyContent: 'center' },
    backArrow: { color: C.textPrimary, fontSize: 20, fontWeight: 'bold' },
    headerTitle: { fontSize: 20, fontWeight: '900', color: C.textPrimary },
    publishBtn: { backgroundColor: C.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15 },
    publishText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
    scroll: { flex: 1 },
    content: { padding: 20 },
    label: { color: C.textSecondary, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
    input: {
      backgroundColor: C.surfaceLight, borderRadius: 20, padding: 18,
      color: C.textPrimary, fontSize: 16, borderWidth: 2,
      borderColor: C.border, marginBottom: 25,
    },
    placesSection: { marginTop: 10 },
    placesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 24, fontWeight: '900', color: C.textPrimary },
    addSpotBtn: {
      backgroundColor: C.accent + '22', paddingHorizontal: 15, paddingVertical: 8,
      borderRadius: 12, borderWidth: 1, borderColor: C.accent,
    },
    addSpotText: { color: C.accent, fontWeight: '800' },
    categoryGroup: { marginBottom: 25 },
    categoryTitle: { color: C.textSecondary, fontSize: 16, fontWeight: '800', marginBottom: 12, textTransform: 'uppercase' },
    placeCard: {
      flexDirection: 'row', backgroundColor: C.surface,
      padding: 15, borderRadius: 20, borderWidth: 2,
      borderColor: C.border, marginBottom: 12,
    },
    iconBox: { width: 48, height: 48, backgroundColor: C.surfaceLight, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
    icon: { fontSize: 24 },
    placeDetails: { flex: 1, justifyContent: 'center' },
    placeName: { color: C.textPrimary, fontSize: 18, fontWeight: '800' },
    placeNotes: { color: C.textSecondary, fontSize: 14, marginTop: 4, fontWeight: '500' },
    emptyText: { color: C.textMuted, fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalSheet: {
      backgroundColor: C.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30,
      padding: 25, borderWidth: 3, borderColor: C.border, borderBottomWidth: 0,
    },
    modalTitle: { fontSize: 24, fontWeight: '900', color: C.textPrimary, marginBottom: 20 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    typeBtn: {
      flex: 1, paddingVertical: 12, borderRadius: 15, borderWidth: 2,
      borderColor: C.border, alignItems: 'center', backgroundColor: C.background,
    },
    typeBtnActive: { borderColor: C.accent, backgroundColor: C.accent + '22' },
    typeBtnText: { color: C.textSecondary, fontWeight: '700', fontSize: 14 },
    typeBtnTextActive: { color: C.accent, fontWeight: '900' },
    modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 20 },
    cancelBtn: { paddingVertical: 15, paddingHorizontal: 30 },
    cancelText: { color: C.textSecondary, fontSize: 16, fontWeight: 'bold' },
    saveBtn: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 30, paddingVertical: 15 },
    saveText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  });
}

export default function PublishGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const addGuide = useTripStore(s => (s as any).addGuide);

  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'eat' | 'stay' | 'visit'>('eat');
  const [formNotes, setFormNotes] = useState('');

  const handleAddPlace = () => {
    if (!formName.trim()) return;
    setPlaces([...places, { id: Date.now().toString(), name: formName, category: formCategory, notes: formNotes }]);
    setFormName(''); setFormNotes(''); setModalVisible(false);
  };

  const handlePublish = () => {
    if (!title.trim() || !city.trim()) { Alert.alert('Hold up!', 'Your guide needs a Title and a City.'); return; }
    addGuide({ title, city, description, places });
    router.replace('/(tabs)');
  };

  const eats = places.filter(p => p.category === 'eat');
  const stays = places.filter(p => p.category === 'stay');
  const visits = places.filter(p => p.category === 'visit');

  const renderPlaceCard = (place: any, icon: string) => (
    <View key={place.id} style={styles.placeCard}>
      <View style={styles.iconBox}><Text style={styles.icon}>{icon}</Text></View>
      <View style={styles.placeDetails}>
        <Text style={styles.placeName}>{place.name}</Text>
        {place.notes ? <Text style={styles.placeNotes}>{place.notes}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inner}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Curate Guide 📖</Text>
          <TouchableOpacity onPress={handlePublish} style={styles.publishBtn}>
            <Text style={styles.publishText}>Publish</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Guide Title</Text>
          <TextInput style={styles.input} placeholder="e.g. The Ultimate Tokyo Foodie Tour" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Target City</Text>
          <OSMPlacesInput placeholder="e.g. Tokyo" value={formName} onSelect={(data) => setFormName(data.name)} type="establishment" />

          <Text style={styles.label}>Intro / Vibe Notes</Text>
          <TextInput style={[styles.input, { height: 100 }]} placeholder="What makes this guide special?" placeholderTextColor={colors.textMuted} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />

          <View style={styles.placesSection}>
            <View style={styles.placesHeader}>
              <Text style={styles.sectionTitle}>Curated Spots</Text>
              <TouchableOpacity style={styles.addSpotBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.addSpotText}>+ Add Spot</Text>
              </TouchableOpacity>
            </View>
            {eats.length > 0 && <View style={styles.categoryGroup}><Text style={styles.categoryTitle}>Best Places to Eat 🍽️</Text>{eats.map(p => renderPlaceCard(p, '🍜'))}</View>}
            {stays.length > 0 && <View style={styles.categoryGroup}><Text style={styles.categoryTitle}>Where to Stay 🏨</Text>{stays.map(p => renderPlaceCard(p, '🛏️'))}</View>}
            {visits.length > 0 && <View style={styles.categoryGroup}><Text style={styles.categoryTitle}>Must Visit 📸</Text>{visits.map(p => renderPlaceCard(p, '📍'))}</View>}
            {places.length === 0 && <Text style={styles.emptyText}>No places added yet. Tap '+ Add Spot' to start curating!</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add a Spot 📍</Text>
            <View style={styles.typeSelector}>
              {(['eat', 'stay', 'visit'] as const).map(cat => (
                <TouchableOpacity key={cat} style={[styles.typeBtn, formCategory === cat && styles.typeBtnActive]} onPress={() => setFormCategory(cat)}>
                  <Text style={[styles.typeBtnText, formCategory === cat && styles.typeBtnTextActive]}>
                    {cat === 'eat' ? '🍽️ Eat' : cat === 'stay' ? '🏨 Stay' : '📸 Visit'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Spot Name</Text>
            <OSMPlacesInput placeholder="e.g. Ichiran Ramen" value={formName} onSelect={(data) => setFormName(data.name)} type="establishment" />
            <Text style={styles.label}>Why do you recommend it?</Text>
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Must order the spicy pork..." placeholderTextColor={colors.textMuted} value={formNotes} onChangeText={setFormNotes} multiline textAlignVertical="top" />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddPlace}><Text style={styles.saveText}>Add Spot</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}