import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { menuTheme } from '@/constants/menuTheme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// A custom confirmation dialog, used instead of Alert.alert.
// Alert.alert's multi-button behaviour relies on the browser's native
// confirm() popup when running on web, which is unreliable inside
// embedded/preview browser windows (it can be silently blocked).
// This component renders its own overlay so it behaves the same
// on phone, tablet, and web.
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: destructive ? menuTheme.danger : menuTheme.primary }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(43, 33, 24, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: menuTheme.surface,
    borderRadius: 16,
    padding: 22,
  },
  title: { fontSize: 17, fontWeight: '800', color: menuTheme.charcoal, marginBottom: 8 },
  message: { fontSize: 14, color: menuTheme.subtext, lineHeight: 20, marginBottom: 20 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: menuTheme.border,
  },
  cancelButtonText: { color: menuTheme.charcoal, fontWeight: '700', fontSize: 14 },
  confirmButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  confirmButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
