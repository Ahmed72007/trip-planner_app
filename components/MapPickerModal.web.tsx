import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (coords: { lat: number; lng: number }) => void;
}

// 🌐 THIS IS THE WEB-ONLY FALLBACK
// It prevents the bundler from ever touching 'react-native-maps' on the web.
export function MapPickerModal({ visible, onClose }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={styles.sheet}>
                    <Text style={styles.title}>Map Unavailable on Web 🌐</Text>
                    <Text style={styles.subtitle}>
                        The interactive map picker relies on native mobile features. Please use the OpenStreetMap search bar above, or open this app on your iOS/Android device to drop a custom pin!
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>Got it, take me back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    sheet: { backgroundColor: '#161922', padding: 30, borderRadius: 30, borderWidth: 3, borderColor: '#7C3AED', alignItems: 'center', width: '100%', maxWidth: 400 },
    title: { color: '#FFF', fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 15 },
    subtitle: { color: '#8E8E93', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 25 },
    closeBtn: { backgroundColor: '#7C3AED', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20 },
    closeText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
});