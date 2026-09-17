'use client';

import React from 'react';
import { Incident, SOCState } from '@/types/incident';
import { Shield, ShieldAlert, ShieldCheck, Server, Globe, Lock, Ban, Activity } from 'lucide-react';

interface TopologiaRedProps {
  incident: Incident | null;
  socState: SOCState;
  droppedPackets: number;
}

export const TopologiaRed: React.FC<TopologiaRedProps> = ({
  incident,
  socState,
  droppedPackets,
}) => {
  const isAttackActive = socState === 'INCIDENT_DETECTED' || socState === 'MITIGATING';
  const isContained = socState === 'CONTAINED';

  const attackerIp = incident?.source.ip || '0.0.0.0';
  const attackerCountry = incident?.source.country || 'Inactivo';
  const targetIp = incident?.destination.ip || '10.0.1.15';
  const targetHost = incident?.destination.hostname || 'srv-core-defense.ar';

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/80 p-4 backdrop-blur overflow-hidden relative">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Header del Diagrama */}
      <div className="relative z-10 flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200 tracking-wider">
            TOPOLOGÍA TÁCTICA Y VECTOR DE ENLACE PERIMETRAL
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            Contención de Kernel:{' '}
            <strong className={isContained ? 'text-emerald-400' : isAttackActive ? 'text-red-400' : 'text-slate-400'}>
              {isContained ? 'AISLAMIENTO ACTIVO' : isAttackActive ? 'FILTRADO COMPROMETIDO' : 'MONITOR PASIVO'}
            </strong>
          </span>
          {isContained && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
              {droppedPackets.toLocaleString()} PKTS DESCARTADOS
            </span>
          )}
        </div>
      </div>

      {/* Diagrama Visual de Nodos y Enlaces */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-7 gap-2 items-center py-2">
        {/* NODO 1: Atacante WAN */}
        <div className="md:col-span-2">
          <div
            className={`p-3 rounded-xl border transition-all duration-300 ${
              isAttackActive
                ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                : isContained
                ? 'bg-slate-950/80 border-slate-800 opacity-70'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <Globe className="h-3 w-3" /> VECTOR EXTERNO (WAN)
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] ${isAttackActive ? 'bg-red-500/20 text-red-300 font-bold animate-pulse' : 'text-slate-500'}`}>
                {isAttackActive ? 'TRANSMITIENDO' : isContained ? 'CORTADO' : 'STANDBY'}
              </span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-100 truncate">
              {attackerIp}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {attackerCountry}
            </div>
            {incident?.source.asn && (
              <div className="text-[9px] text-slate-500 font-mono mt-1">
                ASN: {incident.source.asn}
              </div>
            )}
          </div>
        </div>

        {/* ENLACE VECTORIAL (Atacante -> Firewall) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-full flex items-center justify-center relative">
            {/* Línea base */}
            <div className={`h-0.5 w-full transition-colors ${
              isContained
                ? 'bg-red-900/60'
                : isAttackActive
                ? 'bg-red-500 animate-pulse'
                : 'bg-slate-800'
            }`} />

            {/* Icono central de estado del enlace */}
            <div className="absolute z-10 flex items-center justify-center">
              {isContained ? (
                <div className="h-7 w-7 rounded-full bg-red-950 border border-red-500 flex items-center justify-center text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  <Ban className="h-4 w-4" />
                </div>
              ) : isAttackActive ? (
                <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white animate-ping">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>
              ) : (
                <div className="h-4 w-4 rounded-full bg-slate-800 border border-slate-700" />
              )}
            </div>
          </div>
          <span className="text-[9px] font-mono mt-2 text-center text-slate-400 font-bold">
            {isContained ? 'ENLACE CORTADO' : isAttackActive ? 'RÁFAGA ACTIVA' : 'SIN TRÁFICO'}
          </span>
        </div>

        {/* NODO 2: Firewall Perimetral / Kernel */}
        <div className="md:col-span-2">
          <div
            className={`p-3 rounded-xl border text-center transition-all duration-300 relative ${
              isContained
                ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                : isAttackActive
                ? 'bg-amber-950/30 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            {/* Escudo visual */}
            <div className="flex items-center justify-center mb-1.5">
              <div
                className={`p-2 rounded-full ${
                  isContained
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isAttackActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isContained ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : isAttackActive ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <Shield className="h-5 w-5" />
                )}
              </div>
            </div>

            <div className="font-mono text-xs font-bold text-slate-100">
              FIREWALL PERIMETRAL
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Kernel Netfilter / UFW
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] font-mono">
              <Lock className="h-3 w-3 text-cyan-400" />
              <span className={isContained ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {isContained ? 'REGLA INSERTADA (#1)' : isAttackActive ? 'EVALUANDO MITIGACIÓN' : 'POLÍTICA DEFAULT'}
              </span>
            </div>
          </div>
        </div>

        {/* ENLACE INTERNO (Firewall -> DMZ / Core) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-full flex items-center justify-center relative">
            <div className="h-0.5 w-full bg-cyan-500/40" />
            <div className="absolute z-10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
          <span className="text-[9px] font-mono mt-2 text-center text-cyan-400">
            LAN SEGURA
          </span>
        </div>

        {/* NODO 3: Infraestructura Estratégica (DMZ) */}
        <div className="md:col-span-1">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 text-center">
            <div className="flex items-center justify-center mb-1 text-cyan-400">
              <Server className="h-5 w-5" />
            </div>
            <div className="font-mono text-[11px] font-bold text-slate-200 truncate">
              {targetHost}
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">
              {targetIp}
            </div>
            <div className="mt-1 text-[9px] font-mono text-emerald-400 font-bold">
              {isContained ? 'PROTEGIDO' : isAttackActive ? 'COMPROMISO' : 'SEGURO'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
