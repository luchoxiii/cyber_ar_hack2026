'use client';

import React, { useState } from 'react';
import { Incident, SOCState } from '@/types/incident';
import { ShieldCheck, ShieldAlert, Terminal, CheckCircle2, Lock, Zap, RefreshCw, FileText, Activity } from 'lucide-react';

interface TarjetaContencionProps {
  incident: Incident | null;
  socState: SOCState;
  firewallType: 'ufw' | 'iptables';
  onChangeFirewallType: (type: 'ufw' | 'iptables') => void;
  isProtectedIp: boolean;
  onApproveMitigation: () => void;
  responseDurationSec: number | null;
  droppedPackets: number;
  onOpenActa: () => void;
}

export const TarjetaContencion: React.FC<TarjetaContencionProps> = ({
  incident,
  socState,
  firewallType,
  onChangeFirewallType,
  isProtectedIp,
  onApproveMitigation,
  responseDurationSec,
  droppedPackets,
  onOpenActa,
}) => {
  const [activeTab, setActiveTab] = useState<'rule' | 'kernel'>('rule');

  if (!incident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-slate-800 rounded-xl bg-slate-900/60 backdrop-blur">
        <div className="p-4 rounded-full bg-slate-800/80 text-slate-500 mb-3">
          <Lock className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-mono font-bold text-slate-300 tracking-wider">
          MÓDULO DE CONTENCIÓN SOAR EN ESPERA
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 font-mono">
          Inicia la ingesta o simula un incidente para que el motor autónomo de ciberdefensa sintetice la regla de bloqueo perimetral.
        </p>
      </div>
    );
  }

  const targetIp = incident.suggested_mitigation.target_ip;
  const activeCommand = firewallType === 'ufw'
    ? (incident.suggested_mitigation.command_ufw || `ufw insert 1 deny from ${targetIp} to any`)
    : (incident.suggested_mitigation.command_iptables || `iptables -I INPUT 1 -s ${targetIp} -j DROP`);

  const isContained = socState === 'CONTAINED';
  const isMitigating = socState === 'MITIGATING';

  return (
    <div className="h-full flex flex-col border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden backdrop-blur">
      {/* Header & Tabs */}
      <div className="p-3 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('rule')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rule'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Regla Sugerida SOAR</span>
          </button>
          <button
            onClick={() => setActiveTab('kernel')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kernel'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Inspección Kernel Netfilter</span>
          </button>
        </div>

        {/* Selector de Firewall */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => onChangeFirewallType('ufw')}
            disabled={isContained || isMitigating}
            className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
              firewallType === 'ufw'
                ? 'bg-red-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            UFW
          </button>
          <button
            onClick={() => onChangeFirewallType('iptables')}
            disabled={isContained || isMitigating}
            className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
              firewallType === 'iptables'
                ? 'bg-red-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iptables
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
        {/* Advertencia de Subred Protegida */}
        {isProtectedIp && (
          <div className="bg-red-950/90 border border-red-500 p-3 rounded-lg flex items-start gap-2.5 text-red-200 text-xs font-mono">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">INVARIANTE DE SEGURIDAD OPERATIVA:</span>
              <p className="mt-0.5 text-red-300">
                La dirección IP {targetIp} pertenece al segmento interno de comando (10.0.0.0/8). La inyección automática queda bloqueada para evitar auto-denegación de servicio a los enlaces defensivos.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Terminal con regla SOAR */}
        {activeTab === 'rule' ? (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                <span>terminal: defense-soar-engine</span>
              </div>
              <span className="text-[10px] text-cyan-400">Air-Gapped Local Shell</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <p className="text-slate-500"># 1. Regla calculada por IA para aislamiento perimetral:</p>
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-emerald-400 select-all font-mono font-semibold">
                $ {activeCommand}
              </div>

              <p className="text-slate-500 mt-2"># 2. Objetivo de contención táctica:</p>
              <p className="text-slate-300 pl-2 border-l border-slate-800 text-[11px]">
                {incident.suggested_mitigation.estimated_impact}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
                <div>Riesgo Colateral: <strong className="text-emerald-400">{incident.suggested_mitigation.risk_level}</strong></div>
                <div>Vector Host: <strong className="text-red-400">{targetIp}</strong></div>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Kernel Netfilter Live Inspector */
          <div className="bg-black border border-slate-800 rounded-lg p-3 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span># iptables -L INPUT -n -v --line-numbers</span>
              <span className="text-emerald-400 text-[10px]">KERNEL V6.8 NETFILTER</span>
            </div>
            <pre className="text-[10px] text-slate-300 overflow-x-auto leading-relaxed">
{`num   pkts  bytes target     prot opt in     out     source               destination`}
{isContained ? (
  <span className="text-emerald-400 font-bold">
{`\n1    ${droppedPackets.toString().padStart(5, ' ')}  ${(droppedPackets * 64).toString().padStart(5, ' ')} DROP       all  --  *      *       ${targetIp.padEnd(20, ' ')} 0.0.0.0/0`}
  </span>
) : (
  <span className="text-slate-500">
{`\n(Sin reglas de contención activas en la cadena INPUT)`}
  </span>
)}
{`
2    4180   312K ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0
3    9821  1.4M ACCEPT     all  --  *      *       10.0.0.0/8           0.0.0.0/0`}
            </pre>
            {isContained && (
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-emerald-400">
                <span>RÁFAGA BLOQUEADA EN KERNEL</span>
                <span>DESCARTE DE SOCKETS: INMEDIATO</span>
              </div>
            )}
          </div>
        )}

        {/* Estado Post-Contención o Botón de Aprobación */}
        {isContained ? (
          <div className="space-y-3">
            <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="inline-flex p-2 rounded-full bg-emerald-500/20 text-emerald-400 mb-1.5">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold font-mono text-emerald-400 tracking-wider">
                AMENAZA NEUTRALIZADA • AISLAMIENTO ACTIVO
              </h3>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                Regla inyectada en posición #1 del firewall con persistencia de estado.
              </p>

              {/* Comparativa MTTR (Golden Target) */}
              <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-emerald-500/30 text-left font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 text-[10px] block">MTTR MANUAL SOC:</span>
                  <span className="text-red-400 font-bold line-through">~45 minutos</span>
                </div>
                <div>
                  <span className="text-emerald-400 text-[10px] block font-bold">MTTR CYBER.AR SOAR:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {responseDurationSec !== null ? `${responseDurationSec} seg` : '<10 seg'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón para Abrir Acta Pericial Oficial */}
            <button
              onClick={onOpenActa}
              className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-98"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>[ GENERAR ACTA PERICIAL DE CIBERDEFENSA ]</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onApproveMitigation}
              disabled={isMitigating || isProtectedIp}
              className={`w-full py-4 px-4 rounded-xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-98 ${
                isMitigating
                  ? 'bg-amber-600 text-white cursor-wait'
                  : isProtectedIp
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-red-500'
              }`}
            >
              {isMitigating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>INYECTANDO REGLA EN KERNEL NETFILTER...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 fill-current" />
                  <span>[ APROBAR MITIGACIÓN AUTOMÁTICA ]</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>* Human-in-the-loop: Validación de operador requerida</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Zero Colateral
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
