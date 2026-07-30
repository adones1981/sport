'use client';

// ─── Estructura centralizada de categorías ─────────────────────────────────
export interface Category {
  name: string;
  emoji: string;
}

export interface CategoryGroup {
  name: string;
  emoji: string;
  categories: Category[];
}

export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  'Equipo': {
    name: 'Equipo', emoji: '⚽',
    categories: [
      { name: 'Fútbol', emoji: '⚽' },
      { name: 'Futbolito', emoji: '⚽' },
      { name: 'Futsal', emoji: '⚽' },
      { name: 'Pádel', emoji: '🎾' },
      { name: 'Tenis', emoji: '🎾' },
      { name: 'Squash', emoji: '🎾' },
      { name: 'Básquetbol', emoji: '🏀' },
      { name: 'Vóleibol', emoji: '🏐' },
      { name: 'Rugby', emoji: '🏉' },
      { name: 'Flag Football', emoji: '🏈' },
      { name: 'Hándbol', emoji: '🤾' },
      { name: 'Bádminton', emoji: '🏸' },
      { name: 'Pickleball', emoji: '🏸' },
    ]
  },
  'Fitness': {
    name: 'Fitness', emoji: '🏃',
    categories: [
      { name: 'Running', emoji: '🏃' },
      { name: 'Ciclismo', emoji: '🚴' },
      { name: 'Gym', emoji: '🏋️' },
      { name: 'Calistenia', emoji: '🏋️' },
      { name: 'Yoga', emoji: '🧘' },
      { name: 'Escalada', emoji: '🧗' },
      { name: 'Trekking', emoji: '🥾' },
      { name: 'Skate', emoji: '🛹' },
      { name: 'Boxeo', emoji: '🥊' },
      { name: 'Frisbee', emoji: '🥏' },
      { name: 'Surf', emoji: '🏄' },
    ]
  },
  'Recreativo': {
    name: 'Recreativo', emoji: '🎱',
    categories: [
      { name: 'Billar', emoji: '🎱' },
      { name: 'Bowling', emoji: '🎳' },
      { name: 'Ping Pong', emoji: '🏓' },
      { name: 'Dardos', emoji: '🎯' },
      { name: 'Ajedrez', emoji: '♟️' },
      { name: 'Juegos de Mesa', emoji: '🎲' },
    ]
  },
  'Social': {
    name: 'Social', emoji: '☕',
    categories: [
      { name: 'Café', emoji: '☕' },
      { name: 'Comer', emoji: '🍔' },
      { name: 'Cerveza', emoji: '🍺' },
      { name: 'Cine', emoji: '🎬' },
      { name: 'Paseo Mascotas', emoji: '🐕' },
      { name: 'Fotografía', emoji: '📸' },
      { name: 'Música', emoji: '🎵' },
      { name: 'Paseo', emoji: '🌳' },
    ]
  },
  'Completada': {
    name: 'Completada', emoji: '🌭',
    categories: [
      { name: 'Completada', emoji: '🌭' },
    ]
  },
};

// Lista plana de todas las categorías
export const ALL_CATEGORIES: Category[] = Object.values(CATEGORY_GROUPS).flatMap(g => g.categories);

// Mapa de nombre → emoji para lookup rápido
export const CATEGORY_EMOJI_MAP: Record<string, string> = Object.fromEntries(
  ALL_CATEGORIES.map(c => [c.name, c.emoji])
);

// Mapa de nombre de categoría → nombre del grupo
export const CATEGORY_TO_GROUP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_GROUPS).flatMap(([groupName, group]) =>
    group.categories.map(cat => [cat.name, groupName])
  )
);

// Helper para obtener emoji por nombre de categoría
export function getCategoryEmojiByName(name: string): string {
  return CATEGORY_EMOJI_MAP[name] || '📍';
}
