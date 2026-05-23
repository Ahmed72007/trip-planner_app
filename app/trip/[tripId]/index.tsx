import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, Linking, Image } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useTripStore } from '../../../store/useTripStore';
import { MapPickerModal } from '../../../components/MapPickerModal';
import { OSMPlacesInput } from '../../../components/OSMPlacesInput';
import * as ImagePicker from 'expo-image-picker';
import { TripScreenWrapper } from '../../../components/TripScreenWrapper';
import { useTheme } from '../../../constants/useTheme';
import type { ThemeColors } from '../../../constants/useTheme';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-c8bf089bb0c9?auto=format&fit=crop&w=800&q=80';

const fetchPlaceImage = async (placeName: string) => {
  const UNSPLASH_KEY = process.env.EXPO_PUBLIC_UNSPLASH_KEY || 'X8hSETg1IIUUiz_i4raBJ_1YR1EttoCJDzS0RA86KZI';
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) return data.results[0].urls.regular;
    return DEFAULT_IMAGE;
  } catch { return DEFAULT_IMAGE; }
};

const TIME_SLOTS = [
  "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
  "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"
];

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    dayBlock: { marginBottom: 35 },
    dayHeader: { color: C.accent, fontSize: 26, fontWeight: '900', marginBottom: 15, letterSpacing: -0.5 },
    placeCard: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 2, borderColor: C.border, zIndex: 10, overflow: 'hidden' },
    placeImage: { width: '100%', height: 140, backgroundColor: C.surfaceLight },
    placeContent: { flexDirection: 'row', padding: 15, alignItems: 'center' },
    timeCol: { width: 75, borderRightWidth: 2, borderRightColor: C.divider, justifyContent: 'center', paddingRight: 10 },
    timeText: { color: C.textMuted, fontWeight: '800', fontSize: 14 },
    detailsCol: { flex: 1, paddingLeft: 15, justifyContent: 'center' },
    placeName: { color: C.textPrimary, fontSize: 18, fontWeight: '800' },
    placeNotes: { color: C.textSecondary, fontSize: 13, marginTop: 4, fontWeight: '500' },
    coordsText: { color: C.success, fontSize: 12, fontWeight: 'bold', marginTop: 6 },
    costBadge: { backgroundColor: C.success + '18', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
    costText: { color: C.success, fontSize: 12, fontWeight: '800' },
    deleteBtn: { padding: 10, marginLeft: 5 },
    deleteIcon: { fontSize: 20 },
    addDoodleBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: C.border, borderRadius: 20, padding: 15, alignItems: 'center', marginTop: 5 },
    addBtnText: { color: C.textMuted, fontWeight: '700', fontSize: 16 },
    emptyDay: { color: C.textMuted, fontStyle: 'italic', marginBottom: 10, marginLeft: 5 },
    routingContainer: { alignItems: 'center', marginVertical: -5, zIndex: 1 },
    routeLine: { width: 3, height: 15, backgroundColor: C.divider },
    routeBtn: { flexDirection: 'row', backgroundColor: C.surfaceLight, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, alignItems: 'center' },
    routeIcon: { fontSize: 16, marginRight: 5 },
    routeBtnText: { color: C.textPrimary, fontSize: 12, fontWeight: 'bold' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: C.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 3, borderColor: C.border, borderBottomWidth: 0, maxHeight: '90%' },
    modalTitle: { fontSize: 24, fontWeight: '900', color: C.textPrimary, marginBottom: 20 },
    previewBanner: { width: '100%', height: 120, borderRadius: 15, marginBottom: 10, backgroundColor: C.surfaceLight },
    uploadPhotoBtn: { backgroundColor: C.success + '18', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.success, alignItems: 'center', marginBottom: 20 },
    uploadPhotoText: { color: C.success, fontWeight: 'bold', fontSize: 14 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    fieldLabel: { color: C.textSecondary, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
    input: { backgroundColor: C.background, borderRadius: 15, padding: 18, color: C.textPrimary, fontSize: 16, borderWidth: 2, borderColor: C.border, marginBottom: 20 },
    timeSelectBtn: { backgroundColor: C.background, borderRadius: 15, padding: 18, borderWidth: 2, borderColor: C.border, marginBottom: 20, justifyContent: 'center' },
    timeModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 30 },
    timeModalSheet: { backgroundColor: C.surface, borderRadius: 25, padding: 20, borderWidth: 2, borderColor: C.border },
    timeSlotBtn: { padding: 15, borderBottomWidth: 1, borderBottomColor: C.divider },
    timeSlotText: { color: C.textPrimary, fontSize: 16, textAlign: 'center', fontWeight: '700' },
    timeCancelBtn: { marginTop: 15, padding: 15, backgroundColor: C.surfaceLight, borderRadius: 15 },
    timeCancelText: { color: C.textPrimary, textAlign: 'center', fontWeight: 'bold' },
    customPinBtn: { backgroundColor: C.accent + '18', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: C.accent, alignItems: 'center', marginBottom: 20 },
    customPinText: { color: C.accent, fontWeight: 'bold' },
    pinDetailsText: { color: C.success, fontWeight: 'bold', fontSize: 12, marginTop: 4 },
    modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 20 },
    cancelBtn: { paddingVertical: 15, paddingHorizontal: 30 },
    cancelText: { color: C.textSecondary, fontSize: 16, fontWeight: 'bold' },
    saveBtn: { backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 40, paddingVertical: 15, minWidth: 120, alignItems: 'center' },
    saveText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  });
}

