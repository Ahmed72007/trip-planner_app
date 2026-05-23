import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function NameScreen() {
    const router = useRouter();
    const [name, setName] = useState('');

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>What should we call you?</Text>
                <Text style={styles.subtitle}>This is how you'll appear to your travel buddies.</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Indiana Jones"
                    placeholderTextColor="#4B5563"
                    value={name}
                    onChangeText={setName}
                    autoFocus
                />

                {/* Only show the button if they typed something! */}
                {name.length > 1 && (
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/interests')}>
                        <Text style={styles.btnText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25 },
    header: { marginTop: 60, marginBottom: 40 },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 10 },
    subtitle: { color: '#8E8E93', fontSize: 16, lineHeight: 24 },
    form: { flex: 1 },
    input: { backgroundColor: '#161922', borderRadius: 20, padding: 20, color: '#FFF', fontSize: 24, fontWeight: 'bold', borderWidth: 2, borderColor: '#7C3AED', marginBottom: 20 },
    primaryBtn: { backgroundColor: '#7C3AED', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
});