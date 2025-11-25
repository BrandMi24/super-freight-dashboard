# Super Freight Tracker · Dashboard (Next.js)

Frontend de **Super Freight Tracker** construido con **Next.js + Tailwind + shadcn/ui**, que permite:

- Visualizar trackings de barcos almacenados en MongoDB (vía API backend).
- Filtrar por estado, bandera, destino y texto.
- Ver un mini dashboard de distribución por estado.
- Abrir un modal con detalles de cada barco + historial AIS.
- Ver un mapa con los barcos (Leaflet + OpenStreetMap).
- Ejecutar demos de scraping desde la UI.
- Footer con nombre del desarrollador + LinkedIn/GitHub.

---

## 🧱 Tech stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Leaflet** + **Leaflet**
- Client components conectados al backend API

---

## ⚙️ Variables de entorno

### `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### `.env.docker`
```
NEXT_PUBLIC_API_URL=http://api:3000/api
```

---

## 🚀 Correr en local

Instalar dependencias:
```
npm install
```

Crear `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Levantar dev server:
```
npm run dev
```

Dashboard:
http://localhost:3000

---

## 🧩 Componentes principales

### app/page.tsx
Server fetch a:
```
GET /tracking
```

Renderiza header, ScraperDemos, TrackingMap, TrackingTable y footer.

### components/tracking-table.tsx
Tabla con filtros:
- Estado
- Bandera
- Destino
- Buscador por texto

Incluye:
- Dashboard de estados
- Modal por barco
- Llamada a:
```
GET /tracking/history/:imo?limit=15
```

### components/tracking-map.tsx
Mapa con React Leaflet:
- Markers por barco
- Popup con info
- Cálculo de centro automático

### components/scraper-demos.tsx
Botones:
```
GET /scrape/demo-static
GET /scrape/demo-dynamic
```

Muestra JSON en `<pre>`.

### Footer
Incluye nombre del desarrollador y enlaces a LinkedIn/GitHub.

---

## 🐳 Docker

Build:
```
docker build -t freight-dashboard .
```

Run:
```
docker run --env-file .env.docker -p 3001:3000 freight-dashboard
```

Dashboard:
http://localhost:3001

---

## 🔗 Integración API

El dashboard consume:

```
GET {API}/tracking
GET {API}/tracking/history/:imo
GET {API}/scrape/demo-static
GET {API}/scrape/demo-dynamic
```
