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
    <div className="border border-slate-800/80 rounded-xl bg-slate-900/50 p-4 backdrop-blur overflow-hidden relative">
      {/* Background Grid Sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415508_1px,transparent_1px),linear-gradient(to_bottom,#33415508_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Header del Diagrama */}
      <div className="relative z-10 flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-200 tracking-wider">
            TOPOLOGÍA TÁCTICA Y VECTOR DE ENLACE PERIMETRAL
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-400">
            Contención Kernel:{' '}
            <strong className={isContained ? 'text-emerald-400' : isAttackActive ? 'text-rose-400' : 'text-slate-400'}>
              {isContained ? 'AISLAMIENTO ACTIVO' : isAttackActive ? 'FILTRADO COMPROMETIDO' : 'MONITOR PASIVO'}
            </strong>
          </span>
          {isContained && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-600/40 text-[10px] font-medium">
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
                ? 'bg-rose-950/20 border-rose-600/80'
                : isContained
                ? 'bg-slate-950/80 border-slate-800 opacity-70'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" /> VECTOR EXTERNO (WAN)
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] ${isAttackActive ? 'bg-rose-500/10 text-rose-300 font-medium' : 'text-slate-500'}`}>
                {isAttackActive ? 'TRANSMITIENDO' : isContained ? 'CORTADO' : 'STANDBY'}
              </span>
            </div>
            <div className="font-mono text-sm font-semibold text-slate-100 truncate">
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
            <div className={`h-0.5 w-full transition-colors ${
              isContained
                ? 'bg-slate-800'
                : isAttackActive
                ? 'bg-rose-600'
                : 'bg-slate-800'
            }`} />

            <div className="absolute z-10 flex items-center justify-center">
              {isContained ? (
                <div className="h-6 w-6 rounded-full bg-slate-900 border border-rose-500 flex items-center justify-center text-rose-400">
                  <Ban className="h-3.5 w-3.5" />
                </div>
              ) : isAttackActive ? (
                <div className="h-5 w-5 rounded-full bg-rose-600 flex items-center justify-center text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
              ) : (
                <div className="h-3.5 w-3.5 rounded-full bg-slate-800 border border-slate-700" />
              )}
            </div>
          </div>
          <span className="text-[9px] font-mono mt-2 text-center text-slate-400 font-medium">
            {isContained ? 'ENLACE CORTADO' : isAttackActive ? 'RÁFAGA ACTIVA' : 'SIN TRÁFICO'}
          </span>
        </div>

        {/* NODO 2: Firewall Perimetral / Kernel */}
        <div className="md:col-span-2">
          <div
            className={`p-3 rounded-xl border text-center transition-all duration-300 ${
              isContained
                ? 'bg-emerald-950/20 border-emerald-600/70'
                : isAttackActive
                ? 'bg-slate-950 border-amber-500/70'
                : 'bg-slate-950/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-center mb-1.5">
              <div
                className={`p-1.5 rounded-full ${
                  isContained
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : isAttackActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isContained ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : isAttackActive ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
              </div>
            </div>

            <div className="font-mono text-xs font-semibold text-slate-100">
              FIREWALL PERIMETRAL
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Kernel Netfilter / UFW
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] font-mono">
              <Lock className="h-3 w-3 text-slate-400" />
              <span className={isContained ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                {isContained ? 'REGLA INSERTADA (#1)' : isAttackActive ? 'EVALUANDO MITIGACIÓN' : 'POLÍTICA DEFAULT'}
              </span>
            </div>
          </div>
        </div>

        {/* ENLACE INTERNO (Firewall -> DMZ / Core) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-full flex items-center justify-center relative">
            <div className="h-0.5 w-full bg-slate-700" />
            <div className="absolute z-10 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </div>
          </div>
          <span className="text-[9px] font-mono mt-2 text-center text-slate-400">
            LAN SEGURA
          </span>
        </div>

        {/* NODO 3: Infraestructura Estratégica (DMZ) */}
        <div className="md:col-span-1">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 text-center">
            <div className="flex items-center justify-center mb-1 text-slate-400">
              <Server className="h-4 w-4" />
            </div>
            <div className="font-mono text-[11px] font-semibold text-slate-200 truncate">
              {targetHost}
            </div>
            <div className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">
              {targetIp}
            </div>
            <div className="mt-1 text-[9px] font-mono text-emerald-400 font-medium">
              {isContained ? 'PROTEGIDO' : isAttackActive ? 'COMPROMISO' : 'SEGURO'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
