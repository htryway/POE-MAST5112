import { courseStyle, menuTheme } from '@/constants/menuTheme';
import { MenuItem, useMenu } from '@/Context/MenuContext';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { menuItems, deletedItems } = useMenu();

  const renderItem = ({ item }: { item: MenuItem }) => {
    const badge = courseStyle[item.course];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/edit-item', params: { id: item.id } })}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.price}>R{item.price}</Text>
        </View>

        <View style={[styles.courseBadge, { backgroundColor: badge.bg }]}>
          <Text style={styles.courseBadgeText}>{badge.emoji}  {item.course}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>MENU MANAGER</Text>
          <Text style={styles.heading}>Christoffel's Menu</Text>
        </View>
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/deleted-history')}>
          <Text style={styles.historyButtonText}>🗑 {deletedItems.length}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 110 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No menu items yet.{'\n'}Tap "Add Item" below to get started.</Text>
        }
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-item')}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.overviewButton} onPress={() => router.push('/overview')}>
          <Text style={styles.overviewButtonText}>Search & Stats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: menuTheme.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, color: menuTheme.gold, fontWeight: '700' },
  heading: { fontSize: 26, fontWeight: '800', color: menuTheme.charcoal, marginTop: 2 },
  historyButton: {
    backgroundColor: menuTheme.surface,
    borderWidth: 1,
    borderColor: menuTheme.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  historyButtonText: { fontSize: 14, fontWeight: '600', color: menuTheme.charcoal },
  card: {
    backgroundColor: menuTheme.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: menuTheme.border,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dishName: { fontSize: 17, fontWeight: '700', color: menuTheme.charcoal, flexShrink: 1, paddingRight: 8 },
  price: { fontSize: 16, fontWeight: '700', color: menuTheme.primary },
  courseBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 8 },
  courseBadgeText: { fontSize: 12, fontWeight: '600', color: menuTheme.charcoal },
  description: { fontSize: 14, color: menuTheme.subtext, lineHeight: 19 },
  emptyText: { textAlign: 'center', color: menuTheme.subtext, marginTop: 60, fontSize: 15, lineHeight: 22 },
  buttonRow: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  addButton: { flex: 1, backgroundColor: menuTheme.primary, paddingVertical: 15, borderRadius: 12, alignItems: 'center', elevation: 3 },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  overviewButton: {
    flex: 1,
    backgroundColor: menuTheme.surface,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: menuTheme.primary,
  },
  overviewButtonText: { color: menuTheme.primary, fontWeight: '700', fontSize: 15 },
});
