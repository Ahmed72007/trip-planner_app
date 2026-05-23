import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useTripStore } from '../../store/useTripStore';

export default function JoinTripScreen() {
    const { tripId } = useGlobalSearchParams<{ tripId: string }>();
    const router = useRouter();
    const addTrip = useTripStore(s => (s as any).addTrip);
    const trips = useTripStore(s => s.trips);

    useEffect(() => {
        const processJoin = async () => {
            try {
                // 1. Check if they already have this trip locally
                const existingTrip = trips.find(t => t.id === tripId);
                if (existingTrip) {
                    router.replace(`/trip/${tripId}`);
                    return;
                }

                // 2. See who is clicking the link
                const { data: { user } } = await supabase.auth.getUser();

                // Define the new member
                const newMember = {
                    id: user ? user.id : `guest_${Date.now()}`,
                    name: user ? (user.email?.split('@')[0] || 'Friend') : 'Guest Explorer'
                };

                // 3. Fetch the trip from Supabase
                const { data: tripData, error: fetchError } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('id', tripId)
                    .single();

                if (fetchError || !tripData) {
                    Alert.alert('Trip Not Found', 'This invite link might be expired or invalid.');
                    router.replace('/');
                    return;
                }

                const tripJson = tripData.itinerary_json;

                // 4. Check if they are already in the members list
                const isAlreadyMember = tripJson.members?.some((m: any) => m.id === newMember.id);

                if (!isAlreadyMember) {
                    // Add them to the array
                    tripJson.members = [...(tripJson.members || []), newMember];

                    // 5. Save the updated list back to the cloud so everyone sees them!
                    await supabase
                        .from('trips')
                        .update({ itinerary_json: tripJson })
                        .eq('id', tripId);
                }

                // 6. Save to their local phone store
                addTrip({ id: tripId, ...tripJson });

                // 7. Push them into the trip!
                router.replace(`/trip/${tripId}`);

            } catch (err) {
                console.error('Join Error:', err);
                Alert.alert('Error', 'Could not join the trip right now.');
                router.replace('/');
            }
        };

        processJoin();
    }, [tripId]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#7C3AED" />
            <Text style={styles.text}>Unpacking your invite... 🧳</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F1117', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 20 }
});