# Roomies MVP (WebApp) — 3D Touch Game for iPad

MVP de una webapp 3D donde se cargan muñecos (assets 3D) y el usuario puede moverlos con el dedo en un iPad sobre un escenario con **fondo fijo**.  
En una fase posterior, se incorporará un sistema de “muñecos físicos” vinculados a NFT para permitir que ciertos Roomies aparezcan/estén disponibles según propiedad/claim.

---

## Objetivo del MVP

- Tener una **experiencia 3D fluida en iPad y iPhone** (Safari) con:
  - Un **escenario 3D simple** (suelo/área de juego) + **fondo fijo** (imagen que se encuentra en /imagenes/background).
  - **Carga de muñecos** (imagenes/characters) desde un catálogo local.
  - **Interacción táctil**: arrastrar con el dedo para mover un muñeco por el plano.
  - Un loop de gameplay mínimo: seleccionar muñeco → colocarlo → moverlo → animación.

**No** incluye aún: multijugador, chat, mundos complejos, inventario avanzado, autenticación, blockchain/NFT en producción.

---

## Fases del proyecto

### Fase 0 — Setup y fundamentos (Semana 0)
**Entregable:** repositorio con estructura, linting, despliegue preview, y una escena 3D “hola mundo”.
- Estructura Next.js y rutas.
- Base de rendering 3D en WebGL.
- Controles táctiles básicos en iPad.
- Performance budget definido (FPS objetivo / límites de polígonos/texturas).

### Fase 1 — MVP Interacción (Core) (Semana 1–2)
**Entregable:** webapp jugable en iPad con 1–3 Roomies.
- Escena con plano de movimiento (ground) y luz.
- Fondo fijo (UI/HTML detrás del canvas o skybox estático).
- Carga de modelos `.glb/.gltf` (estándar).
- Drag & drop con dedo para mover un muñeco:
  - Raycast desde touch → intersección con el suelo → actualizar posición.
  - Opción “snap” suave / interpolación para estabilidad.
- Animación:
  - Idle loop.
  - Cambio a “walk” si el muñeco se mueve (si hay animaciones disponibles).

### Fase 2 — Catálogo y pipeline de assets (Semana 2–3)
**Entregable:** catálogo de Roomies + loader robusto.
- Catálogo en JSON (local al inicio).
- UI: seleccionar Roomie, spawn, reset.
- Fallbacks si un asset falla (modelo placeholder).
- Normas de optimización:
  - Draco / meshopt si aplica.
  - Texturas comprimidas (KTX2/Basis) cuando sea posible.

### Fase 3 — Experiencia y pulido (Semana 3–4)
**Entregable:** sensación de producto.
- Feedback táctil/visual: highlight al tocar, sombra, “poof” al spawn.
- Cámara estable con límites (sin mareo, sin necesidad de orbit).
- Modo “solo tocar”: cámara fija o muy ligera inclinación.
- Guardado local (opcional): último Roomie y posición (localStorage).

### Fase 4 (Próxima etapa) — Muñecos físicos + NFT (Diseño de arquitectura)
**Entregable:** diseño técnico + POC (no producción).
- Concepto de “claim”: el usuario demuestra propiedad (wallet / código / NFC / QR).
- Backend que resuelve “qué Roomies están disponibles” para un usuario.
- Integración NFT:
  - Definir cadena / estándar / metadata.
  - Sistema de permisos: token-gating para habilitar modelos.
- Consideraciones hospital/privacidad: sin datos sensibles, mínimo tracking.

---

## Stack propuesto

### Frontend (WebApp)
- **Next.js (React + TypeScript)**  
  - PWA friendly, routing simple, buen DX.
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
  - Scene management declarativo con React.
  - Drei para helpers (loaders, controls, environment).
- **Tailwind CSS**
  - UI minimalista, rápida de iterar.
- **State**
  - MVP: Zustand (simple y rápido).
  - Alternativa: React state + context.

### Assets 3D
- Formato: **glTF / GLB**
- Pipeline:
  - Blender → export glb
  - Optimización: **gltf-transform** / Draco / meshopt (según necesidad)
  - Texturas: KTX2/Basis (si se prioriza rendimiento)

### Backend (solo cuando haga falta)
Para el MVP se puede evitar backend.  
Para Fase NFT/claim:
- **Node.js** (API routes Next) o servicio externo (Cloudflare Workers).
- Persistencia: **PostgreSQL** (si hay cuentas) o **KV**/Firestore (si es simple).
- Auth: **NextAuth** o auth por wallet (dependiendo del enfoque).

### Hosting/Deploy
- **Vercel** (ideal con Next.js)
- Alternativa: Netlify

---

## Estilo y funcionamiento (UX / UI / Game Feel)

### Principios de experiencia
- **Cero fricción**: abrir URL → jugar.
- **Pantalla limpia**: 3D a pantalla completa, UI mínima.
- **Fondo fijo**: una ilustración/gradiente estático detrás del canvas (no se mueve con la cámara).
- **Interacción natural**:
  - Un dedo: seleccionar y arrastrar
  - Sin gestos complicados (pinch/rotate) en el MVP, salvo que se vea necesario.

### Cámara
- Cámara fija o semífija (ángulo 3/4) con:
  - Límite de área visible (playground).
  - Sin orbit control por defecto.
  - Opción futura: “modo explorar”.

### Movimiento
- Movimiento sobre plano XZ:
  - Touchstart: raycast contra el muñeco → “grab”
  - Touchmove: raycast contra el suelo → target position
  - Suavizado (lerp) para evitar saltos y jitter
- Límites del área (bounding box / collider invisible).

### Rendimiento (iPad primero)
- Objetivo: **50–60 FPS** en iPad moderno, aceptable 30+ en antiguos.
- Reglas iniciales por muñeco:
  - Polígonos: mantenerlo bajo (ej. 20k–60k max por modelo para MVP)
  - Texturas: 1K–2K max al inicio
  - Evitar postprocessing pesado

---

## Arquitectura del proyecto (propuesta)

- `app/` (Next.js App Router)
  - `page.tsx` → escena principal
- `src/scene/`
  - `Experience.tsx` → luces, cámara, suelo, lógica global
  - `Roomie.tsx` → componente del muñeco (modelo + animaciones + interacción)
- `src/store/`
  - `useRoomiesStore.ts` → estado de Roomie seleccionado, lista, posiciones
- `src/assets/roomies/`
  - `catalog.json` → listado de modelos disponibles (id, name, url, scale, etc.)

---
