# SportSquad 🌟
> Encuentra tu compañero o grupo de deportes ideal, al instante. (Find your perfect sports partner or group, instantly).

SportSquad es una aplicación web estilo red social diseñada para conectar a personas locales que quieren practicar deportes o actividades físicas pero no tienen con quién. Resuelve el problema de buscar partners para salir a correr, ir al gimnasio juntos (compartir pases grupales o membresías), completar un equipo de fútbol/básquetbol o hacer senderismo y ciclismo de forma segura y en grupo.

---

## ✨ Características Principales (Key Features)

1. **Selector Bilingüe (Bilingual UI ES/EN):**
   - Un botón en la cabecera permite alternar el idioma de toda la aplicación instantáneamente entre Español e Inglés.

2. **Mapa Interactivo (Leaflet.js + CartoDB Dark Matter):**
   - Un mapa de alta estética oscura muestra todas las actividades activas geolocalizadas con marcadores personalizados según la categoría deportiva.
   - Haz clic en cualquier marcador para abrir los detalles y registrarte.

3. **Publicación y Selección en Mapa (Create & Locate):**
   - Crea nuevas actividades completando datos clave (título, categoría, fecha, descripción, cupos libres).
   - Haz clic en el mapa integrado del formulario para fijar el punto exacto de encuentro.

4. **Deportes Personalizados (Custom Sports):**
   - Además de las categorías por defecto (*Running, Fútbol, Gimnasio, Ciclismo, Básquetbol, Senderismo, Tenis*), al seleccionar la opción **"Otro" / "Other"** puedes escribir cualquier deporte personalizado (ej. *CrossFit, Yoga, Pádel, Natación*), el cual se registrará y se mostrará con una etiqueta única.

5. **Inscripciones & Cupos Dinámicos (Dynamic Spots):**
   - Únete o retira tu inscripción de cualquier actividad con un clic. El número de vacantes y la lista de participantes inscritos se actualizarán automáticamente.

6. **Muro de Comentarios / Foro de Discusión (Comments Thread):**
   - Cada actividad tiene un chat o sección de preguntas para coordinar detalles prácticos (ej. *¿Hay que llevar pelota?*, *¿Dónde aparcar?*).

7. **Ajustes de Perfil (Profile settings):**
   - Configura tu nombre, correo y número de contacto, y elige tu avatar ilustrativo favorito para identificarte en la comunidad.

8. **Persistencia Local (localStorage):**
   - Todas las interacciones, las actividades creadas, comentarios e inscripciones se guardan en el almacenamiento local del navegador (`localStorage`). Al recargar la página, tus datos seguirán allí.

---

## 🛠️ Tecnologías Utilizadas (Tech Stack)

- **HTML5:** Marcado semántico estructurado con soporte de atributos de traducción dinámica.
- **Vanilla CSS3:** Sistema de diseño responsivo de primer nivel. Estilo **Glassmorphism** premium, paleta de colores oscuros con acentos neón y micro-animaciones dinámicas.
- **JavaScript (ES6+):** Gestión de estado interactivo, manipulación del DOM, persistencia de datos local y lógica bilingüe.
- **Leaflet.js (Mapas):** Biblioteca open-source para mapas interactivos geolocalizados, sin necesidad de claves de API externas.
- **FontAwesome:** Iconos vectoriales modernos de alta resolución.
- **Google Fonts (Outfit & Inter):** Tipografías modernas y estilizadas para la interfaz.

---

## 🚀 ¿Cómo Ejecutar el Proyecto? (How to Run)

Dado que es una aplicación del lado del cliente pura, puedes ejecutarla de las siguientes formas:

### Opción 1: Abrir directamente en el navegador
1. Ve al directorio del proyecto: `C:\Users\adones1\.gemini\antigravity\scratch\sportsquad/`.
2. Haz doble clic en `index.html` para abrirlo en tu navegador favorito (Chrome, Firefox, Edge, etc.).

### Opción 2: Usar un servidor web estático (Recomendado)
Para evitar problemas con políticas de CORS o cookies de sesión en el navegador, es recomendable servirlo localmente:
1. Abre tu terminal de PowerShell o CMD.
2. Navega al directorio del proyecto.
3. Ejecuta cualquiera de los siguientes comandos:
   ```bash
   # Si tienes http-server instalado globalmente
   npx http-server .
   
   # O si usas Live Server en VS Code, simplemente abre la carpeta y haz clic en "Go Live".
   ```
4. Abre la dirección `http://localhost:8080` (o el puerto indicado) en tu navegador.

---

## 🎨 Paleta de Colores & Diseño (Design System)

- **Fondo base:** Gradient oscuro (`#0a0d14` a `#121824`) que reduce la fatiga visual.
- **Tarjetas / Contenedores:** Fondo translúcido con efecto de vidrio empañado (`rgba(22, 28, 45, 0.65)`) y desenfoque de fondo (`backdrop-filter: blur(12px)`).
- **Acento Primario (Energía):** Naranja Neón (`#ff6b35`) que evoca calor, deporte y dinamismo.
- **Acento Secundario (Mapa/Tecnología):** Cian Neón (`#00f0ff`) que evoca precisión y frescura.
- **Acento de Éxito:** Verde Neón (`#39ff14`).
