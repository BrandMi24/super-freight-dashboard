// app/page.tsx
import { TrackingTable, Tracking } from "@/components/tracking-table";
import { ScraperDemos } from "@/components/scraper-demos";
import { TrackingMap } from "@/components/tracking-map";
import { GithubModal } from "@/components/github-modal";

async function getTrackings(): Promise<Tracking[]> {
  // 🔹 Tomamos el valor del env y lo limpiamos (por si hay \r o espacios)
  const rawEnv = process.env.NEXT_PUBLIC_API_URL;

  const base =
    (rawEnv && rawEnv.trim().length > 0 ? rawEnv.trim() : null) ??
    "http://api:3000/api";

  const url = `${base}/tracking`;

  // 🔍 IMPRIMIR LA URL REAL QUE ESTÁ USANDO EL DASHBOARD (dentro del contenedor)
  console.log("📡 Dashboard pidiendo datos a:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(
      "❌ Error al obtener /api/tracking",
      res.status,
      "URL:",
      url
    );
    return [];
  }

  return res.json();
}

export default async function HomePage() {
  const items = await getTrackings();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Super Freight Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Dashboard de barcos scrapeados desde VesselFinder con Node.js, ETL y
            MongoDB.
          </p>
        </header>

        {/* DEMOS */}
        <ScraperDemos />

        {/* 🔹 MAPA */}
        <TrackingMap items={items} />

        {/* TABLA */}
        <TrackingTable items={items} />

        <footer className="mt-10 py-6 border-t border-slate-800 text-center text-slate-400">
          <p className="text-sm mb-3">
            Desarrollado por{" "}
            <span className="font-semibold text-slate-200">
              Brandon Miguel Hernandez Gonzalez
            </span>
          </p>

          <div className="flex items-center justify-center gap-5">
            {/* GitHub con modal */}
            <GithubModal
              appUrl="https://github.com/BrandMi24/super-freight-dashboard.git"
              apiUrl="https://github.com/BrandMi24/super-freight-tracker-api.git"
            />

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/brandon-miguel-hernandez-gonzalez-51383a374/"
              target="_blank"
              className="hover:text-white transition"
              aria-label="LinkedIn Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5C0 2.12 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8.07h3.99V23.5H.5V8.07Zm7.49 0h3.83v2.1h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14v9.23h-3.99v-8.18c0-1.95-.03-4.45-2.71-4.45-2.71 0-3.13 2.12-3.13 4.31v8.32H7.99V8.07Z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
