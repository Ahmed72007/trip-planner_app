import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on both web and native.
 * On web, falls back to window.confirm/window.alert when RN Alert fails.
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: Array<{ text: string; style?: string; onPress?: () => void }>
) {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      // Confirmation dialog
      const destructiveBtn = buttons.find(b => b.style === 'destructive');
      const confirmBtn = destructiveBtn || buttons.find(b => b.text !== 'Cancel');
      const confirmed = window.confirm(`${title}${message ? '\n\n' + message : ''}`);
      if (confirmed && confirmBtn?.onPress) {
        confirmBtn.onPress();
      }
    } else if (buttons && buttons.length === 1 && buttons[0].onPress) {
      window.alert(`${title}${message ? '\n\n' + message : ''}`);
      buttons[0].onPress();
    } else {
      window.alert(`${title}${message ? '\n\n' + message : ''}`);
    }
  } else {
    Alert.alert(title, message, buttons as any);
  }
}
