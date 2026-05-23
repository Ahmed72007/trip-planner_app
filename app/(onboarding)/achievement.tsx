import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AchievementScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.badge}>🌟</Text>
                <Text style={styles.title}>First Trip Created!</Text>

                <View style={styles.expBox}>
                    <Text style={styles.expText}>+30 EXP</Text>
                </View>

                <Text style={styles.subtitle}>
                    You're officially a Doodle Traveler. Keep planning trips to level up and unlock new app icons and themes.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push('/paywall')} // Moves to the final paywall!
            >
                <Text style={styles.btnText}>Claim Reward →</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25, justifyContent: 'space-between' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    badge: { fontSize: 100, marginBottom: 10 },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
    expBox: { backgroundColor: 'rgba(250, 204, 21, 0.15)', borderWidth: 2, borderColor: '#FACC15', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, marginBottom: 20 },
    expText: { color: '#FACC15', fontSize: 24, fontWeight: '900' },
    subtitle: { color: '#8E8E93', fontSize: 16, lineHeight: 24, textAlign: 'center', paddingHorizontal: 10 },
    primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 20, borderRadius: 20, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});