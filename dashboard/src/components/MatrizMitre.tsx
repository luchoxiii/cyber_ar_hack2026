'use client';

import React from 'react';
import { MitreTechnique } from '@/types/incident';
import { Crosshair, Shield, Terminal, Radio } from 'lucide-react';

interface MatrizMitreProps {
  activeTechniques: MitreTechnique[];
}

export const MatrizMitre: React.FC<MatrizMitreProps> = ({ activeTechniques }) => {
  // Columnas tácticas estándar de la cadena de intrusión cibernética (Kill Chain)
  const tactics = [
    {
      id: 'TA0043',
      name: 'Reconnaissance',
      label: '1. Reconocimiento',
      icon: Crosshair,
    },
    {
      id: 'TA0001_TA0006',
      name: 'Initial / Credentials',
      label: '2. Intrusión & Credenciales',
      icon: Terminal,
    },
    {
      id: 'TA0011',
      name: 'Command & Control',
      label: '3. Mando y Control (C2)',
      icon: Radio,
    },
    {
      id: 'TA0040',
      name: 'Defense Containment',
      label: '4. Respuesta SOAR',
      icon: Shield,
    },
  ];

  const getTechniqueForTactic = (tacticIndex: number) => {
    if (tacticIndex === 0) {
      return activeTechniques.find((t) => t.id === 'T1046');
    }
    if (tacticIndex === 1) {
      return activeTechniques.find((t) => t.id === 'T1110.001' || t.id === 'T1190');
    }
    if (tacticIndex === 2) {
      return activeTechniques.find((t) => t.id === 'T1071.001');
    }
    return null;
  };

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/60 p-3.5 backdrop-blur">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-xs font-mono">
        <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Crosshair className="h-3.5 w-3.5 text-red-400" />
          Correlación en Matriz MITRE ATT&CK Enterprise (Kill Chain)
        </span>
        <span className="text-[10px] text-slate-500">v14.1 Enterprise Matrix</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {tactics.map((tac, idx) => {
          const tech = getTechniqueForTactic(idx);
          const Icon = tac.icon;
          const isSOAR = idx === 3;

          return (
            <div
              key={tac.id}
              className={`p-2.5 rounded-lg border transition-all ${
                isSOAR
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
                  : tech
                  ? 'bg-red-950/30 border-red-500/60 text-slate-100 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="font-bold truncate">{tac.label}</span>
                <Icon className={`h-3 w-3 shrink-0 ${tech ? 'text-red-400' : isSOAR ? 'text-cyan-400' : 'text-slate-600'}`} />
              </div>

              {isSOAR ? (
                <div className="mt-1">
                  <div className="text-[11px] font-mono font-bold text-cyan-400">
                    M1037: Filter Network Traffic
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                    Reglas dinámicas UFW / iptables aplicadas con aprobación del operador.
                  </div>
                </div>
              ) : tech ? (
                <div className="mt-1">
                  <div className="text-[11px] font-mono font-bold text-red-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                    {tech.id}
                  </div>
                  <div className="text-[10px] font-mono text-slate-200 truncate mt-0.5" title={tech.name}>
                    {tech.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5" title={tech.description}>
                    {tech.description}
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-[10px] font-mono text-slate-600">
                  Fase no detectada en ráfaga
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
