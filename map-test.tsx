import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapTestScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Google Maps Test 🧪</Text>
            </View>

            {/* If this renders, your API Key and Build worked perfectly! */}
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 37.78825, // Defaulting to San Francisco for the test
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
                    title="Test Pin"
                    description="If you see this, you are ready to migrate!"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117' },
    header: { padding: 40, alignItems: 'center', backgroundColor: '#161922' },
    headerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    map: { flex: 1 },
});