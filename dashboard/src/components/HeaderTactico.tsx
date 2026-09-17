'use client';

import React from 'react';
import { SOCState } from '@/types/incident';
import { Shield, ShieldAlert, ShieldCheck, Cpu, RefreshCw, Play, Radio } from 'lucide-react';

interface HeaderTacticoProps {
  socState: SOCState;
  demoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
  onSimulateIncident: () => void;
  onReset: () => void;
  statusMessage: string;
}

export const HeaderTactico: React.FC<HeaderTacticoProps> = ({
  socState,
  demoMode,
  onToggleDemoMode,
  selectedScenario,
  onSelectScenario,
  onSimulateIncident,
  onReset,
  statusMessage,
}) => {
  const getStatusBadge = () => {
    switch (socState) {
      case 'STANDBY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800/80 text-cyan-400 border border-cyan-500/30">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            STANDBY / EN GUARDIA
          </span>
        );
      case 'INCIDENT_DETECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400 animate-bounce" />
            INCIDENTE CRÍTICO DETECTADO
          </span>
        );
      case 'MITIGATING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-500/50">
            <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            DESPACHANDO CONTENCIÓN...
          </span>
        );
      case 'CONTAINED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            AMENAZA NEUTRALIZADA
          </span>
        );
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur px-5 py-3 text-slate-100 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
      {/* Título & Insignia */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-wider text-slate-100 font-mono flex items-center gap-2">
              CYBER.AR <span className="text-red-500 text-xs font-normal">DEFENSE CONSOLE</span>
            </h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Task 3
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Radio className="h-3 w-3 text-emerald-400 animate-ping" />
            <span className="text-xs text-slate-400 font-mono truncate max-w-[280px]">
              {statusMessage}
            </span>
          </div>
        </div>
      </div>

      {/* Insignia Soberanía + Estado Actual */}
      <div className="flex items-center gap-3">
        {/* Soberanía Air-Gapped */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
          <Cpu className="h-3.5 w-3.5" />
          <span>SOBERANÍA: AIR-GAPPED / LOCAL-ONLY</span>
        </div>

        {/* Estado Dinámico */}
        {getStatusBadge()}
      </div>

      {/* Controles Tácticos */}
      <div className="flex items-center gap-3">
        {/* Selector de Escenarios de Prueba */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2 py-1">
          <span className="text-[10px] uppercase font-mono text-slate-400">Escenario:</span>
          <select
            value={selectedScenario}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-mono focus:outline-none cursor-pointer"
          >
            <option value="c2_multistage" className="bg-slate-900 text-slate-100">APT C2 Exfiltración (Golden)</option>
            <option value="ssh_bruteforce" className="bg-slate-900 text-slate-100">Esc. A: SSH Brute Force</option>
            <option value="port_scan" className="bg-slate-900 text-slate-100">Esc. B: Port Scan Recon</option>
            <option value="web_exploit" className="bg-slate-900 text-slate-100">Esc. C: Web Exploits / LFI</option>
          </select>
        </div>

        {/* Switch Demo Mode */}
        <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
          <span className="text-[11px] font-mono text-slate-300">Demo Mode</span>
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => onToggleDemoMode(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-8 h-4 flex items-center rounded-full p-0.5 duration-200 ${demoMode ? 'bg-cyan-600' : 'bg-slate-700'}`}>
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-200 ${demoMode ? 'translate-x-4' : ''}`} />
          </div>
        </label>

        {/* Botón Principal Disparador */}
        <button
          onClick={onSimulateIncident}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold tracking-wide shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all cursor-pointer active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>SIMULAR INCIDENTE</span>
        </button>

        {/* Botón Reset */}
        {socState !== 'STANDBY' && (
          <button
            onClick={onReset}
            title="Reiniciar consola a estado Standby"
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
};
