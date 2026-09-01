import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Course = 'Starter' | 'Main Course' | 'Dessert';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: string;
};

export type DeletedMenuItem = MenuItem & {
  deletedAt: string; // ISO timestamp of when it was deleted
};

type MenuContextType = {
  menuItems: MenuItem[];
  deletedItems: DeletedMenuItem[];
  isLoaded: boolean;
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: string) => void;
  restoreItem: (id: string) => void;
  permanentlyDeleteItem: (id: string) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MENU_KEY = 'menuApp:menuItems';
const DELETED_KEY = 'menuApp:deletedItems';

const DEFAULT_ITEMS: MenuItem[] = [
  { id: '1', name: 'Bruschetta', description: 'Toasted bread topped with tomato, basil and garlic.', course: 'Starter', price: '55.00' },
  { id: '2', name: 'Grilled Sirloin', description: '300g sirloin steak served with roasted vegetables.', course: 'Main Course', price: '185.00' },
  { id: '3', name: 'Malva Pudding', description: 'Warm sponge pudding with caramel sauce and custard.', course: 'Dessert', price: '65.00' },
];

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [deletedItems, setDeletedItems] = useState<DeletedMenuItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved data once when the app starts.
  useEffect(() => {
    (async () => {
      try {
        const [savedMenu, savedDeleted] = await Promise.all([
          AsyncStorage.getItem(MENU_KEY),
          AsyncStorage.getItem(DELETED_KEY),
        ]);
        setMenuItems(savedMenu ? JSON.parse(savedMenu) : DEFAULT_ITEMS);
        setDeletedItems(savedDeleted ? JSON.parse(savedDeleted) : []);
      } catch (error) {
        console.warn('Failed to load saved menu data, starting with defaults.', error);
        setMenuItems(DEFAULT_ITEMS);
        setDeletedItems([]);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  // Persist menu items whenever they change (after the initial load).
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(MENU_KEY, JSON.stringify(menuItems)).catch((error) =>
      console.warn('Failed to save menu items.', error)
    );
  }, [menuItems, isLoaded]);

  // Persist deleted history whenever it changes (after the initial load).
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(DELETED_KEY, JSON.stringify(deletedItems)).catch((error) =>
      console.warn('Failed to save deleted items.', error)
    );
  }, [deletedItems, isLoaded]);

  const addItem = (item: Omit<MenuItem, 'id'>) => {
    setMenuItems((prev) => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const updateItem = (updated: MenuItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const deleteItem = (id: string) => {
    setMenuItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        setDeletedItems((prevDeleted) => [
          { ...target, deletedAt: new Date().toISOString() },
          ...prevDeleted,
        ]);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const restoreItem = (id: string) => {
    setDeletedItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        const { deletedAt, ...restored } = target;
        setMenuItems((prevMenu) => [...prevMenu, restored]);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const permanentlyDeleteItem = (id: string) => {
    setDeletedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <MenuContext.Provider
      value={{ menuItems, deletedItems, isLoaded, addItem, updateItem, deleteItem, restoreItem, permanentlyDeleteItem }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}

