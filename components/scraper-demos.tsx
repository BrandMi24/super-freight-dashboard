// components/scraper-demos.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DemoResult = {
  ok: boolean;
  from?: string;
  data?: any;
  error?: string;
  [key: string]: any;
};

export function ScraperDemos() {
  const [staticResult, setStaticResult] = useState<DemoResult | null>(null);
  const [dynamicResult, setDynamicResult] = useState<DemoResult | null>(null);
  const [authResult, setAuthResult] = useState<DemoResult | null>(null);
  const [xmlResult, setXmlResult] = useState<DemoResult | null>(null);

  const [loadingStatic, setLoadingStatic] = useState(false);
  const [loadingDynamic, setLoadingDynamic] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingXml, setLoadingXml] = useState(false);

  // API pública en Render
  const API = "https://super-freight-tracker-api.onrender.com/api";

  const runStatic = async () => {
    setLoadingStatic(true);
    setStaticResult(null);
    try {
      const res = await fetch(`${API}/scrape/demo-static`);
      const json = await res.json();
      setStaticResult(json);
    } catch (err: any) {
      setStaticResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    } finally {
      setLoadingStatic(false);
    }
  };

  const runDynamic = async () => {
    setLoadingDynamic(true);
    setDynamicResult(null);
    try {
      const res = await fetch(`${API}/scrape/demo-dynamic`);
      const json = await res.json();
      setDynamicResult(json);
    } catch (err: any) {
      setDynamicResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    } finally {
      setLoadingDynamic(false);
    }
  };

  const runAuth = async () => {
    setLoadingAuth(true);
    setAuthResult(null);
    try {
      const res = await fetch(`${API}/scrape/demo-auth`);
      const json = await res.json();
      setAuthResult(json);
    } catch (err: any) {
      setAuthResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    } finally {
      setLoadingAuth(false);
    }
  };

  const runXml = async () => {
    setLoadingXml(true);
    setXmlResult(null);
    try {
      const res = await fetch(`${API}/xml/demo`);
      const json = await res.json();
      setXmlResult(json);
    } catch (err: any) {
      setXmlResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    } finally {
      setLoadingXml(false);
    }
  };

  return (
    <Card className="mb-6 p-4 flex flex-col gap-4 bg-slate-950/60 border-slate-800">
      {/* Header + botones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Demos de scraping</h2>
          <p className="text-xs text-slate-400">
            Pruebas rápidas de scraping estático (Cheerio), dinámico
            (Playwright), scraping autenticado y consumo de XML.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={runStatic} disabled={loadingStatic}>
            {loadingStatic ? "Cargando..." : "Demo Cheerio (estático)"}
          </Button>

          <Button size="sm" variant="outline" onClick={runDynamic} disabled={loadingDynamic}>
            {loadingDynamic ? "Cargando..." : "Demo Playwright (dinámico)"}
          </Button>

          <Button size="sm" variant="outline" onClick={runAuth} disabled={loadingAuth}>
            {loadingAuth ? "Cargando..." : "Demo login (auth)"}
          </Button>

          <Button size="sm" variant="outline" onClick={runXml} disabled={loadingXml}>
            {loadingXml ? "Cargando..." : "Demo XML"}
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="grid gap-4 md:grid-cols-2 text-[11px] md:text-xs">

        <div>
          <p className="font-medium mb-1 text-slate-300">Resultado demo estático (Cheerio)</p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 text-[10px] md:text-xs leading-tight whitespace-pre-wrap wrap-break-word max-h-64 overflow-auto">
            {loadingStatic
              ? "Cargando datos del scraper estático..."
              : staticResult
              ? JSON.stringify(staticResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>

        <div>
          <p className="font-medium mb-1 text-slate-300">Resultado demo dinámico (Playwright)</p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 text-[10px] md:text-xs leading-tight whitespace-pre-wrap wrap-break-word max-h-64 overflow-auto">
            {loadingDynamic
              ? "Cargando datos del scraper dinámico..."
              : dynamicResult
              ? JSON.stringify(dynamicResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>

        <div>
          <p className="font-medium mb-1 text-slate-300">Resultado demo login autenticado</p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 text-[10px] md:text-xs leading-tight whitespace-pre-wrap wrap-break-word max-h-64 overflow-auto">
            {loadingAuth
              ? "Iniciando sesión y cargando zona protegida..."
              : authResult
              ? JSON.stringify(authResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>

        <div>
          <p className="font-medium mb-1 text-slate-300">Resultado demo XML</p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 text-[10px] md:text-xs leading-tight whitespace-pre-wrap wrap-break-word max-h-64 overflow-auto">
            {loadingXml
              ? "Cargando y parseando XML..."
              : xmlResult
              ? JSON.stringify(xmlResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>
      </div>
    </Card>
  );
}
