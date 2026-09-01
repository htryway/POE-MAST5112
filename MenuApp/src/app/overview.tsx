import { useMenu } from '@/Context/MenuContext';
import { courseStyle, menuTheme } from '@/constants/menuTheme';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COURSES = ['All', 'Starter', 'Main Course', 'Dessert'] as const;

export default function OverviewScreen() {
  const { menuItems } = useMenu();
  const [search, setSearch] = useState('');
  const [activeCourse, setActiveCourse] = useState<(typeof COURSES)[number]>('All');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = activeCourse === 'All' || item.course === activeCourse;
      return matchesSearch && matchesCourse;
    });
  }, [menuItems, search, activeCourse]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { Starter: 0, 'Main Course': 0, Dessert: 0 };
    menuItems.forEach((item) => { counts[item.course]++; });
    return counts;
  }, [menuItems]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={styles.heading}>Overview & Search</Text>

        <TextInput
          style={styles.search}
          placeholder="Search by dish name..."
          placeholderTextColor={menuTheme.subtext}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterRow}>
          {COURSES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.filterChip, activeCourse === c && styles.filterChipActive]}
              onPress={() => setActiveCourse(c)}
            >
              <Text style={[styles.filterChipText, activeCourse === c && styles.filterChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.Starter}</Text>
            <Text style={styles.statLabel}>Starters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats['Main Course']}</Text>
            <Text style={styles.statLabel}>Mains</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.Dessert}</Text>
            <Text style={styles.statLabel}>Desserts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menuItems.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        renderItem={({ item }) => {
          const badge = courseStyle[item.course];
          return (
            <View style={styles.card}>
              <Text style={styles.dishName}>{item.name} — R{item.price}</Text>
              <View style={[styles.courseBadge, { backgroundColor: badge.bg }]}>
                <Text style={styles.courseBadgeText}>{badge.emoji}  {item.course}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No matching items.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: menuTheme.background },
  heading: { fontSize: 22, fontWeight: '800', color: menuTheme.charcoal, marginBottom: 14 },
  search: { backgroundColor: menuTheme.surface, borderWidth: 1, borderColor: menuTheme.border, borderRadius: 10, padding: 13, marginBottom: 12, color: menuTheme.charcoal },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: menuTheme.chipInactive },
  filterChipActive: { backgroundColor: menuTheme.primary },
  filterChipText: { color: menuTheme.charcoal, fontWeight: '600', fontSize: 13 },
  filterChipTextActive: { color: '#fff' },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: menuTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: menuTheme.border,
    paddingVertical: 14,
    marginBottom: 8,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: menuTheme.border },
  statNumber: { fontSize: 18, fontWeight: '800', color: menuTheme.primary },
  statLabel: { fontSize: 11, color: menuTheme.subtext, marginTop: 2 },
  card: { backgroundColor: menuTheme.surface, borderRadius: 10, padding: 13, marginBottom: 10, borderWidth: 1, borderColor: menuTheme.border },
  dishName: { fontSize: 15, fontWeight: '700', color: menuTheme.charcoal, marginBottom: 6 },
  courseBadge: { alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10 },
  courseBadgeText: { fontSize: 12, fontWeight: '600', color: menuTheme.charcoal },
  emptyText: { textAlign: 'center', color: menuTheme.subtext, marginTop: 20 },
});
