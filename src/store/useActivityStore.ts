import { create } from 'zustand';

// Initial Mock Data
const MOCK_ACTIVITIES = [
  { id: 1, title: 'Partido de Fútbol 7 - Amistoso', category: 'Fútbol', locationName: 'Parque Araucano', exactAddress: 'Av. Pdte. Riesco 5330, Las Condes', organizerNote: 'Nos juntamos directo en la cancha 3. Llevar camiseta blanca o negra para hacer los equipos.', lat: -33.4005, lng: -70.5663, date: '2026-07-30', time: '19:00', maxParticipants: 14, participants: ['Elon Musk', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'], rating: 4.8 },
  { id: 2, title: 'Fútbol - Liga Dominical', category: 'Fútbol', locationName: 'Canchas San Joaquín', exactAddress: 'Av. Vicuña Mackenna 4860, Macul', organizerNote: 'Entrada por portería sur. Hay camarines disponibles para cambiarse.', lat: -33.4988, lng: -70.6122, date: '2026-07-31', time: '18:30', maxParticipants: 10, participants: ['Ronaldinho', 'Zinedine Zidane'], rating: 5.0 },
  { id: 3, title: 'Pichanga de Fin de Semana', category: 'Fútbol', locationName: 'Estadio Nacional (Anexas)', exactAddress: 'Av. Grecia 2001, Ñuñoa', organizerNote: 'Llevar hidratación, la cuota de la cancha se paga antes de jugar por transferencia.', lat: -33.4646, lng: -70.6105, date: '2026-08-01', time: '10:00', maxParticipants: 22, participants: ['Lionel Messi', 'Cristiano Ronaldo', 'Neymar Jr', 'Kylian Mbappé', 'Luka Modric', 'Vinícius Jr'], rating: 4.9 },
  { id: 4, title: 'Entrenamiento Running', category: 'Running', locationName: 'Parque Bicentenario', exactAddress: 'Bicentenario 3236, Vitacura', organizerNote: 'Nos encontramos frente a la laguna norte. Empezamos a trotar a las 07:15 en punto.', lat: -33.3970, lng: -70.6010, date: '2026-07-29', time: '07:00', maxParticipants: 10, participants: ['Usain Bolt', 'Eliud Kipchoge'], rating: 4.5 },
  { id: 5, title: 'Tenis Dobles', category: 'Tenis', locationName: 'Club Providencia', exactAddress: 'Pocuro 2878, Providencia', organizerNote: 'Cancha 5 de arcilla. Llevo tubo de pelotas nuevas.', lat: -33.4350, lng: -70.6030, date: '2026-08-01', time: '09:00', maxParticipants: 4, participants: ['Roger Federer', 'Rafa Nadal'], rating: 4.7 },
  { id: 6, title: 'Tarde de Café y Networking', category: 'Café', locationName: 'Starbucks Costanera', exactAddress: 'Andrés Bello 2425, Providencia', organizerNote: 'Mesa grande al fondo. Ideal para hablar de proyectos o solo pasar el rato.', lat: -33.4173, lng: -70.6063, date: '2026-07-31', time: '16:00', maxParticipants: 8, participants: ['Jeff Bezos', 'Sundar Pichai'], rating: 4.2 },
  { id: 7, title: 'Ruta Ciclismo San Cristóbal', category: 'Ciclismo', locationName: 'Cerro San Cristóbal', exactAddress: 'Acceso Pedro de Valdivia Norte, Providencia', organizerNote: 'Punto de encuentro: Barreras de entrada. Subiremos hasta la Virgen a ritmo moderado.', lat: -33.4243, lng: -70.6305, date: '2026-08-01', time: '09:00', maxParticipants: 20, participants: ['Tadej Pogačar', 'Nairo Quintana'], rating: 4.6 },
  { id: 8, title: 'Skate y Paseo', category: 'Paseo', locationName: 'Parque Bustamante', exactAddress: 'Av. Gral. Bustamante, Providencia', organizerNote: 'Juntémonos en el skatepark del Parque Bustamante.', lat: -33.4439, lng: -70.6306, date: '2026-08-02', time: '11:00', maxParticipants: 8, participants: ['Tony Hawk'], rating: 4.8 },
  { id: 9, title: 'Cena Italiana', category: 'Comer', locationName: 'Barrio Italia', exactAddress: 'Av. Italia 1449, Providencia', organizerNote: 'Reserva para 6 en la terraza. Nos encontramos directo en el restaurante.', lat: -33.4452, lng: -70.6234, date: '2026-08-02', time: '21:00', maxParticipants: 6, participants: ['Leonardo DiCaprio'], rating: 4.9 },
  { id: 10, title: '3x3 de Básquetbol', category: 'Básquet', locationName: 'Canchas Los Leones', exactAddress: 'Av. Los Leones 2500, Providencia', organizerNote: 'Llegar 15 min antes para calentar. La cancha es de cemento al aire libre.', lat: -33.4200, lng: -70.6050, date: '2026-08-03', time: '18:00', maxParticipants: 6, participants: ['Michael Jordan', 'LeBron James', 'Kobe Bryant'], rating: 4.8 },
  { id: 11, title: 'Partido Pádel 4ta Cat', category: 'Pádel', locationName: 'Club Palestino', exactAddress: 'Av. Kennedy 9351, Las Condes', organizerNote: 'Falta uno para cerrar el partido de 4ta categoría. Nivel intermedio.', lat: -33.3885, lng: -70.5482, date: '2026-08-01', time: '19:00', maxParticipants: 4, participants: ['Fernando Belasteguín', 'Juan Lebrón'], rating: 4.9 },
  { id: 12, title: 'Entrenamiento Pesas', category: 'Gym', locationName: 'SmartFit Costanera', exactAddress: 'Mall Costanera Center, Providencia', organizerNote: 'Día de pecho y tríceps. Nos turnamos las máquinas para ir rápido.', lat: -33.4173, lng: -70.6063, date: '2026-07-31', time: '14:00', maxParticipants: 2, participants: ['Arnold Schwarzenegger'], rating: 4.5 },
  { id: 13, title: 'Estreno Cine Deadpool', category: 'Cine', locationName: 'Cinépolis La Reina', exactAddress: 'Av. Ossa 655, La Reina', organizerNote: 'Compré las entradas en la fila G al medio. Transfiéranme para asegurar su asiento.', lat: -33.4533, lng: -70.5694, date: '2026-08-04', time: '20:30', maxParticipants: 6, participants: ['Ryan Reynolds', 'Hugh Jackman'], rating: 4.7 }
];

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface ActivityStoreState {
  activities: any[];
  chats: Record<number, ChatMessage[]>;
  updateActivity: (id: number, data: any) => void;
  addActivity: (data: any) => void;
  addMessage: (activityId: number, message: ChatMessage) => void;
}

export const useActivityStore = create<ActivityStoreState>((set) => ({
  activities: MOCK_ACTIVITIES,
  chats: {
    1: [
      { id: '1', sender: 'Organizador', text: '¡Hola a todos! Nos vemos a la hora acordada. Lleguen 10 min antes.', time: '10:00', isMe: false },
      { id: '2', sender: 'Elon Musk', text: '¡Ahí estaremos! Llevo pelota.', time: '10:05', isMe: false }
    ]
  },
  
  updateActivity: (id, data) => set((state) => ({
    activities: state.activities.map(act => act.id === id ? { ...act, ...data } : act)
  })),
  
  addActivity: (data) => set((state) => ({
    activities: [{ ...data, id: Date.now() }, ...state.activities]
  })),
  
  addMessage: (activityId, message) => set((state) => {
    const activityChats = state.chats[activityId] || [];
    return {
      chats: {
        ...state.chats,
        [activityId]: [...activityChats, message]
      }
    };
  })
}));
