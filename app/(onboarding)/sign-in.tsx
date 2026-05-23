import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// 1. Import the new tools and your database engine
import { supabase } from '../../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// 2. Tell the browser to properly close when the auth is done
WebBrowser.maybeCompleteAuthSession();

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', padding: 25 },

    // New Top Nav Styles
    topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 20 },
    backBtn: { paddingVertical: 10, paddingRight: 20 },
    backText: { color: '#8E8E93', fontSize: 16, fontWeight: '700' },
    skipBtn: { backgroundColor: '#161922', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 15, borderWidth: 1, borderColor: '#2D3343' },
    skipText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

    header: { marginBottom: 40 },
    title: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 10 },
    subtitle: { color: '#8E8E93', fontSize: 16, lineHeight: 24 },
    form: { flex: 1 },
    label: { color: '#FFF', fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
    input: { backgroundColor: '#161922', borderRadius: 20, padding: 20, color: '#FFF', fontSize: 16, borderWidth: 2, borderColor: '#2D3343', marginBottom: 20 },

    // Validation Styles
    emailBtn: { backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 18, alignItems: 'center' },
    emailBtnDisabled: { backgroundColor: '#161922', borderWidth: 2, borderColor: '#2D3343' },
    emailBtnText: { color: '#0F1117', fontSize: 16, fontWeight: '900' },
    emailBtnTextDisabled: { color: '#4B5563' },

    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
    line: { flex: 1, height: 2, backgroundColor: '#2D3343' },
    orText: { color: '#8E8E93', marginHorizontal: 15, fontWeight: 'bold' },
    googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#161922', borderRadius: 20, paddingVertical: 18, borderWidth: 2, borderColor: '#2D3343' },
    googleIcon: { color: '#FFF', fontSize: 20, fontWeight: '900', marginRight: 10 },
    googleText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default function SignInScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const isValidEmail = email.length > 5 && email.includes('@') && email.includes('.');

    const handleEmailSignIn = async () => {
        if (!isValidEmail) return;
        const { error } = await supabase.auth.signInWithOtp({ email: email });
        if (error) {
            Alert.alert("Sign In Error", error.message);
        } else {
            Alert.alert("Check your inbox!", "We sent a magic link to your email.");
            router.push('/success');
        }
    };

    // 3. THE GOOGLE AUTH LOGIC
    const handleGoogleSignIn = async () => {
        try {
            const redirectUrl = 'travelapp://success';
            console.log("1. Asking Supabase to redirect to:", redirectUrl);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) {
                console.error("❌ SUPABASE OAUTH ERROR:", error);
                throw error;
            }

            console.log("2. Supabase generated this Google URL:", data?.url);

            if (data?.url) {
                console.log("3. Opening the Browser...");
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

                console.log("4. Browser Closed! Result is:", result); // <-- THIS IS THE MOST IMPORTANT LOG

                if (result.type === 'success' && result.url) {
                    console.log("5. Success! Parsing the VIP Token...");

                    const extractParam = (url: string, param: string) => {
                        const match = url.match(new RegExp(`[#?&]${param}=([^&]+)`));
                        return match ? match[1] : null;
                    };

                    const access_token = extractParam(result.url, 'access_token');
                    const refresh_token = extractParam(result.url, 'refresh_token');

                    if (access_token && refresh_token) {
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token
                        });

                        if (sessionError) {
                            console.error("❌ SESSION ERROR:", sessionError);
                            throw sessionError;
                        }

                        console.log("✅ SESSION ESTABLISHED! Routing to success...");
                        router.push('/success');
                    }
                } else {
                    console.log("Browser was dismissed or failed.");
                }
            }
        } catch (error: any) {
            Alert.alert("Google Login Failed", error.message);
        }
    };
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>

            <View style={styles.topNav}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={() => router.push('/skip-warning')}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>Welcome Aboard 🎫</Text>
                <Text style={styles.subtitle}>Save your trips, access them anywhere, and join the club.</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. explorer@world.com"
                    placeholderTextColor="#4B5563"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TouchableOpacity
                    style={[styles.emailBtn, !isValidEmail && styles.emailBtnDisabled]}
                    onPress={handleEmailSignIn}
                    disabled={!isValidEmail}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.emailBtnText, !isValidEmail && styles.emailBtnTextDisabled]}>
                        Continue with Email
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                {/* Connect the button! */}
                <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn}>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.googleText}>Continue with Google</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    );
}
