import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import { CreateModal } from '../../components/CreateModal';
import { router } from 'expo-router';
import { useTheme } from '../../constants/useTheme';
import type { ThemeColors } from '../../constants/useTheme';

// ─── Style Factory ────────────────────────────────────────────────────────────
function createStyles(C: ThemeColors) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: C.surface,
      borderTopWidth: 0,
      height: 60,
      // 👇 DROPPED TO ZERO to remove all bottom space
      paddingBottom: 10,
      // 👇 Adjusted to push icons down naturally
      paddingTop: 10,
      position: 'absolute',
      bottom: 45,
      left: 100,
      right: 80,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: C.border,
      elevation: 10,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 15,
      overflow: 'visible',
    },
    createBtn: {
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    createInner: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: C.accent,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: C.background,
      shadowColor: C.accent,
      shadowOpacity: 0.6,
      shadowRadius: 15,
    },
    iconWrap: { width: 48, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    iconWrapActive: { backgroundColor: C.accent + '22' },
    iconEmoji: { fontSize: 22, opacity: 0.4 },
    iconEmojiActive: { opacity: 1 },
    createPlus: { fontSize: 40, color: '#FFF', fontWeight: '200' },
  });
}

// ─── Doodle style tab icon ────────────────────────────────────────────────────
function TabIcon({ emoji, focused, styles }: { emoji: string; focused: boolean; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={[styles.iconEmoji, focused && styles.iconEmojiActive]}>{emoji}</Text>
    </View>
  );
}

// ─── Doodle style "+" button ──────────────────────────────────────────────────
function CreateTabButton({ onPress, styles }: { onPress: () => void; styles: ReturnType<typeof createStyles> }) {
  return (
    <TouchableOpacity style={styles.createBtn} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.createInner}>
        <Text style={styles.createPlus}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const [createVisible, setCreateVisible] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleOptionSelect = (type: 'plan' | 'guide') => {
    setCreateVisible(false);
    if (type === 'plan') {
      router.push('/create-trip');
    } else {
      router.push('/publish-guide');
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} styles={styles} /> }}
        />
        <Tabs.Screen
          name="missions"
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" focused={focused} styles={styles} /> }}
        />

        {/* THE CENTERED + BUTTON */}
        <Tabs.Screen
          name="create-tab"
          options={{
            tabBarButton: (props) => (
              <CreateTabButton {...props} onPress={() => setCreateVisible(true)} styles={styles} />
            ),
          }}
        />

        <Tabs.Screen
          name="checklists"
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="✅" focused={focused} styles={styles} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} styles={styles} /> }}
        />
      </Tabs>

      <CreateModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onSelect={handleOptionSelect}
      />
    </>
  );
}   