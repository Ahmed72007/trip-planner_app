import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SuccessScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🎉</Text>
                <Text style={styles.title}>You're Official!</Text>
                <Text style={styles.subtitle}>
                    Your account is secured. We'll automatically sync your itineraries across all your devices so you never lose a plan.
                </Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/name')}>
                <Text style={styles.btnText}>Set Up My Profile →</Text>
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