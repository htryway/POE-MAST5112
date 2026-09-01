import { DeletedMenuItem, useMenu } from '@/Context/MenuContext';
import ConfirmModal from '@/components/ConfirmModal';
import { courseStyle, menuTheme } from '@/constants/menuTheme';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatDeletedAt(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) +
    ' at ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function DeletedHistoryScreen() {
  const { deletedItems, restoreItem, permanentlyDeleteItem } = useMenu();
  const [pendingDelete, setPendingDelete] = useState<DeletedMenuItem | null>(null);

  const handleRestore = (item: DeletedMenuItem) => {
    restoreItem(item.id);
  };

  const confirmPermanentDelete = () => {
    if (pendingDelete) {
      permanentlyDeleteItem(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={styles.heading}>Recently Deleted</Text>
        <Text style={styles.subheading}>
          Dishes removed from the menu stay here so you can restore them if needed.
        </Text>
      </View>

      <FlatList
        data={deletedItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
        renderItem={({ item }) => {
          const badge = courseStyle[item.course];
          return (
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.dishName}>{item.name}</Text>
                <Text style={styles.price}>R{item.price}</Text>
              </View>
              <View style={[styles.courseBadge, { backgroundColor: badge.bg }]}>
                <Text style={styles.courseBadgeText}>{badge.emoji}  {item.course}</Text>
              </View>
              <Text style={styles.deletedAt}>Deleted {formatDeletedAt(item.deletedAt)}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.restoreButton} onPress={() => handleRestore(item)}>
                  <Text style={styles.restoreButtonText}>Restore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.permDeleteButton} onPress={() => setPendingDelete(item)}>
                  <Text style={styles.permDeleteButtonText}>Delete Forever</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nothing here — deleted dishes will show up in this list.</Text>}
      />

      <ConfirmModal
        visible={pendingDelete !== null}
        title="Delete forever?"
        message={pendingDelete ? `This will permanently remove ${pendingDelete.name}. This cannot be undone.` : ''}
        confirmLabel="Delete Forever"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmPermanentDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: menuTheme.background },
  heading: { fontSize: 22, fontWeight: '800', color: menuTheme.charcoal },
  subheading: { fontSize: 13, color: menuTheme.subtext, marginTop: 4, marginBottom: 8, lineHeight: 18 },
  card: {
    backgroundColor: menuTheme.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: menuTheme.border,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dishName: { fontSize: 16, fontWeight: '700', color: menuTheme.charcoal },
  price: { fontSize: 15, fontWeight: '700', color: menuTheme.primary },
  courseBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10, marginBottom: 8 },
  courseBadgeText: { fontSize: 12, fontWeight: '600', color: menuTheme.charcoal },
  deletedAt: { fontSize: 12, color: menuTheme.subtext, marginBottom: 12, fontStyle: 'italic' },
  actionRow: { flexDirection: 'row', gap: 10 },
  restoreButton: { flex: 1, backgroundColor: menuTheme.success, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  restoreButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  permDeleteButton: { flex: 1, backgroundColor: menuTheme.surface, borderWidth: 1, borderColor: menuTheme.danger, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  permDeleteButtonText: { color: menuTheme.danger, fontWeight: '700', fontSize: 13 },
  emptyText: { textAlign: 'center', color: menuTheme.subtext, marginTop: 40, lineHeight: 20 },
});

