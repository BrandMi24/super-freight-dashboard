// components/tracking-map.tsx
"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import type { Tracking } from "./tracking-table";

// ⚠️ Para que TypeScript no esté chillando por los props de Leaflet
const MapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false }
) as any;

const TileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false }
) as any;

const Marker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false }
) as any;

const Popup = dynamic(
  async () => (await import("react-leaflet")).Popup,
  { ssr: false }
) as any;

type Props = {
  items: Tracking[];
};

export function TrackingMap({ items }: Props) {
  const withCoords = items.filter(
    (t) => t.lat != null && t.lon != null
  );

  if (!withCoords.length) {
    return (
      <Card className="border-slate-800 bg-card/90 p-4 text-sm text-slate-400">
        No hay barcos con coordenadas para mostrar en el mapa.
      </Card>
    );
  }

  // centro aproximado: promedio de lat/lon
  const avgLat =
    withCoords.reduce((acc, v) => acc + (v.lat as number), 0) /
    withCoords.length;
  const avgLon =
    withCoords.reduce((acc, v) => acc + (v.lon as number), 0) /
    withCoords.length;

  return (
    <Card className="border-slate-800 bg-card/90 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Mapa de posiciones</h2>
          <p className="text-xs text-slate-400">
            Marcadores generados a partir de las coordenadas lat/lon del
            último tracking.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Barcos con posición: {withCoords.length}
        </p>
      </div>

      <div className="h-[380px] w-full">
        <MapContainer
          center={[avgLat, avgLon] as [number, number]}   // 👈 tuple, no number[]
          zoom={3}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {withCoords.map((t) => (
            <Marker
              key={t._id}
              position={[t.lat as number, t.lon as number] as [number, number]} // 👈 igual
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">
                    {t.vesselName ?? "Sin nombre"}
                  </p>
                  <p>IMO: {t.imo ?? "N/A"}</p>
                  <p>Estado: {t.status?.replace(/_/g, " ") ?? "N/A"}</p>
                  <p>Destino: {t.location?.replace(/_/g, " ") ?? "N/A"}</p>
                  <p>
                    Último AIS:{" "}
                    {t.lastAIS
                      ? new Date(t.lastAIS).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}
