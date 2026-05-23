import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { RANKS, getCurrentRank } from '../utils/missions';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants/theme';

export default function RanksScreen() {
  const router = useRouter();
  const exp = useUserStore(s => s.profile.exp);
  const currentRank = getCurrentRank(exp);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rank Progression</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Your exp: {exp} • Your rank: {currentRank.icon} {currentRank.name}</Text>

        {RANKS.map((rank, idx) => {
          const isUnlocked = exp >= rank.minExp;
          const isCurrent = rank.name === currentRank.name;
          const nextRank = RANKS[idx + 1];

          return (
            <View key={rank.name} style={[styles.rankCard, isCurrent && styles.rankCardCurrent, !isUnlocked && styles.rankCardLocked]}>
              <View style={[styles.rankIconBox, { backgroundColor: rank.color + (isUnlocked ? '25' : '10') }]}>
                <Text style={[styles.rankEmoji, !isUnlocked && styles.locked]}>{rank.icon}</Text>
              </View>
              <View style={styles.rankInfo}>
                <View style={styles.rankRow}>
                  <Text style={[styles.rankName, { color: isUnlocked ? rank.color : Colors.textMuted }]}>
                    {rank.name}
                  </Text>
                  {isCurrent && <View style={styles.currentBadge}><Text style={styles.currentText}>CURRENT</Text></View>}
                  {!isUnlocked && <Text style={styles.lockedIcon}>🔒</Text>}
                </View>
                <Text style={styles.rankExp}>
                  {isUnlocked ? `✓ Unlocked at ${rank.minExp} EXP` : `Requires ${rank.minExp} EXP`}
                </Text>
                {isCurrent && nextRank && (
                  <Text style={styles.nextHint}>{nextRank.minExp - exp} EXP until {nextRank.name}</Text>
                )}
              </View>
              {/* Progress fill for current */}
              {isCurrent && nextRank && (
                <View style={styles.miniBar}>
                  <View style={[styles.miniBarFill, {
                    width: `${((exp - rank.minExp) / (nextRank.minExp - rank.minExp)) * 100}%`,
                    backgroundColor: rank.color,
                  }]} />
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.xl, borderBottomWidth: 1, borderColor: Colors.border },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: Colors.textSecondary },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  scroll: { flex: 1 },
  content: { padding: Spacing.xl, gap: Spacing.md },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.sm },
  rankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.xl, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  rankCardCurrent: { borderColor: Colors.accent, borderWidth: 2 },
  rankCardLocked: { opacity: 0.5 },
  rankIconBox: { width: 52, height: 52, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  rankEmoji: { fontSize: 28 },
  locked: { opacity: 0.4 },
  rankInfo: { flex: 1, gap: 3 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rankName: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  currentBadge: { backgroundColor: Colors.accent + '25', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.round },
  currentText: { fontSize: 9, color: Colors.accent, fontWeight: FontWeight.bold, letterSpacing: 1 },
  lockedIcon: { fontSize: 14 },
  rankExp: { fontSize: FontSize.xs, color: Colors.textSecondary },
  nextHint: { fontSize: FontSize.xs, color: Colors.amber },
  miniBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: Colors.surface },
  miniBarFill: { height: '100%' },
});
