import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<'pro' | 'free'>('pro');

    const completeOnboarding = () => {
        // This is the grand finale! It boots them out of onboarding and into the main app.
        // In a real app, you would also save their onboarding state to your database here.
        router.replace('/');
    };

    return (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Unlock Doodle Pro 🚀</Text>
                <Text style={styles.subtitle}>Take your itineraries to the next level.</Text>
            </View>

            {/* PRO PLAN CARD */}
            <TouchableOpacity
                style={[styles.card, selectedPlan === 'pro' && styles.cardActive]}
                onPress={() => setSelectedPlan('pro')}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.planName}>Pro Traveler</Text>
                    <Text style={styles.price}>$4.99/mo</Text>
                </View>
                <Text style={styles.feature}>✨ Unlimited AI Trip Generations</Text>
                <Text style={styles.feature}>🗺️ Advanced Route Optimization</Text>
                <Text style={styles.feature}>☁️ Cloud Sync Backup</Text>
                <Text style={styles.feature}>🚫 Zero Ads</Text>
            </TouchableOpacity>

            {/* FREE PLAN CARD */}
            <TouchableOpacity
                style={[styles.card, selectedPlan === 'free' && styles.cardActive]}
                onPress={() => setSelectedPlan('free')}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.planName}>Basic Free</Text>
                    <Text style={styles.price}>$0.00</Text>
                </View>
                <Text style={styles.featureDim}>✓ 1 AI Trip Generation per month</Text>
                <Text style={styles.featureDim}>✓ Manual Itinerary Building</Text>
                <Text style={styles.featureDim}>✓ Local Storage Only</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                {selectedPlan === 'pro' ? (
                    <>
                        <TouchableOpacity style={styles.primaryBtn} onPress={completeOnboarding}>
                            <Text style={styles.btnText}>Start 3-Day Free Trial</Text>
                        </TouchableOpacity>
                        <Text style={styles.termsText}>Cancel anytime. $4.99/mo after trial.</Text>
                    </>
                ) : (
                    <TouchableOpacity style={styles.secondaryBtn} onPress={completeOnboarding}>
                        <Text style={styles.secondaryBtnText}>Continue with Free</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#0F1117', padding: 25 },
    header: { marginTop: 40, marginBottom: 30, alignItems: 'center' },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 10, textAlign: 'center' },
    subtitle: { color: '#8E8E93', fontSize: 16 },

    card: { backgroundColor: '#161922', borderRadius: 25, padding: 25, borderWidth: 3, borderColor: '#2D3343', marginBottom: 20 },
    cardActive: { borderColor: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.05)' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
    planName: { color: '#FFF', fontSize: 22, fontWeight: '900' },
    price: { color: '#7C3AED', fontSize: 18, fontWeight: 'bold' },

    feature: { color: '#FFF', fontSize: 16, marginBottom: 12, fontWeight: '600' },
    featureDim: { color: '#8E8E93', fontSize: 16, marginBottom: 12, fontWeight: '600' },

    footer: { marginTop: 20, marginBottom: 40 },
    primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
    termsText: { color: '#8E8E93', fontSize: 12, textAlign: 'center', marginTop: 15, fontWeight: '600' },

    secondaryBtn: { backgroundColor: 'transparent', paddingVertical: 20, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderColor: '#2D3343' },
    secondaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});