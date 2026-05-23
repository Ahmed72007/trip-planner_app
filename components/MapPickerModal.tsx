import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

interface MapPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (coords: { lat: number; lng: number }) => void;
    // 👇 NEW: Accept starting coordinates!
    initialLat?: number;
    initialLng?: number;
}

export const MapPickerModal: React.FC<MapPickerModalProps> = ({ visible, onClose, onSelectLocation, initialLat, initialLng }) => {
    const [currentRegion, setCurrentRegion] = useState({
        latitude: 48.8566, // Default fallback
        longitude: 2.3522,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // 👇 NEW: When the modal opens, snap to the passed-in coordinates!
    useEffect(() => {
        if (visible && initialLat && initialLng) {
            setCurrentRegion(prev => ({ ...prev, latitude: initialLat, longitude: initialLng }));
        }
    }, [visible, initialLat, initialLng]);

    const handleConfirm = () => {
        onSelectLocation({ lat: currentRegion.latitude, lng: currentRegion.longitude });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={currentRegion} // Use 'region' instead of 'initialRegion' to force updates
                    onRegionChangeComplete={(region) => setCurrentRegion(region)}
                />

                <View style={styles.centerPinContainer} pointerEvents="none">
                    <Text style={styles.pinIcon}>📍</Text>
                </View>

                <SafeAreaView style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Drag Map to Select</Text>
                        <View style={{ width: 60 }} />
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmText}>Confirm This Location</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

// ... keep your existing styles ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117' },
    map: { ...StyleSheet.absoluteFillObject },
    centerPinContainer: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -40, zIndex: 10 },
    pinIcon: { fontSize: 40 },
    overlay: { flex: 1, justifyContent: 'space-between', pointerEvents: 'box-none' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'rgba(15, 17, 23, 0.8)' },
    cancelBtn: { padding: 10 },
    cancelText: { color: '#8E8E93', fontWeight: 'bold', fontSize: 16 },
    title: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    footer: { padding: 30, paddingBottom: 50 },
    confirmBtn: { backgroundColor: '#7C3AED', paddingVertical: 18, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    confirmText: { color: '#FFF', fontSize: 18, fontWeight: '900' }
});