import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../constants/useTheme';
import type { ThemeColors } from '../constants/useTheme';

interface OSMPlacesInputProps {
    placeholder: string;
    type: 'city' | 'establishment';
    onSelect: (data: { name: string; lat: number; lng: number }) => void;
    value?: string;
}

// 🌟 THE INSTANT LIST: Popular destinations for zero-lag searching
const TOP_CITIES = [
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522, place_id: 'top_1' },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, place_id: 'top_2' },
    { name: 'New York City, USA', lat: 40.7128, lng: -74.0060, place_id: 'top_3' },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, place_id: 'top_4' },
    { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, place_id: 'top_5' },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, place_id: 'top_6' },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, place_id: 'top_7' },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, place_id: 'top_8' },
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, place_id: 'top_9' },
    { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, place_id: 'top_10' },
];

function createStyles(C: ThemeColors) {
    return StyleSheet.create({
        input: { backgroundColor: C.surface, borderRadius: 20, padding: 20, color: C.textPrimary, fontSize: 18, borderWidth: 2, borderColor: C.border },
        loader: { position: 'absolute', right: 20, top: 22 },
        dropdown: { position: 'absolute', top: 75, left: 0, right: 0, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, maxHeight: 320, zIndex: 1000, elevation: 10 },
        row: { padding: 15, borderBottomWidth: 1, borderBottomColor: C.border },
        rowText: { color: C.textPrimary, fontSize: 15 },
    });
}

export const OSMPlacesInput: React.FC<OSMPlacesInputProps> = ({ placeholder, type, onSelect, value }) => {
    const [query, setQuery] = useState(value ?? '');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    // Sync internal query when parent resets the value (e.g. modal close)
    useEffect(() => {
        if (value !== undefined) setQuery(value);
    }, [value]);

    // 🧹 THE CLEANUP FUNCTION: Extracts strictly "City, Country" or "Place Name"
    const formatLocationName = (item: any) => {
        // If it's from our hardcoded list, just return the perfect string
        if (item.place_id.toString().startsWith('top_')) return item.name;

        if (type === 'city') {
            // Find the clean city name, ignore all the administrative district garbage
            const city = item.address?.city || item.address?.town || item.address?.village || item.address?.state || item.name;
            const country = item.address?.country || '';
            return country ? `${city}, ${country}` : city;
        }

        // If it's a specific place (museum/cafe), just return the name
        return item.name || item.display_name.split(',')[0];
    };

    useEffect(() => {
        // 1. Instant check against our Top Cities list (no internet required!)
        if (type === 'city' && query.trim().length > 0 && query.trim().length <= 2) {
            const localMatches = TOP_CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
            setResults(localMatches);
            setShowDropdown(true);
            return;
        }

        // 2. The Smart Fetch (Wait 500ms before asking OSM)
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length > 2) {
                setLoading(true);
                try {
                    // 🚨 THE FIX: 'featuretype=settlement' strictly limits results to Cities/Towns!
                    // 🚨 THE FIX: 'accept-language=en' forces the API to translate to English!
                    const url = type === 'city'
                        ? `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&featuretype=settlement&accept-language=en`
                        : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&accept-language=en`;

                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'TravelDoodleApp/1.0',
                            'Accept-Language': 'en-US,en;q=0.9' // Double forcing English via headers
                        }
                    });

                    const data = await response.json();
                    setResults(data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error("OSM Fetch Error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, type]);

    const handleSelect = (item: any) => {
        const cleanName = formatLocationName(item);
        setQuery(cleanName);
        setShowDropdown(false);

        onSelect({
            name: cleanName,
            lat: parseFloat(item.lat),
            // OSM uses 'lon', our Top Cities uses 'lng'. This safely handles both!
            lng: parseFloat(item.lon || item.lng)
        });
    };

    return (
        <View style={{ zIndex: 9999, elevation: 10, position: 'relative' }}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    if (text.length === 0) setShowDropdown(false);
                }}
            />

            {loading && <ActivityIndicator style={styles.loader} color={colors.accent} />}

            {showDropdown && results.length > 0 && (
                <View style={styles.dropdown}>
                    <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                        {results.map((item) => (
                            <TouchableOpacity
                                key={item.place_id.toString()}
                                style={styles.row}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.rowText} numberOfLines={1}>
                                    {formatLocationName(item)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};