'use client';

import React from 'react';
import { Incident } from '@/types/incident';
import { Clock, ShieldAlert, Terminal, AlertTriangle, Layers } from 'lucide-react';

interface TimelineForenseProps {
  incident: Incident | null;
}

export const TimelineForense: React.FC<TimelineForenseProps> = ({ incident }) => {
  if (!incident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-slate-800/80 rounded-xl bg-slate-900/40 backdrop-blur">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-7 w-7 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-sm font-mono font-semibold text-slate-300 tracking-wide">
          CORRELADOR DE EVENTOS EN STANDBY
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-2 font-mono">
          Esperando ráfaga de telemetría desde los sensores o la simulación. Presiona &quot;SIMULAR INCIDENTE&quot; para cargar el incidente de prueba.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="h-full flex flex-col border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden backdrop-blur">
      {/* Encabezado del Incidente */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-slate-400">{incident.id}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getSeverityBadge(incident.severity)}`}>
                SEVERIDAD {incident.severity}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                CERTEZA IA: {(incident.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-100 leading-snug">
              {incident.name}
            </h2>
          </div>
        </div>

        {/* Vector de Ataque: Origen -> Destino */}
        <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs">
          <div>
            <div className="text-[10px] text-red-400 flex items-center gap-1 font-semibold">
              <ShieldAlert className="h-3 w-3" /> HOST ATACANTE (ORIGEN)
            </div>
            <div className="text-slate-200 font-bold mt-0.5">{incident.source.ip}</div>
            <div className="text-[10px] text-slate-500 truncate">{incident.source.country || 'Desconocido'}</div>
          </div>
          <div>
            <div className="text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
              <Terminal className="h-3 w-3" /> OBJETIVO (DESTINO)
            </div>
            <div className="text-slate-200 font-bold mt-0.5">{incident.destination.ip}</div>
            <div className="text-[10px] text-slate-500 truncate">
              {incident.destination.hostname} ({incident.destination.zone})
            </div>
          </div>
        </div>

        {/* Badges MITRE ATT&CK */}
        <div className="mt-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Técnicas MITRE ATT&CK Correlacionadas:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {incident.mitre_attack.map((tech) => (
              <div
                key={tech.id}
                title={`${tech.name} - ${tech.description}`}
                className="px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <span className="text-red-400 font-bold">{tech.id}</span>
                <span className="text-slate-400 text-[10px]">|</span>
                <span className="truncate max-w-[140px]">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Línea de Tiempo Vertical Correlacionada */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Reconstrucción Cronológica del Ataque</span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> ECS v1.12
          </span>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {incident.timeline_events.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              {/* Punto del timeline */}
              <div className="absolute -left-6 top-1.5 h-4 w-4 rounded-full bg-slate-900 border-2 border-red-500 group-hover:scale-110 transition-transform flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
              </div>

              {/* Contenido del evento */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3 group-hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="text-red-400 font-bold">{evt.phase}</span>
                  <span className="text-slate-500">{evt.timestamp.slice(11, 19)} UTC</span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {evt.mitre_id}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    Puerto {evt.port} / {evt.protocol}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/50 p-2 rounded border border-slate-800/50">
                  {evt.message}
                </p>

                <div className="mt-1.5 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Tráfico: {evt.source_ip} &rarr; {evt.destination_ip}</span>
                  <span>Paso {idx + 1} de {incident.timeline_events.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
