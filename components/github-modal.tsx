// src/components/github-modal.tsx
"use client";

import { useState } from "react";

interface GithubModalProps {
  appUrl: string;
  apiUrl: string;
}

export function GithubModal({ appUrl, apiUrl }: GithubModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón con el icono */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-white transition"
        aria-label="Ver repositorios en GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56v-1.98c-3.2.7-3.87-1.39-3.87-1.39-.53-1.35-1.3-1.71-1.3-1.71-1.07-.73.08-.72.08-.72 1.19.09 1.82 1.24 1.82 1.24 1.05 1.81 2.75 1.29 3.42.99.11-.76.41-1.29.75-1.58-2.55-.29-5.23-1.28-5.23-5.72 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.19a11.08 11.08 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.65.24 2.88.12 3.17.75.81 1.2 1.84 1.2 3.1 0 4.46-2.69 5.42-5.25 5.71.42.37.8 1.1.8 2.23v3.3c0 .32.21.69.8.57A10.98 10.98 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()} // que no se cierre al hacer click dentro
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">
                Repositorios en GitHub
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-100"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              Elige qué repo quieres abrir:
            </p>

            <div className="space-y-3">
              <a
                href={appUrl}
                target="_blank"
                className="block w-full text-center text-sm font-medium rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-800"
              >
                🖥️ Repo Frontend (APP)
              </a>

              <a
                href={apiUrl}
                target="_blank"
                className="block w-full text-center text-sm font-medium rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-800"
              >
                ⚙️ Repo Backend (API)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
