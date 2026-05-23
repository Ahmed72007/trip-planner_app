import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, TextInput, Modal, Pressable, Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../../store/useUserStore';
import { useTripStore } from '../../store/useTripStore';
import { useTheme } from '../../constants/useTheme';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';
import { getCurrentRank } from '../../utils/missions';
import { useRouter } from 'expo-router';

const INTERESTS = ['adventure', 'food', 'culture', 'nature', 'nightlife', 'shopping', 'relaxation', 'photography', 'history', 'art'];
const INTEREST_ICONS: Record<string, string> = {
  adventure: '⛰️', food: '🍽️', culture: '🎭', nature: '🌿', nightlife: '🌙',
  shopping: '🛍️', relaxation: '🧘', photography: '📸', history: '🏛️', art: '🎨',
};

// ─── Dynamic StyleSheet Factory ─────────────────────────────────────────────
// Generates a StyleSheet whose colors come from the active palette.
function createStyles(C: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.background },
    scroll: { flex: 1 },
    content: { padding: Spacing.xl, gap: Spacing.xl },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xl,
      paddingTop: Spacing.md,
    },
    avatarWrap: { position: 'relative' },
    avatar: { width: 80, height: 80, borderRadius: 40 },
    avatarPlaceholder: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: C.accent + '30',
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 2, borderColor: C.accent,
    },
    avatarEmoji: { fontSize: 36 },
    avatarEditBadge: {
      position: 'absolute', bottom: 0, right: 0,
      backgroundColor: C.surface, borderRadius: 12, padding: 3,
      borderWidth: 1, borderColor: C.border,
    },
    avatarEditText: { fontSize: 12 },
    profileInfo: { flex: 1, gap: Spacing.xs },
    profileName: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: C.textPrimary },
    profileId: { fontSize: FontSize.xs, color: C.textMuted },
    rankBadge: {
      flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: C.surfaceLight,
      paddingHorizontal: Spacing.md, paddingVertical: 4,
      borderRadius: BorderRadius.round, borderWidth: 1, borderColor: C.border,
    },
    rankIcon: { fontSize: 16 },
    rankName: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    stat: {
      flex: 1, backgroundColor: C.surfaceLight, borderRadius: BorderRadius.lg,
      padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: C.border,
    },
    statIcon: { fontSize: 18, marginBottom: 4 },
    statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.heavy, color: C.textPrimary },
    statLabel: { fontSize: FontSize.xs, color: C.textSecondary, marginTop: 2 },
    section: { gap: Spacing.md },
    sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: C.textSecondary },
    sectionCard: {
      backgroundColor: C.surfaceLight, borderRadius: BorderRadius.xl,
      borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg,
      gap: Spacing.md,
    },
    settingIcon: { fontSize: 20, width: 28 },
    settingLabel: { flex: 1, fontSize: FontSize.md, color: C.textPrimary },
    dangerText: { color: C.error },
    settingChevron: { fontSize: 22, color: C.textMuted },
    divider: { height: 1, backgroundColor: C.divider, marginLeft: 60 },
    interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    interestTag: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
      backgroundColor: C.surfaceLight, borderRadius: BorderRadius.round,
      borderWidth: 1.5, borderColor: C.border,
    },
    interestTagActive: { backgroundColor: C.accent + '20', borderColor: C.accent },
    interestIcon: { fontSize: 14 },
    interestText: { fontSize: FontSize.sm, color: C.textSecondary, textTransform: 'capitalize' },
    interestTextActive: { color: C.accentLight, fontWeight: FontWeight.medium },
    backdrop: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
    },
    editModal: {
      backgroundColor: C.surface, borderRadius: BorderRadius.xxl,
      padding: Spacing.xxl, width: '100%',
      borderWidth: 1, borderColor: C.border, gap: Spacing.xl,
    },
    modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: C.textPrimary },
    nameInput: {
      backgroundColor: C.surfaceLight, borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
      color: C.textPrimary, fontSize: FontSize.lg,
      borderWidth: 1, borderColor: C.border,
    },
    modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.xl },
    cancelText: { fontSize: FontSize.md, color: C.textSecondary, paddingVertical: Spacing.sm },
    saveBtn: {
      backgroundColor: C.accent, borderRadius: BorderRadius.round,
      paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
    },
    saveText: { color: C.background, fontWeight: FontWeight.semibold, fontSize: FontSize.md },
  });
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { profile, updateProfile, setAvatar, toggleDarkMode } = useUserStore();
  const trips = useTripStore(s => s.trips);
  const currentRank = getCurrentRank(profile.exp);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(profile.name);

  // Regenerate styles only when the palette reference changes
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSaveName = () => {
    if (nameValue.trim()) {
      updateProfile({ name: nameValue.trim() });
    }
    setEditingName(false);
  };

  const handleToggleInterest = (interest: string) => {
    const current = profile.interests as string[];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    updateProfile({ interests: updated as any });
  };

  const SECTIONS = [
    {
      title: 'Preferences',
      items: [
        { label: 'Dark Mode', icon: '🌙', isSwitch: true, value: profile.darkMode, onToggle: toggleDarkMode },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Personal Info', icon: '👤', onPress: () => setEditingName(true) },
        { label: 'My Plans', icon: '✈️', onPress: () => router.push('/(tabs)') },
        { label: 'Give Feedback', icon: '💬', onPress: () => {} },
        { label: 'Rate on Play Store', icon: '⭐', onPress: () => {} },
      ],
    },
    {
      title: 'About',
      items: [
        { label: 'About App', icon: 'ℹ️', onPress: () => {} },
        { label: 'Terms of Use', icon: '📄', onPress: () => {} },
        { label: 'Privacy Policy', icon: '🔒', onPress: () => {} },
      ],
    },
    {
      title: '',
      items: [
        { label: 'Log Out', icon: '🚪', onPress: () => Alert.alert('Log Out', 'Coming soon with auth!'), danger: true },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditText}>📷</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={styles.profileName}>{profile.name}</Text>
            </TouchableOpacity>
            <Text style={styles.profileId}>ID: {profile.id}</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankIcon}>{currentRank.icon}</Text>
              <Text style={[styles.rankName, { color: currentRank.color }]}>{currentRank.name}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Trips', value: trips.length, icon: '✈️' },
            { label: 'EXP', value: profile.exp, icon: '⭐' },
            { label: 'Interests', value: profile.interests.length, icon: '❤️' },
          ].map(s => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Interests</Text>
          <View style={styles.interestGrid}>
            {INTERESTS.map(interest => {
              const active = profile.interests.includes(interest as any);
              return (
                <TouchableOpacity
                  key={interest}
                  style={[styles.interestTag, active && styles.interestTagActive]}
                  onPress={() => handleToggleInterest(interest)}
                >
                  <Text style={styles.interestIcon}>{INTEREST_ICONS[interest]}</Text>
                  <Text style={[styles.interestText, active && styles.interestTextActive]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Settings Sections */}
        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? <Text style={styles.sectionTitle}>{section.title}</Text> : null}
            <View style={styles.sectionCard}>
              {section.items.map((item: any, ii) => (
                <React.Fragment key={item.label}>
                  {ii > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={item.isSwitch ? undefined : item.onPress}
                    activeOpacity={item.isSwitch ? 1 : 0.7}
                  >
                    <Text style={styles.settingIcon}>{item.icon}</Text>
                    <Text style={[styles.settingLabel, item.danger && styles.dangerText]}>
                      {item.label}
                    </Text>
                    {item.isSwitch ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.border, true: colors.accent }}
                        thumbColor={colors.textPrimary}
                      />
                    ) : (
                      <Text style={styles.settingChevron}>›</Text>
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal visible={editingName} transparent animationType="fade" onRequestClose={() => setEditingName(false)}>
        <Pressable style={styles.backdrop} onPress={() => setEditingName(false)}>
          <View style={styles.editModal} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.nameInput}
              value={nameValue}
              onChangeText={setNameValue}
              autoFocus
              selectTextOnFocus
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setEditingName(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
