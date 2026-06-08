// SportSquad - Main JavaScript Application File

// --- TRANSLATION DICTIONARY (ES / EN) ---
const translations = {
  es: {
    nav_create_btn: "Publicar Actividad",
    hero_title: "¿Falta un jugador? ¿Buscas partner?",
    hero_desc: "No entrenes solo. Encuentra personas para correr, compartir una membresía de gimnasio, jugar al fútbol, básquetbol, hacer ciclismo o senderismo cerca de ti.",
    hero_cta: "¡Publica tu actividad ahora!",
    filter_all_sports: "Todos los Deportes",
    sport_running: "Running / Correr",
    sport_soccer: "Fútbol",
    sport_gym: "Gimnasio",
    sport_cycling: "Ciclismo",
    sport_basketball: "Básquetbol",
    sport_hiking: "Senderismo / Trekking",
    sport_tennis: "Tenis / Pádel",
    sport_online: "Jugar en línea",
    sport_movies: "Ir al Cine",
    sport_shopping: "Ir de compras",
    sport_beach: "Ir a la playa",
    sport_coffee: "Cafetería",
    sport_other: "Otro",
    filter_all: "Todos",
    feed_heading: "Actividades Disponibles",
    create_modal_title: "Publicar Actividad",
    form_title_label: "Título de la Actividad",
    form_title_placeholder: "Ej: Partido de fútbol 5 - faltan 2 jugadores",
    form_sport_label: "Deporte / Categoría",
    form_select_sport_placeholder: "Selecciona un deporte",
    form_custom_sport_label: "Nombre del Deporte Personalizado",
    form_custom_sport_placeholder: "Ej: CrossFit, Yoga, Natación, Pádel...",
    form_datetime_label: "Fecha y Hora",
    form_spots_label: "Cupos Totales Necesitados / Disponibles",
    form_spots_placeholder: "Ej: 5",
    form_location_label: "Nombre del Lugar / Dirección",
    form_location_placeholder: "Ej: Complejo Deportivo Centenario, Parque del Retiro...",
    form_map_label: "Selecciona la Ubicación en el Mapa",
    form_map_helper: "Haz clic en el mapa para marcar el punto de encuentro",
    form_map_selected: "Ubicación fijada en el mapa!",
    form_desc_label: "Descripción de la Actividad",
    form_desc_placeholder: "Detalla de qué trata la actividad, si deben llevar algún equipo, nivel de intensidad, etc...",
    cancel: "Cancelar",
    publish: "Publicar Actividad",
    detail_when: "Cuándo",
    detail_where: "Dónde",
    detail_spots: "Cupos Disponibles",
    detail_host: "Organizador",
    join_activity: "Inscribirse a la Actividad",
    leave_activity: "Cancelar mi Inscripción",
    detail_participants: "Participantes Inscritos",
    detail_comments: "Preguntas y Comentarios",
    comment_placeholder: "Escribe tu pregunta o comentario...",
    profile_modal_title: "Ajustes de Perfil",
    profile_choose_avatar: "Elige tu Avatar",
    profile_name_label: "Tu Nombre",
    profile_email_label: "Correo de Contacto",
    profile_phone_label: "Teléfono de Contacto (Opcional)",
    save: "Guardar Cambios",
    spots_remaining_suffix: "cupos libres",
    spots_full: "¡Sin cupos!",
    host_badge: "Creador",
    alert_joined: "¡Te has inscrito con éxito en la actividad!",
    alert_left: "Has cancelado tu inscripción en la actividad.",
    alert_created: "¡Actividad publicada con éxito!",
    alert_comment_added: "Comentario publicado.",
    alert_profile_saved: "Perfil de usuario actualizado con éxito.",
    alert_map_required: "Por favor, selecciona una ubicación en el mapa haciendo clic en él.",
    search_placeholder: "Buscar actividad o lugar...",
    lang_active: "Idioma cambiado a Español",
    spots_open_feed: "activas",
    other_custom_label: "Otro: ",
    search_address_btn: "Buscar en Mapa",
    alert_address_not_found: "Ubicación no encontrada. Intenta con una dirección más específica o márcala manualmente.",
    searching_address: "Buscando...",
    alert_suggested_selected: "Ubicación seleccionada: ",
    nearby_suggestions_title: "Sugerencias cercanas encontradas",
    no_suggestions_found: "No se encontraron sugerencias deportivas en el mapa. Prueba buscando otra dirección.",
    loading_suggestions: "Buscando instalaciones y parques cercanos...",
    suggested_park: "Parque / Zona Verde",
    suggested_pitch: "Pista Deportiva / Campo",
    suggested_gym: "Gimnasio / Centro Deportivo",
    delete_activity: "Eliminar / Cancelar Actividad",
    alert_deleted: "Actividad eliminada con éxito.",
    edit_activity: "Editar Actividad",
    alert_edited: "Actividad editada con éxito.",
    mobile_show_map: "Ver Mapa",
    mobile_show_list: "Ver Lista"
  },
  en: {
    nav_create_btn: "Post an Activity",
    hero_title: "Need a player? Looking for a partner?",
    hero_desc: "Don't train alone. Find people to run, share a gym membership, play soccer, basketball, go cycling or hiking near you.",
    hero_cta: "Publish your activity now!",
    filter_all_sports: "All Sports",
    sport_running: "Running",
    sport_soccer: "Soccer",
    sport_gym: "Gym Share",
    sport_cycling: "Cycling",
    sport_basketball: "Basketball",
    sport_hiking: "Hiking / Trekking",
    sport_tennis: "Tennis / Padel",
    sport_online: "Online Gaming",
    sport_movies: "Movies",
    sport_shopping: "Shopping",
    sport_beach: "Beach",
    sport_coffee: "Coffee Shop",
    sport_other: "Other",
    filter_all: "All",
    feed_heading: "Available Activities",
    create_modal_title: "Publish Activity",
    form_title_label: "Activity Title",
    form_title_placeholder: "e.g., Mixed 5-a-side Soccer - need 2 players",
    form_sport_label: "Sport / Category",
    form_select_sport_placeholder: "Select a sport",
    form_custom_sport_label: "Custom Sport Name",
    form_custom_sport_placeholder: "e.g., CrossFit, Yoga, Swimming, Padel...",
    form_datetime_label: "Date and Time",
    form_spots_label: "Total Spots Available / Needed",
    form_spots_placeholder: "e.g., 5",
    form_location_label: "Location Name / Address",
    form_location_placeholder: "e.g., Centenario Sports Complex, Retiro Park...",
    form_map_label: "Select Location on the Map",
    form_map_helper: "Click on the map to mark the meeting point",
    form_map_selected: "Location marked on the map!",
    form_desc_label: "Activity Description",
    form_desc_placeholder: "Detail what the activity is about, if they should bring gear, intensity level, etc...",
    cancel: "Cancel",
    publish: "Publish Activity",
    detail_when: "When",
    detail_where: "Where",
    detail_spots: "Available Spots",
    detail_host: "Host",
    join_activity: "Join Activity",
    leave_activity: "Leave Activity",
    detail_participants: "Joined Participants",
    detail_comments: "Questions & Comments",
    comment_placeholder: "Write your question or comment...",
    profile_modal_title: "Profile Settings",
    profile_choose_avatar: "Choose your Avatar",
    profile_name_label: "Your Name",
    profile_email_label: "Contact Email",
    profile_phone_label: "Contact Phone (Optional)",
    save: "Save Changes",
    spots_remaining_suffix: "spots left",
    spots_full: "No spots left!",
    host_badge: "Host",
    alert_joined: "Successfully joined the activity!",
    alert_left: "You have left the activity.",
    alert_created: "Activity successfully published!",
    alert_comment_added: "Comment posted.",
    alert_profile_saved: "User profile successfully updated.",
    alert_map_required: "Please select a location on the map by clicking on it.",
    search_placeholder: "Search activities or locations...",
    lang_active: "Language changed to English",
    spots_open_feed: "active",
    other_custom_label: "Other: ",
    search_address_btn: "Search on Map",
    alert_address_not_found: "Location not found. Try a more specific address or mark it manually.",
    searching_address: "Searching...",
    alert_suggested_selected: "Selected location: ",
    nearby_suggestions_title: "Nearby suggestions found",
    no_suggestions_found: "No nearby sports suggestions found on the map. Try searching for another address.",
    loading_suggestions: "Searching for nearby facilities and parks...",
    suggested_park: "Park / Green Area",
    suggested_pitch: "Sports Court / Pitch",
    suggested_gym: "Gym / Sports Center",
    delete_activity: "Delete / Cancel Activity",
    alert_deleted: "Activity successfully deleted.",
    edit_activity: "Edit Activity",
    alert_edited: "Activity successfully updated.",
    mobile_show_map: "Show Map",
    mobile_show_list: "Show List"
  }
};

// --- AVATAR LIBRARY ---
const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", // Sofia (default)
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100", // Alejandro
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", // Lucia
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", // Marcos
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"  // Javier
];

