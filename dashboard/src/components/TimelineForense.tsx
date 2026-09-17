'use client';

import React from 'react';
import { Incident, TimelineEvent } from '@/types/incident';
import { Clock, ShieldAlert, Terminal, AlertTriangle, Layers, Radio } from 'lucide-react';

interface TimelineForenseProps {
  incident: Incident | null;
  displayedEvents: TimelineEvent[];
  isStreaming?: boolean;
}

export const TimelineForense: React.FC<TimelineForenseProps> = ({
  incident,
  displayedEvents,
  isStreaming = false,
}) => {
  if (!incident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-slate-800 rounded-xl bg-slate-900/60 backdrop-blur">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-7 w-7 text-cyan-400" />
          </div>
        </div>
        <h3 className="text-sm font-mono font-bold text-slate-300 tracking-wider">
          CORRELADOR DE EVENTOS EN STANDBY
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-2 font-mono">
          Esperando ráfaga de telemetría desde los sensores o la simulación de Denis. Pulsa &quot;STREAM EN VIVO&quot; o &quot;RÁPIDO&quot; en la barra superior.
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

  const eventsToShow = displayedEvents.length > 0 ? displayedEvents : incident.timeline_events;

  return (
    <div className="h-full flex flex-col border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden backdrop-blur">
      {/* Encabezado del Incidente */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-xs text-slate-400 font-bold">{incident.id}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getSeverityBadge(incident.severity)}`}>
                SEVERIDAD {incident.severity}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                CERTEZA IA: {(incident.confidence_score * 100).toFixed(0)}%
              </span>
              {isStreaming && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 flex items-center gap-1 animate-pulse">
                  <Radio className="h-3 w-3" /> STREAMING EN VIVO
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold text-slate-100 leading-snug">
              {incident.name}
            </h2>
          </div>
        </div>

        {/* Vector de Ataque: Origen -> Destino */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs">
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
        <div className="mt-2.5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Técnicas MITRE ATT&CK Correlacionadas:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {incident.mitre_attack.map((tech) => (
              <div
                key={tech.id}
                title={`${tech.name} - ${tech.description}`}
                className="px-2 py-0.5 rounded bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <span className="text-red-400 font-bold">{tech.id}</span>
                <span className="text-slate-500">|</span>
                <span className="truncate max-w-[150px]">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Línea de Tiempo Vertical */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Reconstrucción Forense de la Incursión</span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> ECS v1.12 • {eventsToShow.length} de {incident.timeline_events.length} fases
          </span>
        </div>

        <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {eventsToShow.map((evt, idx) => (
            <div key={evt.id} className="relative group animate-fadeIn">
              {/* Nodo del timeline */}
              <div className="absolute -left-5 top-1.5 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-red-500 group-hover:scale-110 transition-transform flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
              </div>

              {/* Tarjeta del evento */}
              <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-2.5 group-hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-red-400 font-bold">{evt.phase}</span>
                  <span className="text-slate-500">{evt.timestamp.slice(11, 19)} UTC</span>
                </div>

                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {evt.mitre_id}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    Puerto {evt.port} / {evt.protocol}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-mono leading-relaxed bg-slate-900/50 p-2 rounded border border-slate-800/50">
                  {evt.message}
                </p>

                <div className="mt-1.5 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Flujo: {evt.source_ip} &rarr; {evt.destination_ip}</span>
                  <span>Evento {idx + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