export default function TripIndex() {
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const trips = useTripStore(s => s.trips);
  const updateTrip = useTripStore(s => (s as any).updateTrip);
  const trip = trips.find(t => t.id === tripId);

  const [cityCoords, setCityCoords] = useState({ lat: 48.8566, lng: 2.3522 });
  const [modalVisible, setModalVisible] = useState(false);
  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const [formName, setFormName] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formLat, setFormLat] = useState<number | null>(null);
  const [formLng, setFormLng] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCustomImage, setIsCustomImage] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (trip?.city) {
      fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(trip.city)}&format=json&limit=1&accept-language=en`, {
        headers: { 'User-Agent': 'TravelDoodleApp/1.0' }
      })
        .then(res => res.json())
        .then(data => { if (data && data.length > 0) setCityCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }); })
        .catch(err => console.log("OSM City Fetch Error:", err));
    }
  }, [trip?.city]);

  if (!trip) return null;

  const daysArray = Array.from({ length: trip.days || 1 }, (_, i) => i + 1);
  const places = trip.places || [];

  const openAddModal = (dayIndex: number) => {
    setEditingPlaceId(null); setSelectedDayIndex(dayIndex);
    setFormName(''); setFormTime(''); setFormCost(''); setFormNotes('');
    setFormLat(null); setFormLng(null); setPreviewImage(null); setIsCustomImage(false);
    setModalVisible(true);
  };

  const openEditModal = (place: any, dayIndex: number) => {
    setEditingPlaceId(place.id); setSelectedDayIndex(dayIndex);
    setFormName(place.name || ''); setFormTime(place.time || '');
    setFormCost(place.cost ? place.cost.toString() : ''); setFormNotes(place.notes || '');
    setFormLat(place.location?.lat || null); setFormLng(place.location?.lng || null);
    setPreviewImage(place.imageUrl || null); setIsCustomImage(false);
    setModalVisible(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 0.8 });
    if (!result.canceled) { setPreviewImage(result.assets[0].uri); setIsCustomImage(true); }
  };

  const handleSave = async () => {
    if (!formName.trim()) { Alert.alert('Oops!', 'Please enter a name for this place.'); return; }
    setIsSaving(true);
    const costNum = parseFloat(formCost) || 0;
    const locationData = formLat && formLng ? { lat: formLat, lng: formLng } : undefined;
    const finalImageUrl = isCustomImage ? previewImage : (previewImage || await fetchPlaceImage(formName.trim()));

    if (editingPlaceId) {
      const updatedPlaces = places.map((p: any) =>
        p.id === editingPlaceId
          ? { ...p, name: formName.trim(), time: formTime.trim(), cost: costNum, notes: formNotes.trim(), location: locationData, imageUrl: finalImageUrl || p.imageUrl }
          : p
      );
      if (updateTrip) updateTrip(tripId, { places: updatedPlaces });
    } else {
      const newPlace = { id: Date.now().toString(), dayIndex: selectedDayIndex, name: formName.trim(), time: formTime.trim(), cost: costNum, notes: formNotes.trim(), location: locationData, imageUrl: finalImageUrl };
      if (updateTrip) updateTrip(tripId, { places: [...places, newPlace] });
    }
    setIsSaving(false); setModalVisible(false);
  };

  const handleDelete = (placeId: string) => {
    if (updateTrip) updateTrip(tripId, { places: places.filter((p: any) => p.id !== placeId) });
  };

  const openDirections = (startPlace: any, endPlace: any) => {
    if (!startPlace.location || !endPlace.location) { Alert.alert("Missing Map Pins", "Both locations need a saved map pin to calculate directions!"); return; }
    const url = Platform.select({
      ios: `http://maps.apple.com/?saddr=${startPlace.location.lat},${startPlace.location.lng}&daddr=${endPlace.location.lat},${endPlace.location.lng}`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${startPlace.location.lat},${startPlace.location.lng}&destination=${endPlace.location.lat},${endPlace.location.lng}`
    });
    if (url) Linking.openURL(url);
  };

  return (
    <TripScreenWrapper tripId={tripId as string}>
      {daysArray.map((dayNum) => {
        const dayIndex = dayNum - 1;
        const dayPlaces = places.filter((p: any) => p.dayIndex === dayIndex);
        return (
          <View key={dayNum} style={styles.dayBlock}>
            <Text style={styles.dayHeader}>Day {dayNum}</Text>
            {dayPlaces.length > 0 ? (
              dayPlaces.map((place: any, index: number) => (
                <React.Fragment key={place.id}>
                  <TouchableOpacity style={styles.placeCard} onPress={() => openEditModal(place, dayIndex)}>
                    {place.imageUrl && <Image source={{ uri: place.imageUrl }} style={styles.placeImage} />}
                    <View style={styles.placeContent}>
                      <View style={styles.timeCol}>
                        <Text style={styles.timeText}>{place.time || '--:--'}</Text>
                      </View>
                      <View style={styles.detailsCol}>
                        <Text style={styles.placeName}>{place.name}</Text>
                        {place.notes ? <Text style={styles.placeNotes}>{place.notes}</Text> : null}
                        {place.location && <Text style={styles.coordsText}>📍 Map Location Saved</Text>}
                        {place.cost > 0 && (
                          <View style={styles.costBadge}>
                            <Text style={styles.costText}>${place.cost}</Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(place.id)}>
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  {index < dayPlaces.length - 1 && (
                    <View style={styles.routingContainer}>
                      <View style={styles.routeLine} />
                      <TouchableOpacity style={styles.routeBtn} onPress={() => openDirections(place, dayPlaces[index + 1])}>
                        <Text style={styles.routeIcon}>🚗</Text>
                        <Text style={styles.routeBtnText}>Get Directions</Text>
                      </TouchableOpacity>
                      <View style={styles.routeLine} />
                    </View>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Text style={styles.emptyDay}>No places added yet.</Text>
            )}
            <TouchableOpacity style={styles.addDoodleBtn} onPress={() => openAddModal(dayIndex)}>
              <Text style={styles.addBtnText}>+ Add Place / Time</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Add/Edit Place Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{editingPlaceId ? 'Edit Place ✏️' : 'New Place 📍'}</Text>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {previewImage && <Image source={{ uri: previewImage }} style={styles.previewBanner} />}
              <TouchableOpacity style={styles.uploadPhotoBtn} onPress={pickImage}>
                <Text style={styles.uploadPhotoText}>{previewImage ? '📸 Change Photo' : '📸 Upload Custom Photo'}</Text>
              </TouchableOpacity>
              <Text style={styles.fieldLabel}>Search Location</Text>
              <View style={{ zIndex: 10 }}>
                <OSMPlacesInput
                  placeholder="e.g. Louvre Museum, Ichiran Ramen..." type="establishment"
                  onSelect={(data) => {
                    setFormName(data.name); setFormLat(data.lat); setFormLng(data.lng);
                    if (!isCustomImage) fetchPlaceImage(data.name).then(img => setPreviewImage(img));
                  }}
                />
              </View>
              <TouchableOpacity style={styles.customPinBtn} onPress={() => setMapPickerVisible(true)}>
                <Text style={styles.customPinText}>Can't find it? Drop a Custom Pin 🗺️</Text>
                {formLat && <Text style={styles.pinDetailsText}>Location coordinates saved!</Text>}
              </TouchableOpacity>
              <Text style={styles.fieldLabel}>Place Name</Text>
              <TextInput style={styles.input} placeholder="Give this place a name..." placeholderTextColor={colors.textMuted} value={formName} onChangeText={setFormName} />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.fieldLabel}>Time</Text>
                  <TouchableOpacity style={styles.timeSelectBtn} onPress={() => setShowTimePicker(true)}>
                    <Text style={{ color: formTime ? colors.textPrimary : colors.textMuted, fontSize: 16, fontWeight: '700' }}>{formTime || 'Select Time'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fieldLabel}>Cost ($)</Text>
                  <TextInput style={styles.input} placeholder="e.g. 25.00" placeholderTextColor={colors.textMuted} value={formCost} onChangeText={setFormCost} keyboardType="decimal-pad" />
                </View>
              </View>
              <Text style={styles.fieldLabel}>Notes / Details</Text>
              <TextInput style={[styles.input, { height: 80 }]} placeholder="Booking ref, address..." placeholderTextColor={colors.textMuted} value={formNotes} onChangeText={setFormNotes} multiline textAlignVertical="top" />
              <View style={styles.modalBtns}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn} disabled={isSaving}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>{editingPlaceId ? 'Update' : 'Save'}</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <View style={styles.timeModalBackdrop}>
          <View style={styles.timeModalSheet}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
              {TIME_SLOTS.map(t => (
                <TouchableOpacity key={t} style={styles.timeSlotBtn} onPress={() => { setFormTime(t); setShowTimePicker(false); }}>
                  <Text style={styles.timeSlotText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.timeCancelBtn}>
              <Text style={styles.timeCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapPickerModal
        key={`${cityCoords.lat}-${cityCoords.lng}`}
        visible={mapPickerVisible} onClose={() => setMapPickerVisible(false)}
        initialLat={cityCoords.lat} initialLng={cityCoords.lng}
        onSelectLocation={(coords) => { setFormLat(coords.lat); setFormLng(coords.lng); setFormName(''); if (!isCustomImage) setPreviewImage(null); }}
      />
    </TripScreenWrapper>
  );
}