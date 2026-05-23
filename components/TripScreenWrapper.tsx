import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, ActivityIndicator } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useTripStore } from '../store/useTripStore';
import { useTheme } from '../constants/useTheme';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-c8bf089bb0c9?auto=format&fit=crop&w=800&q=80';

const fetchPlaceImage = async (placeName: string) => {
    const UNSPLASH_KEY = process.env.EXPO_PUBLIC_UNSPLASH_KEY || 'X8hSETg1IIUUiz_i4raBJ_1YR1EttoCJDzS0RA86KZI';
    try {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=${UNSPLASH_KEY}&per_page=1&orientation=landscape`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) return data.results[0].urls.regular;
        return DEFAULT_IMAGE;
    } catch { return DEFAULT_IMAGE; }
};

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 110 : 90;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface TripScreenWrapperProps {
    tripId: string;
    children: React.ReactNode;
}

export const TripScreenWrapper: React.FC<TripScreenWrapperProps> = ({ tripId, children }) => {
    const router = useRouter();
    const { isOnboarding } = useGlobalSearchParams();
    const { colors, isDark } = useTheme();

    const trips = useTripStore(s => s.trips);
    const trip = trips.find(t => t.id === tripId);

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = scrollY.interpolate({ inputRange: [0, SCROLL_DISTANCE], outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], extrapolate: 'clamp' });
    const imageOpacity = scrollY.interpolate({ inputRange: [0, SCROLL_DISTANCE / 1.5], outputRange: [1, 0], extrapolate: 'clamp' });
    const heroOpacity = scrollY.interpolate({ inputRange: [0, SCROLL_DISTANCE / 2], outputRange: [1, 0], extrapolate: 'clamp' });
    const smallTitleOpacity = scrollY.interpolate({ inputRange: [SCROLL_DISTANCE / 2, SCROLL_DISTANCE], outputRange: [0, 1], extrapolate: 'clamp' });
    const surfaceRgb = isDark ? '22, 25, 34' : '253, 251, 247';
    const headerBgColor = scrollY.interpolate({
        inputRange: [0, SCROLL_DISTANCE],
        outputRange: [`rgba(${surfaceRgb}, 0)`, `rgba(${surfaceRgb}, 1)`],
        extrapolate: 'clamp',
    });

    const [cityImage, setCityImage] = useState<string | null>(null);
    useEffect(() => {
        if (trip?.city) fetchPlaceImage(`${trip.city} city landscape`).then(img => setCityImage(img));
    }, [trip?.city]);

    if (!trip) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator color={colors.accent} size="large" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View style={[styles.dynamicHeader, { height: headerHeight, backgroundColor: headerBgColor, borderBottomColor: colors.border }]}>
                <Animated.Image source={{ uri: cityImage || DEFAULT_IMAGE }} style={[styles.headerBgImage, { opacity: imageOpacity }]} />
                <Animated.View style={[styles.headerDarken, { opacity: imageOpacity }]} />
                <View style={styles.topNavBar}>
                    <TouchableOpacity
                        onPress={() => { isOnboarding === 'true' ? router.replace('/') : router.back(); }}
                        style={[styles.backBtn, { backgroundColor: colors.surface + 'CC', borderColor: colors.border }]}
                    >
                        <Text style={[styles.backArrow, { color: colors.textPrimary }]}>{isOnboarding === 'true' ? '🏠' : '←'}</Text>
                    </TouchableOpacity>
                    <Animated.Text style={[styles.smallHeaderTitle, { opacity: smallTitleOpacity, color: colors.textPrimary }]}>{trip.city}</Animated.Text>
                    <View style={{ width: 44 }} />
                </View>
                <Animated.View style={[styles.heroGlass, { opacity: heroOpacity, backgroundColor: colors.surface + 'D9', borderColor: colors.border }]}>
                    <Text style={[styles.heroCity, { color: colors.textPrimary }]}>{trip.city}</Text>
                    <View style={styles.heroStats}>
                        <Text style={[styles.heroStatText, { color: colors.success }]}>📅 {trip.days} Days</Text>
                        <Text style={[styles.heroStatDot, { color: colors.textMuted }]}>•</Text>
                        <Text style={[styles.heroStatText, { color: colors.success }]}>👥 {trip.members?.length || 1} People</Text>
                    </View>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT + 20, paddingHorizontal: 20, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
            >
                {children}
            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    dynamicHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, borderBottomWidth: 1, justifyContent: 'flex-end', paddingBottom: 20 },
    headerBgImage: { ...StyleSheet.absoluteFillObject },
    headerDarken: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    topNavBar: { position: 'absolute', top: Platform.OS === 'ios' ? 55 : 35, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 110 },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    backArrow: { fontSize: 25, fontWeight: 'bold', marginBottom: 7 },
    smallHeaderTitle: { fontSize: 20, fontWeight: '900' },
    heroGlass: { marginHorizontal: 20, padding: 20, borderRadius: 20, borderWidth: 1 },
    heroCity: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    heroStatText: { fontWeight: '800', fontSize: 14 },
    heroStatDot: { marginHorizontal: 10, fontSize: 14 },
});