import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function BuildTripScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🗺️</Text>
                <Text style={styles.title}>Let's test it out.</Text>
                <Text style={styles.subtitle}>
                    Based on your interests, let's create your very first AI-powered itinerary right now.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                    // This sends them to your real AI generator, but hands it a secret flag!
                    router.push('/create-trip?isOnboarding=true');
                }}
            >
                <Text style={styles.btnText}>Generate First Trip ✨</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25, justifyContent: 'space-between' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    icon: { fontSize: 80, marginBottom: 20 },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
    subtitle: { color: '#8E8E93', fontSize: 16, lineHeight: 24, textAlign: 'center', paddingHorizontal: 20 },
    primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 20, borderRadius: 20, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});