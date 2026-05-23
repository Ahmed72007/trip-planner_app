import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/useUserStore';
import { RankBar } from '../../components/RankBar';
import { MissionCard } from '../../components/MissionCard';
import { useTheme } from '../../constants/useTheme';
import type { ThemeColors } from '../../constants/useTheme';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: { padding: Spacing.xl, gap: Spacing.xl },
    header: { gap: Spacing.xs },
    title: { fontSize: FontSize.xxxl, fontWeight: FontWeight.heavy, color: C.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: C.textSecondary },
    expSummary: { flexDirection: 'row', gap: Spacing.md },
    expCard: {
      flex: 1, backgroundColor: C.surfaceLight,
      borderRadius: 16, padding: Spacing.md,
      alignItems: 'center', borderWidth: 1, borderColor: C.border,
    },
    expNum: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: C.accent },
    expLabel: { fontSize: FontSize.xs, color: C.textSecondary, marginTop: 2 },
    section: { gap: Spacing.sm },
    sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: C.textPrimary },
  });
}

export default function MissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { missions, profile } = useUserStore();

  const completedMissions = missions.filter(m => m.completed);
  const activeMissions = missions.filter(m => !m.completed);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Missions 🎯</Text>
          <Text style={styles.subtitle}>Complete missions to level up your rank</Text>
        </View>

        <RankBar exp={profile.exp} onPress={() => router.push('/ranks')} />

        <View style={styles.expSummary}>
          <View style={styles.expCard}>
            <Text style={styles.expNum}>{profile.exp}</Text>
            <Text style={styles.expLabel}>Total EXP</Text>
          </View>
          <View style={styles.expCard}>
            <Text style={styles.expNum}>{completedMissions.length}</Text>
            <Text style={styles.expLabel}>Completed</Text>
          </View>
          <View style={styles.expCard}>
            <Text style={styles.expNum}>{activeMissions.length}</Text>
            <Text style={styles.expLabel}>Remaining</Text>
          </View>
        </View>

        {activeMissions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Missions</Text>
            {activeMissions.map(m => <MissionCard key={m.id} mission={m} />)}
          </View>
        )}

        {completedMissions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed ✓</Text>
            {completedMissions.map(m => <MissionCard key={m.id} mission={m} />)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
