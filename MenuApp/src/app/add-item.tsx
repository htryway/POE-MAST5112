import { Course, useMenu } from '@/Context/MenuContext';
import { menuTheme } from '@/constants/menuTheme';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddItemScreen() {
  const router = useRouter();
  const { addItem } = useMenu();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Starter');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Missing information', 'Please enter at least a dish name and price.');
      return;
    }
    addItem({ name, description, course, price });
    Alert.alert('Saved', `${name} was added to the menu.`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.heading}>New Dish</Text>
        <Text style={styles.subheading}>Fill in the details below to add it to the menu.</Text>

        <Text style={styles.label}>Dish Name</Text>
        <TextInput style={styles.input} placeholder="e.g. Bruschetta" placeholderTextColor={menuTheme.subtext} value={name} onChangeText={setName} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Describe the dish..."
          placeholderTextColor={menuTheme.subtext}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={course} onValueChange={(v) => setCourse(v)}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R)</Text>
        <TextInput style={styles.input} placeholder="e.g. 85.00" placeholderTextColor={menuTheme.subtext} value={price} onChangeText={setPrice} keyboardType="numeric" />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Item</Text>
        </TouchableOpacity>
      </ScrollView>
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
});
