// Design tokens for the Menu Manager app.
// A warm, restaurant-inspired palette instead of a generic blue "corporate" theme.

export const menuTheme = {
  background: '#FBF6EF',      // warm cream background
  surface: '#FFFFFF',
  charcoal: '#2B2118',        // primary text
  subtext: '#8A7B6C',
  primary: '#C1533E',         // terracotta — main accent
  primaryDark: '#9C3F2E',
  gold: '#D4A24C',            // secondary accent
  success: '#5B8266',
  danger: '#B33F3F',
  border: '#EAE0D3',
  chipInactive: '#F1E6D8',
};

export const courseStyle: Record<string, { bg: string; emoji: string }> = {
  Starter: { bg: '#EAF3E9', emoji: '🥗' },
  'Main Course': { bg: '#FBEAE4', emoji: '🍽️' },
  Dessert: { bg: '#FBF0DD', emoji: '🍰' },
};
