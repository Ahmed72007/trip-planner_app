import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// 🧠 IMPORT ASYNC STORAGE
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
    const router = useRouter();

    // 🚀 THE MAGIC FUNCTION
    const finishOnboarding = async () => {
        // Save the flag to the phone's memory
        await AsyncStorage.setItem('@has_launched', 'true');
        // Move to the next screen!
        router.push('/sign-in');
    };

    return (
        <View style={styles.container}>
            <View style={styles.artContainer}>
                <Text style={styles.doodleArt}>🌍✈️🗺️</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Doodle Travel</Text>
                <Text style={styles.subtitle}>
                    Stop stressing over itineraries. Let's build your perfect trip, beautifully.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={finishOnboarding} // 👈 Use the new function here!
                >
                    <Text style={styles.btnText}>Let's Go 🚀</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>
                    By continuing, you agree to our Terms & Privacy Policy.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25, justifyContent: 'space-between' },
    artContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    doodleArt: { fontSize: 80, letterSpacing: 10 },
    textContainer: { flex: 1, justifyContent: 'center' },
    title: { color: '#FFF', fontSize: 42, fontWeight: '900', marginBottom: 15 },
    subtitle: { color: '#8E8E93', fontSize: 18, lineHeight: 26, fontWeight: '500' },
    footer: { paddingBottom: 40 },
    primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 20, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderColor: '#5B21B6', shadowColor: '#7C3AED', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
    btnText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
    termsText: { color: '#4B5563', fontSize: 12, textAlign: 'center', marginTop: 20, fontWeight: '600' },
});