// --- INITIAL DUMMY DATA ---
const defaultActivities = [
  {
    id: "act-1",
    hostName: "Clara Mendoza",
    hostEmail: "clara@sportsquad.com",
    hostPhone: "+34 611 223 344",
    hostAvatar: AVATARS[2],
    sport: "running",
    customSport: "",
    title: "Running matutino por El Retiro",
    datetime: "2026-06-10T08:30",
    spotsTotal: 6,
    spotsJoined: [
      { name: "Clara Mendoza", email: "clara@sportsquad.com", avatar: AVATARS[2] },
      { name: "Carlos Perez", email: "carlos@gmail.com", avatar: AVATARS[3] }
    ],
    locationName: "Parque del Retiro (Entrada Puerta de Alcalá)",
    lat: 40.420317,
    lng: -3.688755,
    description: "Salida suave de running para empezar el día. Ritmo aproximado de 5:30 min/km. Haremos unos 8 kilómetros en total. ¡Cualquiera es bienvenido a unirse!",
    comments: [
      {
        user: "Carlos Perez",
        avatar: AVATARS[3],
        text: "¿Hacéis estiramientos al final?",
        timestamp: "2026-06-06T18:00"
      },
      {
        user: "Clara Mendoza",
        avatar: AVATARS[2],
        text: "¡Sí, claro! Dedicamos siempre unos 10 minutos al final.",
        timestamp: "2026-06-06T18:15"
      }
    ]
  },
  {
    id: "act-2",
    hostName: "Alejandro Ortiz",
    hostEmail: "alejandro@sportsquad.com",
    hostPhone: "+34 655 443 322",
    hostAvatar: AVATARS[1],
    sport: "soccer",
    customSport: "",
    title: "Fútbol 7 mixto - ¡Falta portero y defensa!",
    datetime: "2026-06-11T20:00",
    spotsTotal: 14,
    spotsJoined: [
      { name: "Alejandro Ortiz", email: "alejandro@sportsquad.com", avatar: AVATARS[1] },
      { name: "Javier Ruiz", email: "javier@gmail.com", avatar: AVATARS[4] }
    ],
    locationName: "Canal de Isabel II (Campos de Fútbol)",
    lat: 40.441865,
    lng: -3.707641,
    description: "Tenemos reservado campo de fútbol 7. Jugamos un partido amistoso entre amigos pero nos faltan un par de personas para completar los dos equipos. Principalmente buscamos portero, pero cualquiera puede rotar.",
    comments: []
  },
  {
    id: "act-3",
    hostName: "Sofia Vergara",
    hostEmail: "sofia@sportsquad.com",
    hostPhone: "+34 600 999 888",
    hostAvatar: AVATARS[0],
    sport: "gym",
    customSport: "",
    title: "Compartir pase/membresía - Basic-Fit Atocha",
    datetime: "2026-06-08T17:00",
    spotsTotal: 2,
    spotsJoined: [
      { name: "Sofia Vergara", email: "sofia@sportsquad.com", avatar: AVATARS[0] }
    ],
    locationName: "Gym Basic-Fit Atocha",
    lat: 40.406381,
    lng: -3.691456,
    description: "Tengo un pase inteligente en Basic-Fit que me permite llevar a un acompañante gratis cada vez que voy. Busco a alguien que quiera ir conmigo a entrenar fuerza por las tardes de forma regular. ¡Ideal para motivarnos!",
    comments: []
  },
  {
    id: "act-4",
    hostName: "Lucía Fernández",
    hostEmail: "lucia@sportsquad.com",
    hostPhone: "+34 688 777 666",
    hostAvatar: AVATARS[2],
    sport: "hiking",
    customSport: "",
    title: "Senderismo en La Pedriza (Nivel Medio)",
    datetime: "2026-06-14T09:00",
    spotsTotal: 10,
    spotsJoined: [
      { name: "Lucía Fernández", email: "lucia@sportsquad.com", avatar: AVATARS[2] }
    ],
    locationName: "Parking Cantocochino, Manzanares El Real",
    lat: 40.748301,
    lng: -3.899661,
    description: "Ruta circular en La Pedriza pasando por el Yelmo. Unos 12 km de distancia con 600 metros de desnivel acumulado. Nivel físico medio. Llevad botas de montaña, agua (mínimo 1.5L) y algo de comida.",
    comments: []
  },
  {
    id: "act-5",
    hostName: "Javier Ruiz",
    hostEmail: "javier@gmail.com",
    hostPhone: "+34 677 888 999",
    hostAvatar: AVATARS[4],
    sport: "cycling",
    customSport: "",
    title: "Ruta bici de carretera por Colmenar",
    datetime: "2026-06-13T08:00",
    spotsTotal: 8,
    spotsJoined: [
      { name: "Javier Ruiz", email: "javier@gmail.com", avatar: AVATARS[4] }
    ],
    locationName: "Rotonda de Plaza Castilla (Salida carril bici)",
    lat: 40.466847,
    lng: -3.689163,
    description: "Salida en bicicleta de carretera hasta Colmenar Viejo y vuelta por Soto. Unos 70 kilómetros a ritmo moderado (media de 24-26 km/h). Parada para café obligatorio. ¡Trae tu casco!",
    comments: []
  },
  {
    id: "act-6",
    hostName: "Carlos Perez",
    hostEmail: "carlos@gmail.com",
    hostPhone: "",
    hostAvatar: AVATARS[3],
    sport: "online",
    customSport: "",
    title: "Torneo de Valorant (Rango Platino)",
    datetime: "2026-06-09T22:00",
    spotsTotal: 5,
    spotsJoined: [
      { name: "Carlos Perez", email: "carlos@gmail.com", avatar: AVATARS[3] }
    ],
    locationName: "Servidor Discord",
    lat: 0,
    lng: 0,
    description: "Buscando 4 jugadores para hacer equipo completo en Valorant. Rango Platino/Diamante. Usaremos Discord para comunicarnos.",
    comments: []
  },
  {
    id: "act-7",
    hostName: "Sofia Vergara",
    hostEmail: "sofia@sportsquad.com",
    hostPhone: "",
    hostAvatar: AVATARS[0],
    sport: "coffee",
    customSport: "",
    title: "Tarde de café y charla sobre tecnología",
    datetime: "2026-06-12T17:30",
    spotsTotal: 4,
    spotsJoined: [
      { name: "Sofia Vergara", email: "sofia@sportsquad.com", avatar: AVATARS[0] }
    ],
    locationName: "Starbucks Callao",
    lat: 40.4201,
    lng: -3.7058,
    description: "Busco personas interesadas en tecnología y programación para tomar un café y charlar un rato, intercambiar ideas y hacer networking.",
    comments: []
  },
  {
    id: "act-8",
    hostName: "Alejandro Ortiz",
    hostEmail: "alejandro@sportsquad.com",
    hostPhone: "",
    hostAvatar: AVATARS[1],
    sport: "movies",
    customSport: "",
    title: "Ir al cine a ver la nueva película de Marvel",
    datetime: "2026-06-14T20:30",
    spotsTotal: 3,
    spotsJoined: [
      { name: "Alejandro Ortiz", email: "alejandro@sportsquad.com", avatar: AVATARS[1] }
    ],
    locationName: "Cinesa Proyecciones",
    lat: 40.4312,
    lng: -3.7028,
    description: "Tengo muchas ganas de ir a ver el estreno pero mis amigos no pueden. ¡Anímate y compramos palomitas grandes!",
    comments: []
  },
  {
    id: "act-9",
    hostName: "Marcos Torres",
    hostEmail: "marcos@gmail.com",
    hostPhone: "+34 699 000 111",
    hostAvatar: AVATARS[3],
    sport: "other",
    customSport: "Pádel Dobles",
    title: "Pádel en el Parque de Santander - Falta 1 para el doble",
    datetime: "2026-06-09T19:00",
    spotsTotal: 4,
    spotsJoined: [
      { name: "Marcos Torres", email: "marcos@gmail.com", avatar: AVATARS[3] },
      { name: "Alejandro Ortiz", email: "alejandro@sportsquad.com", avatar: AVATARS[1] },
      { name: "Sofia Vergara", email: "sofia@sportsquad.com", avatar: AVATARS[0] }
    ],
    locationName: "Parque de Santander (Pistas de Pádel)",
    lat: 40.443912,
    lng: -3.714582,
    description: "Tenemos alquilada la pista para mañana a las 19:00. Nivel intermedio (2.5 - 3.0). Nos falta exactamente un jugador para poder jugar el partido de dobles de hora y media. ¡Apúntate!",
    comments: []
  }
];

// --- APP GLOBAL STATE ---
let appState = {
  currentLang: "es",
  theme: "dark",
  activities: [],
  profile: {
    name: "Sofía Vergara",
    email: "sofia@sportsquad.com",
    phone: "+34 600 999 888",
    avatar: AVATARS[0]
  },
  selectedActivityId: null,
  activeFilterSport: "all",
  activeSearchQuery: "",
  mainMap: null,
  pickerMap: null,
  mainTileLayer: null,
  pickerTileLayer: null,
  pickerMarker: null,
  mapMarkers: [],
  suggestionMarkers: [],
  isEditing: false,
  editingActivityId: null,
  mobileView: "feed"
};

