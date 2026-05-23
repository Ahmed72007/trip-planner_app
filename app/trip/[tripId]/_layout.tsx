import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTripStore } from '../../../store/useTripStore';
import { useEffect, useState, useMemo } from 'react';
import React from 'react';
import { useTheme } from '../../../constants/useTheme';
import type { ThemeColors } from '../../../constants/useTheme';

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    center: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
    root: { flex: 1, backgroundColor: C.background },
    tabBar: {
      backgroundColor: C.surface,
      height: 55,
      borderTopWidth: 2,
      marginHorizontal: 20,
      marginBottom: 48,
      borderRadius: 35,
      position: 'absolute',
      bottom: 0,
      elevation: 10,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 15,
      borderWidth: 2,
      borderColor: C.border,
      paddingBottom: 10,
    },
    tabLabel: { fontSize: 11, fontWeight: '800', marginTop: -3 },
    notFound: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center', gap: 20 },
    notFoundEmoji: { fontSize: 70 },
    notFoundText: { fontSize: 20, color: C.textSecondary, fontWeight: 'bold' },
  });
}

export default function TripLayout() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const trips = useTripStore(s => s.trips);
  const setCurrentTrip = useTripStore(s => s.setCurrentTrip);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (tripId) setCurrentTrip(tripId);
  }, [tripId]);

  const trip = trips.find(t => t.id === tripId);

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundEmoji}>🏜️</Text>
        <Text style={styles.notFoundText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Plan', tabBarIcon: ({ focused }) => <Text style={{ opacity: focused ? 1 : 0.5, fontSize: 17 }}>🗓️</Text> }}
        />
        <Tabs.Screen
          name="outline"
          options={{ title: 'Info', tabBarIcon: ({ focused }) => <Text style={{ opacity: focused ? 1 : 0.5, fontSize: 18 }}>📋</Text> }}
        />
        <Tabs.Screen
          name="arrangements"
          options={{ title: 'Stay', tabBarIcon: ({ focused }) => <Text style={{ opacity: focused ? 1 : 0.5, fontSize: 18 }}>🏨</Text> }}
        />
        <Tabs.Screen
          name="expenses"
          options={{ title: 'Money', tabBarIcon: ({ focused }) => <Text style={{ opacity: focused ? 1 : 0.5, fontSize: 18 }}>💰</Text> }}
        />
        <Tabs.Screen
          name="journal"
          options={{ title: 'Notes', tabBarIcon: ({ focused }) => <Text style={{ opacity: focused ? 1 : 0.5, fontSize: 18 }}>📝</Text> }}
        />
      </Tabs>
    </View>
  );
}