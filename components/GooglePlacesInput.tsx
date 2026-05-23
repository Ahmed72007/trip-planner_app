import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

// 🛑 PASTE YOUR GOOGLE MAPS API KEY HERE
const GOOGLE_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface Props {
    placeholder: string;
    value: string;
    onSelect: (address: string) => void;
    // '(cities)' only shows cities/countries. 'establishment' shows restaurants/museums/etc.
    type?: '(cities)' | 'establishment' | 'geocode';
}

export function GooglePlacesInput({ placeholder, value, onSelect, type = '(cities)' }: Props) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Debounced API Call
    useEffect(() => {
        if (query.length > 2 && query !== value) {
            const fetchPlaces = async () => {
                setLoading(true);
                try {
                    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=${type}&key=${GOOGLE_API_KEY}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.status === 'OK') {
                        setResults(data.predictions);
                        setShowDropdown(true);
                    }
                } catch (error) {
                    console.error("Google Maps API Error:", error);
                } finally {
                    setLoading(false);
                }
            };

            const timeoutId = setTimeout(fetchPlaces, 500); // Wait 500ms after typing stops
            return () => clearTimeout(timeoutId);
        } else {
            setShowDropdown(false);
        }
    }, [query]);

    const handleSelect = (description: string) => {
        setQuery(description); // Set input text to selection
        setShowDropdown(false); // Hide dropdown
        onSelect(description); // Send data back to the parent screen
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#8E8E93"
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    if (text === '') onSelect('');
                }}
                onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            />

            {loading && <ActivityIndicator style={styles.loader} color="#7C3AED" />}

            {/* DOODLE DROPDOWN MENU */}
            {showDropdown && results.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.place_id}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item.description)}>
                                <Text style={styles.resultIcon}>{type === '(cities)' ? '🌍' : '📍'}</Text>
                                <Text style={styles.resultText} numberOfLines={1}>{item.description}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative', zIndex: 100, marginBottom: 25 },
    input: {
        backgroundColor: '#161922',
        borderRadius: 20,
        padding: 18,
        color: '#FFF',
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#2D3343',
    },
    loader: { position: 'absolute', right: 20, top: 20 },
    dropdown: {
        position: 'absolute',
        top: 65, // Just below the input
        left: 0,
        right: 0,
        backgroundColor: '#161922',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#7C3AED', // Purple glow border to show it's active
        maxHeight: 200,
        zIndex: 999,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2D3343',
    },
    resultIcon: { fontSize: 18, marginRight: 10 },
    resultText: { color: '#FFF', fontSize: 14, fontWeight: '600', flex: 1 },
});