// --- DOM ELEMENTS ---
const elements = {
  langEsBtn: document.getElementById("lang-es-btn"),
  langEnBtn: document.getElementById("lang-en-btn"),
  openCreateModalBtn: document.getElementById("open-create-modal-btn"),
  heroCreateBtn: document.getElementById("hero-create-btn"),
  navProfileBtn: document.getElementById("nav-profile-btn"),
  navUserName: document.getElementById("nav-user-name"),
  navUserAvatar: document.getElementById("nav-user-avatar"),
  searchInput: document.getElementById("search-input"),
  sportFilter: document.getElementById("sport-filter"),
  categoryTabs: document.getElementById("category-tabs"),
  resultsCount: document.getElementById("results-count"),
  activityListContainer: document.getElementById("activity-list-container"),
  logoLink: document.getElementById("logo-link"),
  
  // Create Modal
  createModal: document.getElementById("create-modal-overlay"),
  closeCreateModal: document.getElementById("close-create-modal"),
  cancelCreateBtn: document.getElementById("cancel-create-btn"),
  createActivityForm: document.getElementById("create-activity-form"),
  formSport: document.getElementById("form-sport"),
  customSportContainer: document.getElementById("custom-sport-container"),
  formCustomSport: document.getElementById("form-custom-sport"),
  formLocation: document.getElementById("form-location"),
  formLat: document.getElementById("form-lat"),
  formLng: document.getElementById("form-lng"),
  mapSelectionStatus: document.getElementById("map-selection-status"),
  searchAddressBtn: document.getElementById("search-address-btn"),
  
  // Detail Modal
  detailModal: document.getElementById("detail-modal-overlay"),
  closeDetailModal: document.getElementById("close-detail-modal"),
  detailSportBadge: document.getElementById("detail-sport-badge"),
  detailModalTitle: document.getElementById("detail-modal-title"),
  detailDatetime: document.getElementById("detail-datetime"),
  detailLocationName: document.getElementById("detail-location-name"),
  detailSpotsCount: document.getElementById("detail-spots-count"),
  detailHostName: document.getElementById("detail-host-name"),
  detailDescription: document.getElementById("detail-description"),
  joinActivityBtn: document.getElementById("join-activity-btn"),
  detailParticipantsList: document.getElementById("detail-participants-list"),
  hostControlsContainer: document.getElementById("host-controls-container"),
  deleteActivityBtn: document.getElementById("delete-activity-btn"),
  editActivityBtn: document.getElementById("edit-activity-btn"),
  detailSpotsText: document.getElementById("detail-spots-text"),
  commentSubmitForm: document.getElementById("comment-submit-form"),
  commentInputField: document.getElementById("comment-input-field"),
  detailCommentsContainer: document.getElementById("detail-comments-container"),
  
  // Profile Modal
  profileModal: document.getElementById("profile-modal-overlay"),
  closeProfileModal: document.getElementById("close-profile-modal"),
  cancelProfileBtn: document.getElementById("cancel-profile-btn"),
  profileEditForm: document.getElementById("profile-edit-form"),
  profileCurrentAvatarImg: document.getElementById("profile-current-avatar-img"),
  avatarOptionsList: document.getElementById("avatar-options-list"),
  profileNameInput: document.getElementById("profile-name-input"),
  profileEmailInput: document.getElementById("profile-email-input"),
  profilePhoneInput: document.getElementById("profile-phone-input"),
  
  // Toast Notification Container
  toastContainer: document.getElementById("toast-container"),
  
  // Mobile Toggling
  mobileViewToggle: document.getElementById("mobile-view-toggle"),
  mobileToggleBtn: document.getElementById("mobile-toggle-btn"),
  mobileToggleIcon: document.getElementById("mobile-toggle-icon"),
  mobileToggleText: document.getElementById("mobile-toggle-text"),
  feedPanelView: document.getElementById("feed-panel-view"),
  mapPanelView: document.getElementById("map-panel-view"),
  
  // Theme Toggling
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  themeToggleIcon: document.getElementById("theme-toggle-icon")
};

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://uhgxtxvsizhwwqxwefka.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZ3h0eHZzaXpod3dxeHdlZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODE3NzMsImV4cCI6MjA5NjM1Nzc3M30.8uemPyDqbmio9Ik8paYd8WlBJeFzwF4PZ_NM94bBdJ4';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- INITIALIZE APPLICATION ---
async function initApp() {
  // Load State from LocalStorage (theme, lang, profile)
  loadLocalStorage();

  // Apply active theme to DOM
  applyTheme();

  // Update UI Elements with User Profile Info
  updateProfileNavUI();

  // Initialize Maps
  initMainMap();

  // Fetch activities from Supabase
  await fetchActivities();
  
  // Setup Supabase Realtime listeners
  setupRealtime();

  // Render Activities list & map markers
  renderActivities();

  // Setup Event Listeners
  setupEventListeners();

  // Apply default translation
  applyTranslations();

  // Initialize mobile view setup
  handleMobileViewInit();
}

// --- LOCAL STORAGE FUNCTIONS ---
function loadLocalStorage() {
  // Load profile
  const savedProfile = localStorage.getItem("sportsquad_profile");
  if (savedProfile) {
    appState.profile = JSON.parse(savedProfile);
  } else {
    localStorage.setItem("sportsquad_profile", JSON.stringify(appState.profile));
  }

  // Load language
  const savedLang = localStorage.getItem("sportsquad_lang");
  if (savedLang) {
    appState.currentLang = savedLang;
  }

  // Load theme
  const savedTheme = localStorage.getItem("sportsquad_theme");
  if (savedTheme) {
    appState.theme = savedTheme;
  } else {
    appState.theme = "dark";
  }
}

function saveProfileToStorage() {
  localStorage.setItem("sportsquad_profile", JSON.stringify(appState.profile));
  updateProfileNavUI();
}

// --- SUPABASE DATA FUNCTIONS ---
async function fetchActivities(isSeeding = false) {
  try {
    const { data, error } = await supabaseClient
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Map DB snake_case to JS camelCase
      appState.activities = data.map(act => ({
        id: act.id,
        hostName: act.host_name,
        hostEmail: act.host_email,
        hostPhone: act.host_phone,
        hostAvatar: act.host_avatar,
        sport: act.sport,
        customSport: act.custom_sport || "",
        title: act.title,
        datetime: act.datetime,
        spotsTotal: act.spots_total,
        spotsJoined: act.spots_joined || [],
        locationName: act.location_name,
        lat: act.lat,
        lng: act.lng,
        description: act.description,
        comments: act.comments || []
      }));
    } else {
      if (!isSeeding) {
        console.log("Database empty. Seeding defaults...");
        // If db is empty, initialize with default activities to have some demo data
        for (const act of defaultActivities) {
          const { error: insertError } = await supabaseClient.from('activities').insert({
            host_name: act.hostName,
            host_email: act.hostEmail,
            host_phone: act.hostPhone,
            host_avatar: act.hostAvatar,
            sport: act.sport,
            custom_sport: act.customSport,
            title: act.title,
            datetime: act.datetime,
            spots_total: act.spotsTotal,
            spots_joined: act.spotsJoined,
            location_name: act.locationName,
            lat: act.lat,
            lng: act.lng,
            description: act.description,
            comments: act.comments
          });
          if (insertError) console.error("Error seeding row:", insertError);
        }
        // Fetch again after inserting defaults, but pass true to prevent infinite loop
        await fetchActivities(true); 
      } else {
        // If it's still empty after trying to seed, or seeding failed, just show empty
        console.warn("Seeding failed or database is still empty.");
        appState.activities = [];
      }
    }
  } catch (err) {
    console.error("Error fetching activities:", err);
    // Fallback to empty array if supabase fails
    appState.activities = [];
  }
}

function setupRealtime() {
  supabaseClient
    .channel('public:activities')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, payload => {
      console.log('Realtime change received!', payload);
      fetchActivities().then(() => renderActivities());
    })
    .subscribe();
}

function saveActivitiesToStorage() {
  // Obsolete function. Left empty so we don't break sync calls, 
  // but actual saves are handled via async Supabase calls now.
}

// --- TOAST NOTIFICATIONS ---
function showToast(messageKey, isCustomText = false) {
  const messageText = isCustomText ? messageKey : translations[appState.currentLang][messageKey];
  const toast = document.createElement("div");
  toast.className = "alert-banner";
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <span>${messageText}</span>
  `;
  elements.toastContainer.appendChild(toast);
  
  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// --- TRANSLATION FUNCTIONALITY ---
function applyTranslations() {
  const lang = appState.currentLang;
  
  // Set html element lang
  document.documentElement.lang = lang;

  // Toggle active class on lang buttons
  if (lang === "es") {
    elements.langEsBtn.classList.add("active");
    elements.langEnBtn.classList.remove("active");
  } else {
    elements.langEnBtn.classList.add("active");
    elements.langEsBtn.classList.remove("active");
  }

  // Translate all elements with data-translate attribute
  const translateElements = document.querySelectorAll("[data-translate]");
  translateElements.forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Translate all placeholders
  const placeholderElements = document.querySelectorAll("[data-translate-placeholder]");
  placeholderElements.forEach(el => {
    const key = el.getAttribute("data-translate-placeholder");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Re-render activities to show translated categories
  renderActivities();

  // Update mobile toggle button text translation
  updateMobileToggleButton();
}

// --- UI UPDATES ---
function updateProfileNavUI() {
  elements.navUserName.textContent = appState.profile.name;
  elements.navUserAvatar.src = appState.profile.avatar;
}

// --- MAP FUNCTIONS ---
function initMainMap() {
  // Centered on Madrid center [40.416775, -3.703790] by default
  appState.mainMap = L.map('map', {
    zoomControl: false
  }).setView([40.418, -3.703], 13);
  
  L.control.zoom({
    position: 'bottomright'
  }).addTo(appState.mainMap);

  const tileUrl = appState.theme === "light"
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';


  // Map Layer from CartoDB (Visual aesthetic excellence)
  appState.mainTileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20
  }).addTo(appState.mainMap);

  // Try to geolocate user on dashboard load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        appState.mainMap.setView([lat, lng], 13);
      },
      (error) => {
        console.log("Geolocation permission denied or error. Using default location.");
      }
    );
  }
}

function initPickerMap() {
  if (appState.pickerMap) {
    // Already initialized, force size recalculation and center
    centerPickerOnUserLocation();
    return;
  }

  // Centered on Madrid center [40.416775, -3.703790]
  appState.pickerMap = L.map('picker-map').setView([40.418, -3.703], 13);

  const tileUrl = appState.theme === "light"
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';


  appState.pickerTileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 20
  }).addTo(appState.pickerMap);

  // Map click handler to select coordinate point
  appState.pickerMap.on("click", function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    updatePickerLocation(lat, lng);
    fetchNearbySuggestions(lat, lng);
    reverseGeocode(lat, lng);
  });

  centerPickerOnUserLocation();
}

function updatePickerLocation(lat, lng, name = "") {
  elements.formLat.value = lat;
  elements.formLng.value = lng;
  
  if (name) {
    elements.formLocation.value = name;
  }
  
  // Update label
  elements.mapSelectionStatus.textContent = translations[appState.currentLang].form_map_selected + ` (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  elements.mapSelectionStatus.style.color = "var(--accent-green)";

  // Update marker on picker map
  const latlng = L.latLng(lat, lng);
  if (appState.pickerMarker) {
    appState.pickerMarker.setLatLng(latlng);
  } else {
    appState.pickerMarker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background:var(--accent-orange); width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 10px rgba(0,0,0,0.5)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })
    }).addTo(appState.pickerMap);
  }
}

function centerPickerOnUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        appState.pickerMap.setView([lat, lng], 14);
        
        updatePickerLocation(lat, lng);
        fetchNearbySuggestions(lat, lng);
      },
      (error) => {
        console.log("Picker Map Geolocation error, using default.");
        const defaultLat = 40.418;
        const defaultLng = -3.703;
        appState.pickerMap.setView([defaultLat, defaultLng], 13);
        updatePickerLocation(defaultLat, defaultLng);
        fetchNearbySuggestions(defaultLat, defaultLng);
      }
    );
  } else {
    const defaultLat = 40.418;
    const defaultLng = -3.703;
    appState.pickerMap.setView([defaultLat, defaultLng], 13);
    updatePickerLocation(defaultLat, defaultLng);
    fetchNearbySuggestions(defaultLat, defaultLng);
  }
  
  // Force Leaflet recalculation once loaded in modal layout
  setTimeout(() => appState.pickerMap.invalidateSize(), 200);
}

async function fetchNearbySuggestions(lat, lng) {
  // Clear old suggestion markers
  if (appState.suggestionMarkers) {
    appState.suggestionMarkers.forEach(m => appState.pickerMap.removeLayer(m));
  }
  appState.suggestionMarkers = [];

  // Update status helper
  elements.mapSelectionStatus.textContent = translations[appState.currentLang].loading_suggestions;
  elements.mapSelectionStatus.style.color = "var(--accent-cyan)";

  try {
    const query = `[out:json][timeout:15];(
      node["leisure"="pitch"](around:1500, ${lat}, ${lng});
      node["leisure"="sports_centre"](around:1500, ${lat}, ${lng});
      node["leisure"="park"](around:1500, ${lat}, ${lng});
      way["leisure"="pitch"](around:1500, ${lat}, ${lng});
      way["leisure"="sports_centre"](around:1500, ${lat}, ${lng});
      way["leisure"="park"](around:1500, ${lat}, ${lng});
    );out center;`;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout fallback

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    let elementsFound = data.elements || [];
    elementsFound = elementsFound.filter(el => el.tags && el.tags.name);

    if (elementsFound.length > 0) {
      elementsFound.forEach(el => {
        const itemLat = el.lat || (el.center && el.center.lat);
        const itemLng = el.lon || (el.center && el.center.lon);
        if (!itemLat || !itemLng) return;

        createSuggestionMarker(itemLat, itemLng, el.tags);
      });
      
      elements.mapSelectionStatus.textContent = translations[appState.currentLang].form_map_selected + ` (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
      elements.mapSelectionStatus.style.color = "var(--accent-green)";
    } else {
      generateFallbackSuggestions(lat, lng);
    }
  } catch (error) {
    console.log("Failed to fetch suggestions from Overpass API, using simulated fallbacks:", error);
    generateFallbackSuggestions(lat, lng);
  }
}

function createSuggestionMarker(lat, lng, tags) {
  const name = tags.name;
  const leisure = tags.leisure;
  const sport = tags.sport || "";
  
  let color = "#39ff14"; // Green for parks
  let iconClass = "fa-tree";
  let typeLabel = translations[appState.currentLang].suggested_park;

  if (leisure === "pitch") {
    color = "#00f0ff"; // Cyan for pitches
    iconClass = sport.includes("soccer") || sport.includes("futbol") ? "fa-futbol" : "fa-basketball";
    typeLabel = translations[appState.currentLang].suggested_pitch;
  } else if (leisure === "sports_centre") {
    color = "#bd00ff"; // Purple for gym/sports center
    iconClass = "fa-dumbbell";
    typeLabel = translations[appState.currentLang].suggested_gym;
  }

  const suggestionPinHtml = `
    <div style="
      background: rgba(10, 13, 20, 0.9);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid ${color};
      box-shadow: 0 0 8px ${color};
      cursor: pointer;
      transition: transform 0.2s;
    " class="suggestion-pin-hover" title="${name}">
      <i class="fa-solid ${iconClass}" style="color: ${color}; font-size: 0.65rem;"></i>
    </div>
  `;

  const marker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'leaflet-suggestion-marker',
      html: suggestionPinHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }).addTo(appState.pickerMap);

  // Construct popup content as a DOM element dynamically to prevent escaping bugs
  const container = document.createElement("div");
  container.style.maxWidth = "180px";
  container.style.fontSize = "0.75rem";
  container.style.color = "#fff";

  const typeSpan = document.createElement("span");
  typeSpan.style.fontWeight = "700";
  typeSpan.style.color = color;
  typeSpan.style.textTransform = "uppercase";
  typeSpan.style.fontSize = "0.6rem";
  typeSpan.style.display = "block";
  typeSpan.style.marginBottom = "0.25rem";
  typeSpan.textContent = typeLabel;
  container.appendChild(typeSpan);

  const titleEl = document.createElement("h5");
  titleEl.style.color = "white";
  titleEl.style.margin = "0 0 0.35rem 0";
  titleEl.style.fontSize = "0.8rem";
  titleEl.style.fontWeight = "600";
  titleEl.style.fontFamily = "var(--font-title)";
  titleEl.textContent = name;
  container.appendChild(titleEl);

  const selectBtn = document.createElement("button");
  selectBtn.type = "button";
  selectBtn.style.width = "100%";
  selectBtn.style.backgroundColor = color;
  selectBtn.style.color = "var(--bg-primary)";
  selectBtn.style.border = "none";
  selectBtn.style.padding = "0.35rem 0.5rem";
  selectBtn.style.borderRadius = "4px";
  selectBtn.style.fontWeight = "700";
  selectBtn.style.fontSize = "0.7rem";
  selectBtn.style.cursor = "pointer";
  selectBtn.style.transition = "transform 0.2s";
  selectBtn.textContent = appState.currentLang === 'es' ? 'Usar este lugar' : 'Use this place';

  selectBtn.addEventListener("click", () => {
    updatePickerLocation(lat, lng, name);
    marker.closePopup();
    showToast(translations[appState.currentLang].alert_suggested_selected + name, true);
  });
  
  container.appendChild(selectBtn);

  marker.bindPopup(container);
  appState.suggestionMarkers.push(marker);
}

function generateFallbackSuggestions(lat, lng) {
  const lang = appState.currentLang;
  const simulated = [
    {
      name: lang === "es" ? "Polideportivo Municipal Sugerido" : "Suggested Sports Complex",
      tags: { leisure: "sports_centre", name: lang === "es" ? "Polideportivo Sugerido" : "Suggested Sports Center" },
      latOffset: 0.004, lngOffset: 0.003
    },
    {
      name: lang === "es" ? "Parque Verde del Deporte" : "Green Sports Park",
      tags: { leisure: "park", name: lang === "es" ? "Parque Verde del Deporte" : "Green Sports Park" },
      latOffset: -0.003, lngOffset: 0.005
    },
    {
      name: lang === "es" ? "Campos de Fútbol & Básquetbol" : "Soccer & Basketball Pitches",
      tags: { leisure: "pitch", name: lang === "es" ? "Campos de Fútbol & Básquetbol" : "Soccer & Basketball Pitches", sport: "soccer" },
      latOffset: 0.005, lngOffset: -0.004
    },
    {
      name: lang === "es" ? "Gimnasio Fitness Center" : "Local Fitness Gym Center",
      tags: { leisure: "sports_centre", name: lang === "es" ? "Gimnasio Fitness Center" : "Local Fitness Gym Center" },
      latOffset: -0.004, lngOffset: -0.003
    },
    {
      name: lang === "es" ? "Sendero & Pista de Running" : "Hiking Trail & Running Track",
      tags: { leisure: "park", name: lang === "es" ? "Sendero & Pista de Running" : "Hiking Trail & Running Track" },
      latOffset: 0.002, lngOffset: -0.002
    }
  ];

  simulated.forEach(item => {
    createSuggestionMarker(lat + item.latOffset, lng + item.lngOffset, item.tags);
  });

  elements.mapSelectionStatus.textContent = translations[appState.currentLang].form_map_selected + ` (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
  elements.mapSelectionStatus.style.color = "var(--accent-green)";
}

// --- RENDER ACTIVITIES (FEED & MAP MARKERS) ---
function renderActivities() {
  const lang = appState.currentLang;
  
  // Clear feed container and markers
  elements.activityListContainer.innerHTML = "";
  
  appState.mapMarkers.forEach(marker => appState.mainMap.removeLayer(marker));
  appState.mapMarkers = [];

  // Filter activities
  const filteredActivities = appState.activities.filter(act => {
    // Sport match
    const sportMatch = (appState.activeFilterSport === "all" || act.sport === appState.activeFilterSport);
    
    // Text search match
    let searchMatch = true;
    if (appState.activeSearchQuery) {
      const q = appState.activeSearchQuery.toLowerCase();
      const titleMatch = act.title.toLowerCase().includes(q);
      const descMatch = act.description.toLowerCase().includes(q);
      const locMatch = act.locationName.toLowerCase().includes(q);
      const customSportMatch = act.customSport && act.customSport.toLowerCase().includes(q);
      searchMatch = titleMatch || descMatch || locMatch || customSportMatch;
    }

    return sportMatch && searchMatch;
  });

  // Update Count
  elements.resultsCount.textContent = `${filteredActivities.length} ${translations[lang].spots_open_feed}`;

  if (filteredActivities.length === 0) {
    elements.activityListContainer.innerHTML = `
      <div class="no-activities">
        <i class="fa-solid fa-face-frown"></i>
        <p>${lang === "es" ? "No se encontraron actividades. ¡Sé el primero en publicar una!" : "No activities found. Be the first to post one!"}</p>
      </div>
    `;
    return;
  }

  // Create document fragment for optimization
  const fragment = document.createDocumentFragment();

  filteredActivities.forEach(act => {
    // Spots summary
    const openSpots = act.spotsTotal - act.spotsJoined.length;
    const isFull = openSpots <= 0;
    
    let spotsText = "";
    if (isFull) {
      spotsText = `<span class="spots-status spots-full"><i class="fa-solid fa-circle-xmark"></i> ${translations[lang].spots_full}</span>`;
    } else {
      spotsText = `<span class="spots-status spots-open"><i class="fa-solid fa-circle-check"></i> ${openSpots} ${translations[lang].spots_remaining_suffix}</span>`;
    }

    // Sport Name & Badge styling
    let sportLabel = translations[lang][`sport_${act.sport}`] || act.sport;
    if (act.sport === "other" && act.customSport) {
      sportLabel = `${translations[lang].other_custom_label}${act.customSport}`;
    }

    // Format Date & Time for card display
    const dateObj = new Date(act.datetime);
    const dateFormatted = dateObj.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Check if host is the current user
    const isHost = act.hostEmail === appState.profile.email;
    const userJoined = act.spotsJoined.some(p => p.email === appState.profile.email);
    
    let joinButtonHtml = "";
    if (isHost) {
      joinButtonHtml = `
        <span style="font-size:0.75rem; font-weight:700; color:var(--accent-orange); margin-right:0.25rem; display:inline-flex; align-items:center; gap:0.25rem;">
          <i class="fa-solid fa-circle-user"></i>
          <span>${translations[lang].host_badge}</span>
        </span>
      `;
    } else if (userJoined) {
      joinButtonHtml = `
        <button class="btn btn-outline-cyan btn-join-card" style="padding: 0.4rem 0.8rem; font-size:0.75rem; border-color: var(--accent-green); color: var(--accent-green); background: rgba(57, 255, 20, 0.05);" data-id="${act.id}">
          <i class="fa-solid fa-user-check"></i>
          <span>${lang === 'es' ? 'Inscrito' : 'Joined'}</span>
        </button>
      `;
    } else if (openSpots <= 0) {
      joinButtonHtml = `
        <button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size:0.75rem; opacity: 0.6;" disabled>
          <i class="fa-solid fa-circle-xmark"></i>
          <span>${lang === 'es' ? 'Lleno' : 'Full'}</span>
        </button>
      `;
    } else {
      joinButtonHtml = `
        <button class="btn btn-primary btn-join-card" style="padding: 0.4rem 0.8rem; font-size:0.75rem;" data-id="${act.id}">
          <i class="fa-solid fa-user-plus"></i>
          <span>${lang === 'es' ? 'Unirse' : 'Join'}</span>
        </button>
      `;
    }

    // Create Feed Card Element
    const card = document.createElement("article");
    card.className = "activity-card";
    card.setAttribute("data-sport", act.sport);
    card.setAttribute("data-id", act.id);
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="card-header">
        <span class="sport-badge sport-${act.sport}">${sportLabel}</span>
        ${spotsText}
      </div>
      <h4 class="card-title">${act.title}</h4>
      <div class="card-details">
        <div class="detail-item">
          <i class="fa-solid fa-calendar-days"></i>
          <span>${dateFormatted}</span>
        </div>
        <div class="detail-item">
          <i class="fa-solid fa-location-dot"></i>
          <span>${act.locationName}</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="host-info">
          <img src="${act.hostAvatar || AVATARS[0]}" class="host-avatar" alt="${act.hostName}">
          <span class="host-name">${act.hostName}</span>
        </div>
        <div class="card-actions" style="display:flex; gap:0.5rem; align-items:center;">
          ${joinButtonHtml}
          <button class="btn btn-secondary btn-view-detail" style="padding: 0.4rem 0.8rem; font-size:0.75rem;" data-id="${act.id}">
            <i class="fa-solid fa-circle-info"></i>
            <span>${lang === "es" ? "Detalles" : "Details"}</span>
          </button>
        </div>
      </div>
    `;

    // Add click listeners to card
    card.addEventListener("click", () => openActivityDetail(act.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openActivityDetail(act.id);
    });

    // Add click listener to card join button
    const cardJoinBtn = card.querySelector(".btn-join-card");
    if (cardJoinBtn) {
      cardJoinBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent opening detail modal!
        toggleJoinStatus(act.id);
      });
    }

    fragment.appendChild(card);

    // --- ADD MARKER TO MAIN MAP ---
    if (act.sport !== 'online') {
      let markerColor = "var(--accent-orange)";
      if (act.sport === "soccer") markerColor = "var(--accent-green)";
      if (act.sport === "gym") markerColor = "var(--accent-purple)";
      if (act.sport === "cycling") markerColor = "var(--accent-cyan)";
      if (act.sport === "hiking") markerColor = "var(--accent-green)";

      const customPinHtml = `
        <div style="
          background: ${markerColor};
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        ">
          <div style="
            transform: rotate(45deg);
            color: var(--bg-primary);
            font-size: 0.8rem;
            font-weight: 700;
          ">
            <i class="${getSportIconClass(act.sport)}"></i>
          </div>
        </div>
      `;

      const marker = L.marker([act.lat, act.lng], {
        icon: L.divIcon({
          className: 'leaflet-custom-marker',
          html: customPinHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30]
        })
      });
      
      // Setup marker popup card HTML
      const popupHtml = `
        <div class="map-popup-card">
          <span class="sport-badge sport-${act.sport}" style="font-size:0.65rem; padding:0.15rem 0.4rem; margin-bottom:0.25rem;">${sportLabel}</span>
          <h4>${act.title}</h4>
          <p><i class="fa-solid fa-location-dot"></i> ${act.locationName}</p>
          <p><i class="fa-solid fa-users"></i> ${act.spotsTotal - act.spotsJoined.length} ${translations[lang].spots_remaining_suffix}</p>
          <a href="#" class="map-popup-btn" onclick="event.preventDefault(); window.openActivityDetail('${act.id}');">${lang==='es' ? 'Ver Detalles' : 'View Details'}</a>
        </div>
      `;

      marker.bindPopup(popupHtml).addTo(appState.mainMap);
      appState.mapMarkers.push(marker);
    }
  });

  elements.activityListContainer.appendChild(fragment);
}

// Helper: Get FontAwesome Icon per category
function getSportIconClass(sport) {
  switch(sport) {
    case 'running': return 'fa-solid fa-person-running';
    case 'soccer': return 'fa-solid fa-futbol';
    case 'gym': return 'fa-solid fa-dumbbell';
    case 'cycling': return 'fa-solid fa-bicycle';
    case 'basketball': return 'fa-solid fa-basketball';
    case 'hiking': return 'fa-solid fa-mountain-sun';
    case 'tennis': return 'fa-solid fa-table-tennis-paddle-ball';
    case 'online': return 'fa-solid fa-gamepad';
    case 'movies': return 'fa-solid fa-film';
    case 'shopping': return 'fa-solid fa-cart-shopping';
    case 'beach': return 'fa-solid fa-umbrella-beach';
    case 'coffee': return 'fa-solid fa-mug-hot';
    default: return 'fa-solid fa-circle-question';
  }
}

// --- EVENT LISTENERS SETUP ---
function setupEventListeners() {
  // Language selectors
  elements.langEsBtn.addEventListener("click", () => {
    appState.currentLang = "es";
    localStorage.setItem("sportsquad_lang", "es");
    applyTranslations();
    showToast("lang_active");
  });

  elements.langEnBtn.addEventListener("click", () => {
    appState.currentLang = "en";
    localStorage.setItem("sportsquad_lang", "en");
    applyTranslations();
    showToast("lang_active");
  });

  // Search input
  elements.searchInput.addEventListener("input", (e) => {
    appState.activeSearchQuery = e.target.value;
    renderActivities();
  });

  // Dropdown sport filter
  elements.sportFilter.addEventListener("change", (e) => {
    const sportVal = e.target.value;
    appState.activeFilterSport = sportVal;
    
    // sync tab buttons
    const tabs = elements.categoryTabs.querySelectorAll(".badge-tab");
    tabs.forEach(tab => {
      if (tab.getAttribute("data-category") === sportVal) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
    
    renderActivities();
  });

  // Tab category badge filters
  elements.categoryTabs.addEventListener("click", (e) => {
    const tabBtn = e.target.closest(".badge-tab");
    if (!tabBtn) return;
    
    const categoryVal = tabBtn.getAttribute("data-category");
    appState.activeFilterSport = categoryVal;
    
    // Update active visual tab
    elements.categoryTabs.querySelectorAll(".badge-tab").forEach(tab => tab.classList.remove("active"));
    tabBtn.classList.add("active");

    // Sync dropdown filter
    elements.sportFilter.value = categoryVal;

    renderActivities();
  });

  // Logo Reset Filters
  elements.logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    elements.searchInput.value = "";
    appState.activeSearchQuery = "";
    appState.activeFilterSport = "all";
    elements.sportFilter.value = "all";
    elements.categoryTabs.querySelectorAll(".badge-tab").forEach(tab => tab.classList.remove("active"));
    elements.categoryTabs.querySelector("[data-category='all']").classList.add("active");
    renderActivities();
    
    // Reset map view
    appState.mainMap.setView([40.418, -3.703], 13);
  });

  // Create Modal Show / Hide
  elements.openCreateModalBtn.addEventListener("click", openCreateModal);
  elements.heroCreateBtn.addEventListener("click", openCreateModal);
  elements.closeCreateModal.addEventListener("click", () => elements.createModal.classList.remove("active"));
  elements.cancelCreateBtn.addEventListener("click", () => elements.createModal.classList.remove("active"));
  elements.createModal.addEventListener("click", (e) => {
    if (e.target === elements.createModal) elements.createModal.classList.remove("active");
  });

  // Custom Sport input show/hide and Map hide/show
  elements.formSport.addEventListener("change", (e) => {
    // Custom sport logic
    if (e.target.value === "other") {
      elements.customSportContainer.style.display = "block";
      elements.formCustomSport.required = true;
    } else {
      elements.customSportContainer.style.display = "none";
      elements.formCustomSport.required = false;
      elements.formCustomSport.value = "";
    }
    
    // Map hide/show logic for online activities
    const locationWrapper = document.getElementById("location-fields-wrapper");
    if (e.target.value === "online") {
      locationWrapper.style.display = "none";
      elements.formLat.required = false;
      elements.formLng.required = false;
      document.getElementById("form-location").required = false;
    } else {
      locationWrapper.style.display = "block";
      elements.formLat.required = true;
      elements.formLng.required = true;
      document.getElementById("form-location").required = true;
    }
  });

  // Address Geocoding Search button
  elements.createActivityForm.addEventListener("submit", handleCreateActivity);

  // Address Geocoding Search button
  elements.searchAddressBtn.addEventListener("click", handleAddressGeocode);

  // Delete Activity button
  elements.deleteActivityBtn.addEventListener("click", handleDeleteActivity);

  // Edit Activity button
  elements.editActivityBtn.addEventListener("click", handleEditActivityClick);

  // Detail Modal Hide
  elements.closeDetailModal.addEventListener("click", () => elements.detailModal.classList.remove("active"));
  elements.detailModal.addEventListener("click", (e) => {
    if (e.target === elements.detailModal) elements.detailModal.classList.remove("active");
  });

  // Join/Leave Activity Click
  elements.joinActivityBtn.addEventListener("click", handleJoinToggle);

  // Comment Submit Form
  elements.commentSubmitForm.addEventListener("submit", handleCommentSubmit);

  // Profile Modal Show / Hide
  elements.navProfileBtn.addEventListener("click", openProfileModal);
  elements.closeProfileModal.addEventListener("click", () => elements.profileModal.classList.remove("active"));
  elements.cancelProfileBtn.addEventListener("click", () => elements.profileModal.classList.remove("active"));
  elements.profileModal.addEventListener("click", (e) => {
    if (e.target === elements.profileModal) elements.profileModal.classList.remove("active");
  });

  // Profile Form Submit
  elements.profileEditForm.addEventListener("submit", handleProfileSave);

  // Mobile view toggle button
  elements.mobileToggleBtn.addEventListener("click", handleMobileToggle);

  // Window resize handler for responsiveness
  window.addEventListener("resize", handleWindowResize);

  // Theme switcher
  elements.themeToggleBtn.addEventListener("click", handleThemeToggle);
}

// --- MOBILE VIEW HANDLING ---
function handleMobileViewInit() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    if (appState.mobileView === "feed") {
      elements.feedPanelView.classList.remove("mobile-hidden");
      elements.mapPanelView.classList.add("mobile-hidden");
    } else {
      elements.feedPanelView.classList.add("mobile-hidden");
      elements.mapPanelView.classList.remove("mobile-hidden");
    }
    updateMobileToggleButton();
  } else {
    elements.feedPanelView.classList.remove("mobile-hidden");
    elements.mapPanelView.classList.remove("mobile-hidden");
  }
}

function handleMobileToggle() {
  appState.mobileView = appState.mobileView === "feed" ? "map" : "feed";
  
  if (appState.mobileView === "feed") {
    elements.feedPanelView.classList.remove("mobile-hidden");
    elements.mapPanelView.classList.add("mobile-hidden");
  } else {
    elements.feedPanelView.classList.add("mobile-hidden");
    elements.mapPanelView.classList.remove("mobile-hidden");
    
    // Invalidate map size to render Leaflet tiles correctly when shown
    if (appState.mainMap) {
      setTimeout(() => {
        appState.mainMap.invalidateSize();
      }, 100);
    }
  }
  
  updateMobileToggleButton();
}

function updateMobileToggleButton() {
  // Ensure elements exist before updating (handles timing during initial render)
  if (!elements.mobileToggleIcon || !elements.mobileToggleText) return;
  
  const lang = appState.currentLang;
  const isFeed = appState.mobileView === "feed";
  
  if (isFeed) {
    elements.mobileToggleIcon.className = "fa-solid fa-map";
    elements.mobileToggleText.textContent = translations[lang].mobile_show_map || (lang === 'es' ? 'Ver Mapa' : 'Show Map');
  } else {
    elements.mobileToggleIcon.className = "fa-solid fa-list";
    elements.mobileToggleText.textContent = translations[lang].mobile_show_list || (lang === 'es' ? 'Ver Lista' : 'Show List');
  }
}

function handleWindowResize() {
  handleMobileViewInit();
  // Invalidate sizes on resize to ensure maps render correctly
  if (appState.mainMap) {
    appState.mainMap.invalidateSize();
  }
  if (appState.pickerMap) {
    appState.pickerMap.invalidateSize();
  }
}

// --- THEME HANDLING ---
function applyTheme() {
  const theme = appState.theme;
  document.documentElement.setAttribute("data-theme", theme);
  
  if (elements.themeToggleIcon) {
    if (theme === "light") {
      elements.themeToggleIcon.className = "fa-solid fa-moon";
    } else {
      elements.themeToggleIcon.className = "fa-solid fa-sun";
    }
  }

  updateMapTilesTheme();
}

function handleThemeToggle() {
  appState.theme = appState.theme === "dark" ? "light" : "dark";
  localStorage.setItem("sportsquad_theme", appState.theme);
  applyTheme();
}

function updateMapTilesTheme() {
  const theme = appState.theme;
  const tileUrl = theme === "light"
    ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    
  if (appState.mainTileLayer) {
    appState.mainTileLayer.setUrl(tileUrl);
  }
  if (appState.pickerTileLayer) {
    appState.pickerTileLayer.setUrl(tileUrl);
  }
}

// --- CREATION ACTIVITY FORM ---
function openCreateModal() {
  // Reset form
  elements.createActivityForm.reset();
  elements.customSportContainer.style.display = "none";
  elements.formCustomSport.required = false;
  
  // Reset title and button text (in case we were editing previously)
  const lang = appState.currentLang;
  document.getElementById("create-modal-title").textContent = translations[lang].create_modal_title;
  elements.createActivityForm.querySelector("button[type='submit']").textContent = translations[lang].publish;
  appState.isEditing = false;
  appState.editingActivityId = null;

  // Set default datetime to tomorrow same hour
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMinutes(0);
  // Format to local ISO (YYYY-MM-DDThh:mm)
  const tzOffset = tomorrow.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(tomorrow - tzOffset)).toISOString().slice(0, 16);
  document.getElementById("form-datetime").value = localISOTime;

  // Reset coordinates and map picker helpers
  elements.formLat.value = "";
  elements.formLng.value = "";
  elements.mapSelectionStatus.textContent = translations[lang].form_map_helper;
  elements.mapSelectionStatus.style.color = "var(--accent-cyan)";
  if (appState.pickerMarker) {
    appState.pickerMap.removeLayer(appState.pickerMarker);
    appState.pickerMarker = null;
  }

  // Open modal container
  elements.createModal.classList.add("active");

  // Load Map Picker
  initPickerMap();
}

async function handleAddressGeocode() {
  const address = document.getElementById("form-location").value.trim();
  if (!address) return;

  const btn = elements.searchAddressBtn;
  const originalHtml = btn.innerHTML;
  
  // Show searching status
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${translations[appState.currentLang].searching_address}</span>`;
  
  elements.mapSelectionStatus.textContent = translations[appState.currentLang].searching_address;
  elements.mapSelectionStatus.style.color = "var(--accent-cyan)";

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': appState.currentLang === 'es' ? 'es' : 'en'
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      elements.formLat.value = lat;
      elements.formLng.value = lng;

      // Update picker map & marker
      appState.pickerMap.setView([lat, lng], 15);
      
      const latlng = L.latLng(lat, lng);
      if (appState.pickerMarker) {
        appState.pickerMarker.setLatLng(latlng);
      } else {
        appState.pickerMarker = L.marker(latlng, {
          icon: L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="background:var(--accent-orange); width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 10px rgba(0,0,0,0.5)"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          })
        }).addTo(appState.pickerMap);
      }

      elements.mapSelectionStatus.textContent = translations[appState.currentLang].form_map_selected + ` (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
      elements.mapSelectionStatus.style.color = "var(--accent-green)";

      // Fetch suggestion venues (parks, pitches, gyms) around this geocoded address!
      fetchNearbySuggestions(lat, lng);
    } else {
      alert(translations[appState.currentLang].alert_address_not_found);
      elements.mapSelectionStatus.textContent = translations[appState.currentLang].form_map_helper;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    alert(translations[appState.currentLang].alert_address_not_found);
    elements.mapSelectionStatus.textContent = translations[appState.currentLang].form_map_helper;
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

async function handleCreateActivity(e) {
  e.preventDefault();
  
  const sportSelected = elements.formSport.value;
  let lat = parseFloat(elements.formLat.value);
  let lng = parseFloat(elements.formLng.value);

  // For online activities, map coordinates are not required
  if (sportSelected === 'online') {
    lat = 0;
    lng = 0;
  } else {
    // Verify coordinates are selected on the map
    if (isNaN(lat) || isNaN(lng)) {
      alert(translations[appState.currentLang].alert_map_required);
      return;
    }
  }

  const hostProfile = appState.profile;

  // We disable the submit button temporarily while saving to cloud
  const submitBtn = elements.createActivityForm.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Guardando...";

  if (appState.isEditing) {
    const actIndex = appState.activities.findIndex(a => a.id === appState.editingActivityId);
    if (actIndex !== -1) {
      const act = appState.activities[actIndex];
      const newSpotsTotal = parseInt(document.getElementById("form-spots").value);
      
      let updatedSpotsJoined = act.spotsJoined;
      // Adjust spotsJoined if spotsTotal decreased
      if (updatedSpotsJoined.length > newSpotsTotal) {
        updatedSpotsJoined = updatedSpotsJoined.slice(0, newSpotsTotal);
      }
      
      // Send Update to Supabase
      const { error } = await supabaseClient.from('activities').update({
        title: document.getElementById("form-title").value,
        sport: elements.formSport.value,
        custom_sport: elements.formCustomSport.value,
        datetime: document.getElementById("form-datetime").value,
        spots_total: newSpotsTotal,
        location_name: elements.formLocation.value,
        lat: lat,
        lng: lng,
        description: document.getElementById("form-description").value,
        spots_joined: updatedSpotsJoined
      }).eq('id', appState.editingActivityId);

      if (error) {
        console.error("Error updating activity:", error);
        alert("Error al actualizar. Inténtalo de nuevo.");
      } else {
        elements.createModal.classList.remove("active");
        appState.isEditing = false;
        appState.editingActivityId = null;
        showToast("alert_edited");
        appState.mainMap.setView([lat, lng], 14);
        
        // Let Realtime trigger the update, or we manually trigger it
        await fetchActivities();
        renderActivities();
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      return;
    }
  }

  // Build new activity object for Supabase
  const newActivityInsert = {
    host_name: hostProfile.name,
    host_email: hostProfile.email,
    host_phone: hostProfile.phone || "",
    host_avatar: hostProfile.avatar,
    sport: elements.formSport.value,
    custom_sport: elements.formCustomSport.value,
    title: document.getElementById("form-title").value,
    datetime: document.getElementById("form-datetime").value,
    spots_total: parseInt(document.getElementById("form-spots").value),
    spots_joined: [
      { name: hostProfile.name, email: hostProfile.email, avatar: hostProfile.avatar }
    ],
    location_name: elements.formLocation.value,
    lat: lat,
    lng: lng,
    description: document.getElementById("form-description").value,
    comments: []
  };

  // Insert to Supabase
  const { data, error } = await supabaseClient.from('activities').insert(newActivityInsert).select();

  if (error) {
    console.error("Error creating activity:", error);
    alert("Hubo un error al publicar la actividad.");
  } else {
    // Close Modal
    elements.createModal.classList.remove("active");
    showToast("alert_created");
    // Center main map on new activity
    appState.mainMap.setView([lat, lng], 14);
    
    await fetchActivities();
    renderActivities();
  }
  
  submitBtn.disabled = false;
  submitBtn.textContent = originalBtnText;
}

// --- ACTIVITY DETAIL VIEW & SIGN UPS ---
function openActivityDetail(id) {
  const activity = appState.activities.find(a => a.id === id);
  if (!activity) return;

  appState.selectedActivityId = id;
  const lang = appState.currentLang;

  // Title & Sport Category
  elements.detailModalTitle.textContent = activity.title;
  
  let sportLabel = translations[lang][`sport_${activity.sport}`] || activity.sport;
  if (activity.sport === "other" && activity.customSport) {
    sportLabel = `${translations[lang].other_custom_label}${activity.customSport}`;
  }
  elements.detailSportBadge.textContent = sportLabel;
  
  // Set badge color class
  elements.detailSportBadge.className = `sport-badge sport-${activity.sport}`;

  // Description
  elements.detailDescription.textContent = activity.description;

  // Host info
  elements.detailHostName.textContent = activity.hostName;

  // Location text
  elements.detailLocationName.textContent = activity.locationName;

  // Format Date-Time
  const dateObj = new Date(activity.datetime);
  const dateFormatted = dateObj.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  elements.detailDatetime.textContent = dateFormatted;

  // Render Joined Participants
  renderParticipantsList(activity);

  // Render Comments List
  renderCommentsList(activity);

  // Update Join / Leave Button state
  updateJoinButtonState(activity);

  // Show Host Control Panel (Edit/Delete Activity) if current user is the owner
  const isMyActivity = (activity.hostEmail === appState.profile.email);
  if (isMyActivity) {
    elements.hostControlsContainer.style.display = "flex";
  } else {
    elements.hostControlsContainer.style.display = "none";
  }

  // Show Modal
  elements.detailModal.classList.add("active");
  
  // Center main map on it for visual feedback
  appState.mainMap.setView([activity.lat, activity.lng], 14);
}

// Expose globally for clickable popup map buttons
window.openActivityDetail = openActivityDetail;

function updateJoinButtonState(activity) {
  const userJoined = activity.spotsJoined.some(p => p.email === appState.profile.email);
  const openSpots = activity.spotsTotal - activity.spotsJoined.length;
  
  if (userJoined) {
    // Let user leave the activity
    elements.joinActivityBtn.className = "btn btn-secondary";
    elements.joinActivityBtn.style.width = "100%";
    elements.joinActivityBtn.style.justifyContent = "center";
    elements.joinActivityBtn.innerHTML = `
      <i class="fa-solid fa-user-minus"></i>
      <span>${translations[appState.currentLang].leave_activity}</span>
    `;
  } else if (openSpots <= 0) {
    // Session is full
    elements.joinActivityBtn.className = "btn btn-secondary";
    elements.joinActivityBtn.disabled = true;
    elements.joinActivityBtn.style.width = "100%";
    elements.joinActivityBtn.style.justifyContent = "center";
    elements.joinActivityBtn.innerHTML = `
      <i class="fa-solid fa-circle-xmark"></i>
      <span>${translations[appState.currentLang].spots_full}</span>
    `;
  } else {
    // User can join
    elements.joinActivityBtn.className = "btn btn-primary";
    elements.joinActivityBtn.disabled = false;
    elements.joinActivityBtn.style.width = "100%";
    elements.joinActivityBtn.style.justifyContent = "center";
    elements.joinActivityBtn.innerHTML = `
      <i class="fa-solid fa-user-plus"></i>
      <span>${translations[appState.currentLang].join_activity}</span>
    `;
  }
}

function renderParticipantsList(activity) {
  elements.detailParticipantsList.innerHTML = "";
  
  // Spots Count Metadata header
  const openSpots = activity.spotsTotal - activity.spotsJoined.length;
  elements.detailSpotsCount.textContent = `${openSpots} / ${activity.spotsTotal} ${translations[appState.currentLang].spots_remaining_suffix}`;
  
  elements.detailSpotsText.textContent = `${activity.spotsJoined.length} / ${activity.spotsTotal}`;

  activity.spotsJoined.forEach(p => {
    const chip = document.createElement("div");
    chip.className = "participant-chip";
    
    // Check if participant is the organizer (first person who signed up)
    const isOrganizer = (p.email === activity.hostEmail);
    const organizerTag = isOrganizer ? ` <span style="font-size:0.65rem; padding: 0.1rem 0.3rem; border-radius:10px; background:var(--accent-orange-glow); color:var(--accent-orange); font-weight:700;">${translations[appState.currentLang].host_badge}</span>` : "";

    chip.innerHTML = `
      <img src="${p.avatar || AVATARS[0]}" alt="${p.name}">
      <span>${p.name}${organizerTag}</span>
    `;
    elements.detailParticipantsList.appendChild(chip);
  });
}

function handleJoinToggle() {
  toggleJoinStatus(appState.selectedActivityId);
}

async function toggleJoinStatus(id) {
  const activity = appState.activities.find(a => a.id === id);
  if (!activity) return;

  const myProfile = appState.profile;
  const index = activity.spotsJoined.findIndex(p => p.email === myProfile.email);
  
  let newSpotsJoined = [...activity.spotsJoined];

  if (index !== -1) {
    // If you are the creator, you cannot leave your own event!
    if (activity.hostEmail === myProfile.email) {
      const warningText = appState.currentLang === "es" 
        ? "Como organizador, no puedes darte de baja. Si lo deseas, puedes editar o eliminar la actividad."
        : "As the host, you cannot leave the activity. You can edit or delete the event instead.";
      alert(warningText);
      return;
    }

    // Leave
    newSpotsJoined.splice(index, 1);
  } else {
    // Join
    const openSpots = activity.spotsTotal - activity.spotsJoined.length;
    if (openSpots <= 0) return;

    newSpotsJoined.push({
      name: myProfile.name,
      email: myProfile.email,
      avatar: myProfile.avatar
    });
  }

  // Disable button while processing
  elements.joinActivityBtn.disabled = true;

  // Send to Supabase
  const { error } = await supabaseClient.from('activities').update({ spots_joined: newSpotsJoined }).eq('id', id);

  if (error) {
    console.error("Error joining/leaving activity:", error);
    alert("Error de conexión. Inténtalo de nuevo.");
    elements.joinActivityBtn.disabled = false;
  } else {
    if (index !== -1) {
      showToast("alert_left");
    } else {
      showToast("alert_joined");
    }
    
    // Refresh live
    await fetchActivities();
    renderActivities();
    
    if (elements.detailModal.classList.contains("active") && appState.selectedActivityId === id) {
      const updatedActivity = appState.activities.find(a => a.id === id);
      renderParticipantsList(updatedActivity);
      updateJoinButtonState(updatedActivity);
    }
  }
}

// --- COMMENTS FEED ---
function renderCommentsList(activity) {
  elements.detailCommentsContainer.innerHTML = "";
  
  if (!activity.comments || activity.comments.length === 0) {
    elements.detailCommentsContainer.innerHTML = `
      <p style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:1rem 0;" data-translate="no_comments">
        ${appState.currentLang === 'es' ? 'No hay preguntas aún. ¡Haz una pregunta al organizador!' : 'No comments yet. Ask the host a question!'}
      </p>
    `;
    return;
  }

  activity.comments.forEach(c => {
    // Format timestamp
    const timeObj = new Date(c.timestamp);
    const timeStr = timeObj.toLocaleTimeString(appState.currentLang === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' - ' + timeObj.toLocaleDateString(appState.currentLang === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });

    const commentEl = document.createElement("div");
    commentEl.className = "comment-item";
    commentEl.innerHTML = `
      <img src="${c.avatar || AVATARS[0]}" class="comment-avatar" alt="${c.user}">
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-user">${c.user}</span>
          <span class="comment-time">${timeStr}</span>
        </div>
        <p class="comment-text">${c.text}</p>
      </div>
    `;
    elements.detailCommentsContainer.appendChild(commentEl);
  });

  // Scroll to bottom of comments list
  elements.detailCommentsContainer.scrollTop = elements.detailCommentsContainer.scrollHeight;
}

async function handleCommentSubmit(e) {
  e.preventDefault();
  
  const text = elements.commentInputField.value.trim();
  if (!text) return;

  const activity = appState.activities.find(a => a.id === appState.selectedActivityId);
  if (!activity) return;

  const myProfile = appState.profile;

  const newComment = {
    user: myProfile.name,
    avatar: myProfile.avatar,
    text: text,
    timestamp: new Date().toISOString()
  };

  const currentComments = activity.comments ? [...activity.comments] : [];
  currentComments.push(newComment);

  // Disable input while sending
  elements.commentInputField.disabled = true;

  // Send to Supabase
  const { error } = await supabaseClient.from('activities').update({ comments: currentComments }).eq('id', activity.id);

  if (error) {
    console.error("Error submitting comment:", error);
    alert("No se pudo enviar el comentario. Inténtalo de nuevo.");
  } else {
    elements.commentInputField.value = "";
    showToast("alert_comment_added");
    
    // Refresh live
    await fetchActivities();
    const updatedActivity = appState.activities.find(a => a.id === appState.selectedActivityId);
    renderCommentsList(updatedActivity);
  }
  
  elements.commentInputField.disabled = false;
}

// --- PROFILE SECTION ---
function openProfileModal() {
  elements.profileNameInput.value = appState.profile.name;
  elements.profileEmailInput.value = appState.profile.email;
  elements.profilePhoneInput.value = appState.profile.phone || "";
  
  elements.profileCurrentAvatarImg.src = appState.profile.avatar;

  // Render Avatar choices
  elements.avatarOptionsList.innerHTML = "";
  AVATARS.forEach((avUrl, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `avatar-option-btn ${appState.profile.avatar === avUrl ? 'selected' : ''}`;
    btn.innerHTML = `<img src="${avUrl}" alt="Avatar Option ${idx+1}">`;
    
    btn.addEventListener("click", () => {
      // Set chosen avatar visually
      elements.avatarOptionsList.querySelectorAll(".avatar-option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      elements.profileCurrentAvatarImg.src = avUrl;
    });

    elements.avatarOptionsList.appendChild(btn);
  });

  elements.profileModal.classList.add("active");
}

function handleProfileSave(e) {
  e.preventDefault();

  const selectedAvatarBtn = elements.avatarOptionsList.querySelector(".avatar-option-btn.selected");
  const selectedAvatarSrc = selectedAvatarBtn ? selectedAvatarBtn.querySelector("img").src : appState.profile.avatar;

  // Save new parameters
  appState.profile = {
    name: elements.profileNameInput.value.trim(),
    email: elements.profileEmailInput.value.trim(),
    phone: elements.profilePhoneInput.value.trim(),
    avatar: selectedAvatarSrc
  };

  saveProfileToStorage();
  elements.profileModal.classList.remove("active");
  showToast("alert_profile_saved");
}

async function handleDeleteActivity() {
  const confirmMsg = appState.currentLang === 'es'
    ? "¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer."
    : "Are you sure you want to delete this activity? This action cannot be undone.";
  
  if (confirm(confirmMsg)) {
    const id = appState.selectedActivityId;
    
    // Send Delete to Supabase
    const { error } = await supabaseClient.from('activities').delete().eq('id', id);
    
    if (error) {
      console.error("Error deleting activity:", error);
      alert("Hubo un problema eliminando la actividad.");
    } else {
      elements.detailModal.classList.remove("active");
      showToast("alert_deleted");
      
      // Refresh live
      await fetchActivities();
      renderActivities();
    }
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': appState.currentLang === 'es' ? 'es' : 'en'
      }
    });
    const data = await response.json();
    if (data && data.display_name) {
      const addressName = formatNominatimAddress(data.address) || data.display_name;
      elements.formLocation.value = addressName;
    }
  } catch (error) {
    console.log("Failed to reverse geocode coordinate click:", error);
  }
}

function formatNominatimAddress(address) {
  if (!address) return "";
  const parts = [];
  if (address.amenity || address.leisure || address.shop || address.tourism) {
    parts.push(address.amenity || address.leisure || address.shop || address.tourism);
  }
  if (address.road) {
    parts.push(address.road + (address.house_number ? " " + address.house_number : ""));
  }
  if (address.suburb || address.neighbourhood) {
    parts.push(address.suburb || address.neighbourhood);
  }
  if (address.city || address.town || address.village) {
    parts.push(address.city || address.town || address.village);
  }
  return parts.length > 0 ? parts.join(", ") : "";
}

function handleEditActivityClick() {
  const activity = appState.activities.find(a => a.id === appState.selectedActivityId);
  if (!activity) return;

  // Close detail modal
  elements.detailModal.classList.remove("active");

  // Enable editing state
  appState.isEditing = true;
  appState.editingActivityId = activity.id;

  // Pre-fill fields
  document.getElementById("form-title").value = activity.title;
  elements.formSport.value = activity.sport;
  
  // trigger custom sport toggle
  if (activity.sport === "other") {
    elements.customSportContainer.style.display = "block";
    elements.formCustomSport.required = true;
    elements.formCustomSport.value = activity.customSport;
  } else {
    elements.customSportContainer.style.display = "none";
    elements.formCustomSport.required = false;
    elements.formCustomSport.value = "";
  }

  document.getElementById("form-datetime").value = activity.datetime;
  document.getElementById("form-spots").value = activity.spotsTotal;
  elements.formLocation.value = activity.locationName;
  elements.formLat.value = activity.lat;
  elements.formLng.value = activity.lng;
  document.getElementById("form-description").value = activity.description;

  // Change Modal title & button text
  const lang = appState.currentLang;
  document.getElementById("create-modal-title").textContent = lang === "es" ? "Editar Actividad" : "Edit Activity";
  elements.createActivityForm.querySelector("button[type='submit']").textContent = lang === "es" ? "Guardar Cambios" : "Save Changes";

  // Set picker map label and marker
  elements.mapSelectionStatus.textContent = translations[lang].form_map_selected + ` (${activity.lat.toFixed(5)}, ${activity.lng.toFixed(5)})`;
  elements.mapSelectionStatus.style.color = "var(--accent-green)";

  // Open create modal
  elements.createModal.classList.add("active");

  // Initialize map
  initPickerMap();
  
  // Position picker marker and suggestions
  setTimeout(() => {
    appState.pickerMap.setView([activity.lat, activity.lng], 15);
    const latlng = L.latLng(activity.lat, activity.lng);
    if (appState.pickerMarker) {
      appState.pickerMarker.setLatLng(latlng);
    } else {
      appState.pickerMarker = L.marker(latlng, {
        icon: L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="background:var(--accent-orange); width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 10px rgba(0,0,0,0.5)"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        })
      }).addTo(appState.pickerMap);
    }
    fetchNearbySuggestions(activity.lat, activity.lng);
  }, 250);
}

// --- RUN STARTUP ---
document.addEventListener("DOMContentLoaded", initApp);
