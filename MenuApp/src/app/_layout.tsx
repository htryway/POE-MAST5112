import { MenuProvider } from '@/Context/MenuContext';
import { menuTheme } from '@/constants/menuTheme';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <MenuProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: menuTheme.primary },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: menuTheme.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Christoffel's Menu" }} />
        <Stack.Screen name="add-item" options={{ title: 'Add Menu Item' }} />
        <Stack.Screen name="edit-item" options={{ title: 'Edit Menu Item' }} />
        <Stack.Screen name="overview" options={{ title: 'Menu Overview' }} />
        <Stack.Screen name="deleted-history" options={{ title: 'Recently Deleted' }} />
      </Stack>
    </MenuProvider>
  );
}