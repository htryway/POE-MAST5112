import { Course, useMenu } from '@/Context/MenuContext';
import ConfirmModal from '@/components/ConfirmModal';
import { menuTheme } from '@/constants/menuTheme';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { menuItems, updateItem, deleteItem } = useMenu();

  const existingItem = menuItems.find((i) => i.id === id);

  const [name, setName] = useState(existingItem?.name ?? '');
  const [description, setDescription] = useState(existingItem?.description ?? '');
  const [course, setCourse] = useState<Course>(existingItem?.course ?? 'Starter');
  const [price, setPrice] = useState(existingItem?.price ?? '');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  if (!existingItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Item not found</Text>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    const priceNum = parseFloat(price);

    if (!name.trim()) {
      Alert.alert('Missing information', 'Please enter a dish name.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing information', 'Please enter a description for the dish.');
      return;
    }
    if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price greater than 0.');
      return;
    }

    updateItem({ id: existingItem.id, name: name.trim(), description: description.trim(), course, price });
    Alert.alert('Updated', `${name.trim()} was updated.`);
    router.back();
  };

  const confirmDelete = () => {
    deleteItem(existingItem.id);
    setConfirmVisible(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 20, paddingBottom: 250 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Edit Dish</Text>
          <Text style={styles.subheading}>Update the details below, or remove this dish from the menu.</Text>

          <Text style={styles.label}>Dish Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={course}
              onValueChange={(v) => setCourse(v)}
              style={{ color: menuTheme.charcoal }}
              dropdownIconColor={menuTheme.charcoal}
              mode="dropdown"
            >
              <Picker.Item label="Starter" value="Starter" />
              <Picker.Item label="Main Course" value="Main Course" />
              <Picker.Item label="Dessert" value="Dessert" />
            </Picker>
          </View>

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150)}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={() => setConfirmVisible(true)}>
            <Text style={styles.deleteButtonText}>Delete Dish</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={confirmVisible}
        title="Delete this dish?"
        message={`${existingItem.name} will be moved to "Recently Deleted", where it can be restored later.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: menuTheme.background },
  heading: { fontSize: 22, fontWeight: '800', color: menuTheme.charcoal },
  subheading: { fontSize: 13, color: menuTheme.subtext, marginTop: 4, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: menuTheme.charcoal, marginBottom: 6, marginTop: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: menuTheme.surface,
    borderWidth: 1,
    borderColor: menuTheme.border,
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: menuTheme.charcoal,
  },
  multiline: { height: 90, textAlignVertical: 'top' },
  pickerWrapper: { backgroundColor: menuTheme.surface, borderWidth: 1, borderColor: menuTheme.border, borderRadius: 10 },
  saveButton: { backgroundColor: menuTheme.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30, elevation: 2 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  deleteButton: {
    backgroundColor: menuTheme.surface,
    borderWidth: 1.5,
    borderColor: menuTheme.danger,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: { color: menuTheme.danger, fontWeight: '700', fontSize: 16 },
});