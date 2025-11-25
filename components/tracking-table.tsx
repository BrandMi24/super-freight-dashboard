// components/tracking-table.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Tracking = {
  _id: string;
  vesselName?: string;
  imo?: string;
  mmsi?: string;
  type?: string;
  flag?: string;
  status?: string;
  eta?: string;
  location?: string;
  speed?: number;
  lastAIS?: string;
  lat?: number | null;
  lon?: number | null;
};

type Props = {
  items: Tracking[];
};

function statusColor(status: string | undefined) {
  const s = (status || "").toLowerCase();
  if (s.includes("under_way")) return "bg-emerald-500/15 text-emerald-300";
  if (s.includes("moored")) return "bg-sky-500/15 text-sky-300";
  if (s.includes("at_anchor")) return "bg-amber-500/15 text-amber-300";
  if (s.includes("stopped")) return "bg-red-500/15 text-red-300";
  return "bg-slate-500/15 text-slate-300";
}

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "under_way", label: "Under way" },
  { value: "moored", label: "Moored" },
  { value: "at_anchor", label: "At anchor" },
  { value: "stopped", label: "Stopped" },
  { value: "unknown", label: "Unknown" },
];

// 🔹 pequeño helper para normalizar texto (bandera / destino)
function normalizeLabel(str?: string | null) {
  if (!str) return "N/A";
  return str.replace(/_/g, " ").trim();
}

