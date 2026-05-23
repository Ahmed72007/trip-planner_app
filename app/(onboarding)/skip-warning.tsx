import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SkipWarningScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>☁️</Text>
                <Text style={styles.title}>No Cloud Backup</Text>
                <Text style={styles.subtitle}>
                    If you continue as a guest, your trips will only be saved on this device. If you delete the app or lose your phone, your itineraries cannot be recovered.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.push('/name')} // Skips the success screen, goes straight to Name
                >
                    <Text style={styles.btnText}>I Understand, Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
                    <Text style={styles.secondaryBtnText}>← Back to Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25, justifyContent: 'space-between' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    icon: { fontSize: 80, marginBottom: 20 },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 15, textAlign: 'center' },
    subtitle: { color: '#8E8E93', fontSize: 16, lineHeight: 24, textAlign: 'center', paddingHorizontal: 15 },
    footer: { paddingBottom: 20 },
    primaryBtn: { backgroundColor: '#161922', paddingVertical: 20, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderColor: '#2D3343', marginBottom: 15 },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
    secondaryBtn: { paddingVertical: 15, alignItems: 'center' },
    secondaryBtnText: { color: '#8E8E93', fontSize: 16, fontWeight: 'bold' },
});