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

  // 👇 ESTE COMPONENTE CORRE EN EL NAVEGADOR
  // así que apuntamos al API con localhost:3000 (el puerto publicado del host)
  const API = "https://super-freight-tracker-api.onrender.com/api";

  const runStatic = async () => {
    try {
      const res = await fetch(`${API}/scrape/demo-static`);
      const json = await res.json();
      setStaticResult(json);
    } catch (err: any) {
      setStaticResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    }
  };

  const runDynamic = async () => {
    try {
      const res = await fetch(`${API}/scrape/demo-dynamic`);
      const json = await res.json();
      setDynamicResult(json);
    } catch (err: any) {
      setDynamicResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    }
  };

  const runAuth = async () => {
    try {
      const res = await fetch(`${API}/scrape/demo-auth`);
      const json = await res.json();
      setAuthResult(json);
    } catch (err: any) {
      setAuthResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
    }
  };

  const runXml = async () => {
    try {
      const res = await fetch(`${API}/xml/demo`);
      const json = await res.json();
      setXmlResult(json);
    } catch (err: any) {
      setXmlResult({
        ok: false,
        error: err?.message || "Error desconocido",
      });
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
          <Button size="sm" onClick={runStatic}>
            Demo Cheerio (estático)
          </Button>
          <Button size="sm" variant="outline" onClick={runDynamic}>
            Demo Playwright (dinámico)
          </Button>
          <Button size="sm" variant="outline" onClick={runAuth}>
            Demo login (auth)
          </Button>
          <Button size="sm" variant="outline" onClick={runXml}>
            Demo XML
          </Button>
        </div>
      </div>

      {/* Resultados */}
      <div className="grid gap-4 md:grid-cols-2 text-xs">
        <div>
          <p className="font-medium mb-1 text-slate-300">
            Resultado demo estático (Cheerio)
          </p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 overflow-x-auto">
            {staticResult
              ? JSON.stringify(staticResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>

        <div>
          <p className="font-medium mb-1 text-slate-300">
            Resultado demo dinámico (Playwright)
          </p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 overflow-x-auto">
            {dynamicResult
              ? JSON.stringify(dynamicResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>

        <div>
          <p className="font-medium mb-1 text-slate-300">
            Resultado demo login autenticado
          </p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 overflow-x-auto">
            {authResult
              ? JSON.stringify(authResult, null, 2)
              : "Sin ejecutar"}
          </pre>
        </div>

        <div>
          <p className="font-medium mb-1 text-slate-300">
            Resultado demo XML
          </p>
          <pre className="bg-slate-950/80 border border-slate-800 rounded-md p-2 overflow-x-auto">
            {xmlResult ? JSON.stringify(xmlResult, null, 2) : "Sin ejecutar"}
          </pre>
        </div>
      </div>
    </Card>
  );
}
