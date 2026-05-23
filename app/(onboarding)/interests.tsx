import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const INTERESTS = [
    { id: '1', emoji: '🍜', label: 'Foodie Runs' },
    { id: '2', emoji: '🏛️', label: 'History & Museums' },
    { id: '3', emoji: '📸', label: 'Hidden Gems' },
    { id: '4', emoji: '🏔️', label: 'Nature Vibes' },
    { id: '5', emoji: '🍸', label: 'Nightlife' },
    { id: '6', emoji: '🛍️', label: 'Shopping' },
];

export default function InterestsScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleInterest = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>What's your vibe?</Text>
                <Text style={styles.subtitle}>Pick a few to help us generate better itineraries for you.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {INTERESTS.map(item => {
                    const isActive = selected.includes(item.id);
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.card, isActive && styles.cardActive]}
                            onPress={() => toggleInterest(item.id)}
                        >
                            <Text style={styles.emoji}>{item.emoji}</Text>
                            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.primaryBtn, selected.length === 0 && { opacity: 0.5 }]}
                    onPress={() => router.push('/build-trip')}
                    disabled={selected.length === 0}
                >
                    <Text style={styles.btnText}>Let's Build a Trip →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25 },
    header: { marginTop: 40, marginBottom: 30 },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 10 },
    subtitle: { color: '#8E8E93', fontSize: 16, lineHeight: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '48%', backgroundColor: '#161922', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#2D3343', marginBottom: 15, alignItems: 'center' },
    cardActive: { borderColor: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.1)' },
    emoji: { fontSize: 32, marginBottom: 10 },
    label: { color: '#8E8E93', fontWeight: 'bold', textAlign: 'center' },
    labelActive: { color: '#FFF' },
    footer: { paddingBottom: 20 },
    primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 20, borderRadius: 20, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});