# Principio de las Ondas de Elliott — Lector en voz alta

Aplicación web para leer el libro *"El Principio de las Ondas de Elliott"* de A. J. Frost & R. Prechter de forma auditiva, mostrando la página escaneada original y desplazándose automáticamente a medida que se lee.

## Descripción

La app reproduce el texto de cada página con la voz del navegador (Web Speech API) mientras muestra la imagen escaneada del PDF original. Está pensada para escuchar el libro siguiendo visualmente la página, sin necesidad de leer en pantalla.

## Características

- **Lectura en voz alta** con la API nativa `speechSynthesis` del navegador (sin servicios externos).
- **Voz por defecto**: prefiere la voz de Raúl (España/México, `es-MX`), con fallback a otras voces en español.
- **Selección de voz**: desplegable con todas las voces en español disponibles en el sistema.
- **Control de volumen** (0–1).
- **Auto-avance**: al terminar una página pasa automáticamente a la siguiente.
- **Auto-scroll**: la vista se desplaza suavemente hacia abajo en proporción al progreso de la lectura, llegando al final de la página justo cuando termina de hablar.
- **Navegación manual**: botones Anterior / Siguiente.
- **Imágenes originales**: cada página se muestra como imagen escaneada (`public/pages/page-N.png`).

## Cómo funciona

- `src/app/page.tsx` contiene toda la lógica de la aplicación.
- El texto de cada página proviene de `src/pages.json` (211 páginas con `{ page, text }`).
- El texto se divide en fragmentos (`splitText`): las líneas cortas se leen enteras y las largas se parten por oraciones.
- Cada fragmento se envuelve en un `SpeechSynthesisUtterance` y se encadenan por `onend`.
- Se estima la duración de cada fragmento (`max(6000, longitud * 150) ms`) para calcular el progreso y animar el scroll proporcionalmente.
- Un contador de sesión (`sessionRef`) cancela la lectura anterior al cambiar de página o detener.

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Next.js](https://nextjs.org) 16 (App Router) | Framework |
| React 19 | UI |
| TypeScript | Tipado |
| Tailwind CSS v4 | Estilos |
| Web Speech API | Síntesis de voz en el navegador |

## Estructura del proyecto

```
elliot-wave-app/
├── public/
│   └── pages/
│       ├── page-1.png ... page-211.png   # Páginas escaneadas
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout raíz (fuentes Geist)
│   │   ├── page.tsx        # Toda la lógica de lectura y UI
│   │   └── globals.css     # Estilos globales (Tailwind + tema claro/oscuro)
│   ├── lib/
│   │   └── utils.ts        # Helper cn() (clsx + tailwind-merge)
│   └── pages.json          # Texto de las 211 páginas
├── package.json
└── README.md
```

## Requisitos

- Node.js 18.18 o superior.
- Un navegador con soporte de `speechSynthesis` (Chrome, Edge, Safari, Firefox). La calidad y disponibilidad de las voces dependen del sistema operativo.

## Ejecutar en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servir el build de producción |
| `npm run lint` | Linter (ESLint) |

## Despliegue

Al ser una app de Next.js, se puede desplegar fácilmente en [Vercel](https://vercel.com/new) o en cualquier plataforma con soporte de Node.js.

## Historial de creación

1. `7ed7e1f` — Proyecto inicial generado con `create-next-app`.
2. `5ae786a` — Primer commit con la estructura y el contenido del libro.
3. `d1c69ce` — Lectura por fragmentos, auto-avance, control de volumen y manejo de sesión.
4. `0495d64` — Auto-scroll durante la lectura y voz por defecto en español de México.

## Notas

- El contenido escaneado e imágenes pertenecen a la edición original del libro y se usan aquí únicamente con fines personales/educativos.
- La lectura en voz alta depende de las voces instaladas en el navegador/sistema; si no hay voz en español, la selección quedará vacía.
