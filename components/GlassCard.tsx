import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur'; // Ensure this is installed: npx expo install expo-blur

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.outline, style]}>
      <BlurView intensity={20} tint="dark" style={styles.glass}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: '#2D3343', // Soft doodle grey
    overflow: 'hidden',
    // Slight tilt or wobbly shadow if you want more "doodle" feel:
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  glass: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Very subtle glass
  },
});