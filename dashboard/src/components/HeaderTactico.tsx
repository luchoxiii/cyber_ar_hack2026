'use client';

import React, { useState, useEffect } from 'react';
import { SOCState } from '@/types/incident';
import { Shield, ShieldAlert, ShieldCheck, Cpu, RefreshCw, Radio, Volume2, VolumeX, Zap } from 'lucide-react';

interface HeaderTacticoProps {
  socState: SOCState;
  demoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
  onSimulateIncident: () => void;
  onStartStream: () => void;
  isStreaming: boolean;
  onReset: () => void;
  statusMessage: string;
  isMuted: boolean;
  onToggleAudio: () => void;
}

export const HeaderTactico: React.FC<HeaderTacticoProps> = ({
  socState,
  demoMode,
  onToggleDemoMode,
  selectedScenario,
  onSelectScenario,
  onSimulateIncident,
  onStartStream,
  isStreaming,
  onReset,
  statusMessage,
  isMuted,
  onToggleAudio,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDefconBadge = () => {
    switch (socState) {
      case 'STANDBY':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px] font-medium">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>DEFCON 4 // NORMAL</span>
          </div>
        );
      case 'INCIDENT_DETECTED':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-600/70 text-rose-300 font-mono text-[11px] font-bold">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>DEFCON 2 // ALERTA ROJA</span>
          </div>
        );
      case 'MITIGATING':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-600/70 text-amber-300 font-mono text-[11px] font-bold">
            <RefreshCw className="h-3.5 w-3.5 text-amber-400 animate-spin" />
            <span>DEFCON 1 // RESPUESTA ACTIVA</span>
          </div>
        );
      case 'CONTAINED':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 font-mono text-[11px] font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>DEFCON 5 // AMENAZA CONTENIDA</span>
          </div>
        );
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950 px-4 lg:px-6 py-2.5 text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Identidad Institucional & Título */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 text-rose-500">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm lg:text-base font-bold tracking-wider text-slate-100 font-mono">
                CYBER.AR <span className="text-slate-400 text-xs font-normal">// SOAR DEFENSE CONSOLE</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                NODO DEF-AR-01
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono">
                COMANDO CONJUNTO DE CIBERDEFENSA (CCCD) • FIE-UNDEF
              </span>
              <span className="text-slate-600 text-[10px]">•</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {utcTime}
              </span>
            </div>
          </div>
        </div>

        {/* DEFCON + Soberanía Air-Gapped */}
        <div className="flex items-center gap-2.5">
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-emerald-400">
            <Cpu className="h-3.5 w-3.5" />
            <span>SOBERANÍA: AIR-GAPPED / INFRAESTRUCTURA PROPIA</span>
          </div>

          {getDefconBadge()}

          {/* Toggle Audio */}
          <button
            onClick={onToggleAudio}
            title={isMuted ? 'Activar audio' : 'Silenciar audio'}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-slate-300" />}
          </button>
        </div>

        {/* Controles de Escenario y Simulación */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Selector de Escenarios */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2 py-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Escenario:</span>
            <select
              value={selectedScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value="c2_multistage" className="bg-slate-900 text-slate-100">APT C2 Exfiltración (Golden)</option>
              <option value="ssh_bruteforce" className="bg-slate-900 text-slate-100">Esc. A: SSH Brute Force (Denis)</option>
              <option value="port_scan" className="bg-slate-900 text-slate-100">Esc. B: Port Scan Recon (Denis)</option>
              <option value="web_exploit" className="bg-slate-900 text-slate-100">Esc. C: Web Exploits / LFI (Denis)</option>
            </select>
          </div>

          {/* Switch Demo Mode */}
          <label className="hidden md:flex items-center gap-2 cursor-pointer select-none bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
            <span className="text-[10px] font-mono text-slate-300">Demo Mode</span>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => onToggleDemoMode(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-7 h-3.5 flex items-center rounded-full p-0.5 duration-200 ${demoMode ? 'bg-cyan-700' : 'bg-slate-700'}`}>
              <div className={`bg-white w-2.5 h-2.5 rounded-full shadow transform duration-200 ${demoMode ? 'translate-x-3' : ''}`} />
            </div>
          </label>

          {/* Botón 1: Ingesta en Vivo con Stream */}
          <button
            onClick={onStartStream}
            disabled={isStreaming}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium tracking-wide transition-all cursor-pointer ${
              isStreaming
                ? 'bg-rose-950 border border-rose-700 text-rose-300 cursor-wait'
                : 'bg-rose-900 hover:bg-rose-800 text-white border border-rose-700/80 active:scale-95'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{isStreaming ? 'INGESTANDO...' : 'STREAM EN VIVO'}</span>
          </button>

          {/* Botón 2: Carga Rápida */}
          <button
            onClick={onSimulateIncident}
            title="Carga instantánea del incidente para pruebas rápidas"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-all cursor-pointer active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">RÁPIDO</span>
          </button>

          {/* Botón Reset Standby */}
          {socState !== 'STANDBY' && (
            <button
              onClick={onReset}
              title="Restablecer consola a estado pasivo"
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Ticker / Subbarra de Telemetría Táctica */}
      <div className="max-w-7xl mx-auto pt-1.5 mt-1 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="truncate text-slate-300 font-medium">{statusMessage}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
          <span>LATENCIA LOCAL: &lt;1ms</span>
          <span>ESTADO KERNEL: ACTIVO</span>
          <span>FILTRADO: BIDIRECCIONAL</span>
        </div>
      </div>
    </header>
  );
};