// 🔹 componente mini-“gráfica” de distribución por estado
function StatusSummary({ items }: { items: Tracking[] }) {
  const counts = useMemo(() => {
    const base = {
      under_way: 0,
      moored: 0,
      at_anchor: 0,
      stopped: 0,
      unknown: 0,
    };

    for (const it of items) {
      const s = (it.status || "unknown").toLowerCase();
      if (s.includes("under_way")) base.under_way++;
      else if (s.includes("moored")) base.moored++;
      else if (s.includes("at_anchor")) base.at_anchor++;
      else if (s.includes("stopped")) base.stopped++;
      else base.unknown++;
    }

    const total =
      base.under_way +
      base.moored +
      base.at_anchor +
      base.stopped +
      base.unknown;

    return { ...base, total };
  }, [items]);

  if (!counts.total) return null;

  const bar = (value: number) =>
    counts.total ? Math.max((value / counts.total) * 100, 5) : 0;

  return (
    <div className="flex flex-col gap-2 text-xs text-slate-300">
      <p className="text-[11px] text-slate-400">
        Resumen rápido · {counts.total} barcos
      </p>
      <div className="grid gap-2 md:grid-cols-5">
        <div>
          <p className="mb-1">Under way</p>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500/70"
              style={{ width: `${bar(counts.under_way)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {counts.under_way} barcos
          </p>
        </div>
        <div>
          <p className="mb-1">Moored</p>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-sky-500/80"
              style={{ width: `${bar(counts.moored)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {counts.moored} barcos
          </p>
        </div>
        <div>
          <p className="mb-1">At anchor</p>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400/80"
              style={{ width: `${bar(counts.at_anchor)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {counts.at_anchor} barcos
          </p>
        </div>
        <div>
          <p className="mb-1">Stopped</p>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-red-500/80"
              style={{ width: `${bar(counts.stopped)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {counts.stopped} barcos
          </p>
        </div>
        <div>
          <p className="mb-1">Unknown</p>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-slate-500/80"
              style={{ width: `${bar(counts.unknown)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {counts.unknown} barcos
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrackingTable({ items }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [flagFilter, setFlagFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const [selected, setSelected] = useState<Tracking | null>(null);

  // 👇 estados NUEVOS para historial AIS
  const [history, setHistory] = useState<Tracking[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

  // 🔹 opciones únicas de bandera y destino generadas desde los datos
  const { flagOptions, destinationOptions } = useMemo(() => {
    const flags = new Set<string>();
    const destinations = new Set<string>();

    for (const it of items) {
      if (it.flag) flags.add(normalizeLabel(it.flag));
      if (it.location) destinations.add(normalizeLabel(it.location));
    }

    return {
      flagOptions: ["Todas las banderas", ...Array.from(flags)],
      destinationOptions: ["Todos los destinos", ...Array.from(destinations)],
    };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      // estado
      if (statusFilter !== "all") {
        const s = (item.status || "").toLowerCase();
        if (!s.includes(statusFilter)) return false;
      }

      // bandera
      if (flagFilter !== "all") {
        const flagLabel = normalizeLabel(item.flag).toLowerCase();
        if (flagLabel !== flagFilter.toLowerCase()) return false;
      }

      // destino
      if (destinationFilter !== "all") {
        const destLabel = normalizeLabel(item.location).toLowerCase();
        if (destLabel !== destinationFilter.toLowerCase()) return false;
      }

      // texto
      if (search.trim()) {
        const term = search.toLowerCase();
        const hayTexto =
          item.vesselName?.toLowerCase().includes(term) ||
          item.imo?.toLowerCase().includes(term) ||
          item.flag?.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term);

        if (!hayTexto) return false;
      }

      return true;
    });
  }, [items, statusFilter, flagFilter, destinationFilter, search]);

  const rows = useMemo(
    () =>
      filtered.map((item) => ({
        ...item,
        displayEta: item.eta ? new Date(item.eta).toLocaleString() : "N/A",
        displayLastAIS: item.lastAIS
          ? new Date(item.lastAIS).toLocaleString()
          : "N/A",
        displayFlag: normalizeLabel(item.flag).toUpperCase(),
        displayType: normalizeLabel(item.type),
        displayDestination: normalizeLabel(item.location),
      })),
    [filtered]
  );

  return (
    <>
      <Card className="border-slate-800 bg-card/90 backdrop-blur">
        {/* Header + filtros */}
        <div className="px-4 py-3 border-b border-slate-800 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Barcos monitoreados</h2>
              <p className="text-xs text-slate-400">
                Datos extraídos desde tu scraper de VesselFinder (MongoDB).
              </p>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {/* Filtro estado */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-slate-700 bg-slate-900/70 px-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Filtro bandera */}
              <select
                value={flagFilter}
                onChange={(e) => setFlagFilter(e.target.value)}
                className="h-9 rounded-md border border-slate-700 bg-slate-900/70 px-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {flagOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt === "Todas las banderas" ? "all" : opt}
                  >
                    {opt}
                  </option>
                ))}
              </select>

              {/* Filtro destino */}
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="h-9 rounded-md border border-slate-700 bg-slate-900/70 px-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {destinationOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt === "Todos los destinos" ? "all" : opt}
                  >
                    {opt}
                  </option>
                ))}
              </select>

              {/* Buscador */}
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, IMO, bandera…"
                className="h-9 w-full md:w-64 rounded-md border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* mini dashboard arriba de la tabla */}
          <StatusSummary items={filtered} />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow className="border-slate-800 bg-slate-900/40">
                <TableHead>Vessel</TableHead>
                <TableHead>IMO / MMSI</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Bandera</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Velocidad (kn)</TableHead>
                <TableHead>Último AIS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row._id}
                  className="border-slate-800 cursor-pointer hover:bg-slate-900/40"
                  onClick={async () => {
                    // 👉 al hacer click, abrimos modal y cargamos historial
                    setSelected(row);
                    setHistory(null);

                    if (!row.imo) return;

                    try {
                      setLoadingHistory(true);
                      const res = await fetch(
                        `${API}/tracking/history/${row.imo}?limit=15`
                      );
                      const json = await res.json();
                      if (json.ok) {
                        setHistory(json.data);
                      } else {
                        setHistory([]);
                      }
                    } catch (err) {
                      console.error(err);
                      setHistory([]);
                    } finally {
                      setLoadingHistory(false);
                    }
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{row.vesselName ?? "Sin nombre"}</span>
                      <span className="text-xs text-slate-500">
                        {row.displayDestination}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="text-slate-300">
                        IMO: {row.imo ?? "N/A"}
                      </span>
                      <span className="text-slate-500">
                        MMSI: {row.mmsi ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs">{row.displayType}</TableCell>

                  <TableCell className="text-xs">{row.displayFlag}</TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-0 text-xs font-normal ${statusColor(
                        row.status
                      )}`}
                    >
                      {row.status?.replace(/_/g, " ") || "unknown"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs max-w-[180px] truncate">
                    {row.displayDestination}
                  </TableCell>

                  <TableCell className="text-xs">{row.displayEta}</TableCell>

                  <TableCell className="text-xs">
                    {row.speed != null ? row.speed.toFixed(1) : "N/A"}
                  </TableCell>

                  <TableCell className="text-xs">
                    {row.displayLastAIS}
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-10 text-slate-500"
                  >
                    No hay datos para los filtros seleccionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 🔹 Modal de detalles */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-xl bg-slate-950 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {selected.vesselName ?? "Sin nombre"}
                </h3>
                <p className="text-xs text-slate-400">
                  IMO: {selected.imo ?? "N/A"} · MMSI: {selected.mmsi ?? "N/A"}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setHistory(null);
                }}
                className="text-slate-400 hover:text-slate-100 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
              <div>
                <p className="text-slate-400 text-[11px] mb-1">Estado</p>
                <Badge
                  variant="outline"
                  className={`border-0 text-xs font-normal ${statusColor(
                    selected.status
                  )}`}
                >
                  {selected.status?.replace(/_/g, " ") || "unknown"}
                </Badge>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] mb-1">Bandera</p>
                <p>{normalizeLabel(selected.flag).toUpperCase()}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] mb-1">Destino</p>
                <p>{normalizeLabel(selected.location)}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] mb-1">ETA</p>
                <p>
                  {selected.eta
                    ? new Date(selected.eta).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] mb-1">
                  Velocidad (kn)
                </p>
                <p>
                  {selected.speed != null
                    ? selected.speed.toFixed(1)
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px] mb-1">
                  Último AIS
                </p>
                <p>
                  {selected.lastAIS
                    ? new Date(selected.lastAIS).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* 🔥 Historial AIS */}
            <div className="mt-4">
              <p className="text-[11px] text-slate-400 mb-1">
                Historial AIS reciente
              </p>

              {loadingHistory && (
                <p className="text-xs text-slate-400">
                  Cargando historial…
                </p>
              )}

              {!loadingHistory && history && history.length === 0 && (
                <p className="text-xs text-slate-500">
                  No hay historial disponible para este IMO.
                </p>
              )}

              {!loadingHistory && history && history.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-[11px]">
                    <thead className="bg-slate-900/60 text-slate-300">
                      <tr>
                        <th className="px-2 py-1 text-left font-normal">
                          Fecha
                        </th>
                        <th className="px-2 py-1 text-left font-normal">
                          Destino
                        </th>
                        <th className="px-2 py-1 text-left font-normal">
                          Vel (kn)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h) => (
                        <tr
                          key={h._id}
                          className="border-t border-slate-800"
                        >
                          <td className="px-2 py-1">
                            {h.lastAIS
                              ? new Date(h.lastAIS).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-2 py-1">
                            {h.location?.replace(/_/g, " ") ?? "N/A"}
                          </td>
                          <td className="px-2 py-1">
                            {h.speed != null ? h.speed.toFixed(1) : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelected(null);
                  setHistory(null);
                }}
                className="px-3 py-1.5 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
