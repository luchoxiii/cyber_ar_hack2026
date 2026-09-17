'use client';

import React from 'react';
import { Incident, SOCState } from '@/types/incident';
import { ShieldCheck, ShieldAlert, Terminal, CheckCircle2, Lock, Zap, RefreshCw } from 'lucide-react';

interface TarjetaContencionProps {
  incident: Incident | null;
  socState: SOCState;
  firewallType: 'ufw' | 'iptables';
  onChangeFirewallType: (type: 'ufw' | 'iptables') => void;
  isProtectedIp: boolean;
  onApproveMitigation: () => void;
  responseDurationSec: number | null;
}

export const TarjetaContencion: React.FC<TarjetaContencionProps> = ({
  incident,
  socState,
  firewallType,
  onChangeFirewallType,
  isProtectedIp,
  onApproveMitigation,
  responseDurationSec,
}) => {
  if (!incident) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-slate-800/80 rounded-xl bg-slate-900/40 backdrop-blur">
        <div className="p-4 rounded-full bg-slate-800/60 text-slate-500 mb-3">
          <Lock className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-mono font-semibold text-slate-300">
          MÓDULO DE CONTENCIÓN EN ESPERA
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 font-mono">
          Selecciona o simula un incidente para que el motor SOAR elabore la regla perimetral de respuesta.
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
      {/* Encabezado */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Respuesta Automatizada Human-in-the-Loop
          </span>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            Tarjeta de Contención Defensiva
          </h2>
        </div>

        {/* Selector de Firewall */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => onChangeFirewallType('ufw')}
            disabled={isContained || isMitigating}
            className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
              firewallType === 'ufw'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            UFW
          </button>
          <button
            onClick={() => onChangeFirewallType('iptables')}
            disabled={isContained || isMitigating}
            className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
              firewallType === 'iptables'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iptables
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
        {/* Advertencia si la IP estuviera en subred reservada */}
        {isProtectedIp && (
          <div className="bg-red-950/80 border border-red-500 p-3 rounded-lg flex items-start gap-2.5 text-red-200 text-xs font-mono">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">¡ALERTA DE SEGURIDAD OPERATIVA!</span>
              <p className="mt-0.5 text-red-300">
                La dirección {targetIp} pertenece a la subred de comando interno reservada. Bloquearla causaría una auto-denegación de servicio a la infraestructura defensiva.
              </p>
            </div>
          </div>
        )}

        {/* Consola Terminal con la regla propuesta */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-slate-500" />
              <span>terminal: defense-kernel-cli</span>
            </div>
            <span className="text-[10px] text-cyan-400">Air-Gapped Local Shell</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <p className="text-slate-500"># 1. Regla calculada por IA para aislamiento perimetral:</p>
            <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-emerald-400 select-all font-mono font-semibold">
              $ {activeCommand}
            </div>

            <p className="text-slate-500 mt-2"># 2. Objetivo de impacto mitigador:</p>
            <p className="text-slate-300 pl-2 border-l border-slate-800 text-[11px]">
              {incident.suggested_mitigation.estimated_impact}
            </p>

            <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
              <span>Riesgo Colateral: <strong className="text-emerald-400">{incident.suggested_mitigation.risk_level}</strong></span>
              <span>Vector Host: <strong className="text-red-400">{targetIp}</strong></span>
            </div>
          </div>
        </div>

        {/* Estado Post-Contención o Botón de Aprobación */}
        {isContained ? (
          <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="inline-flex p-2.5 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold font-mono text-emerald-400 tracking-wide">
              AMENAZA NEUTRALIZADA
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Regla perimetral inyectada en kernel y persistida en tabla activa.
            </p>

            {responseDurationSec !== null && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/40 text-xs font-mono text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Tiempo de Reacción Táctica: <strong>{responseDurationSec}s</strong> (Objetivo Golden: &lt;15s)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onApproveMitigation}
              disabled={isMitigating || isProtectedIp}
              className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-98 ${
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
                  <span>INCORPORANDO REGLA EN FIREWALL...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 fill-current" />
                  <span>[ APROBAR MITIGACIÓN AUTOMÁTICA ]</span>
                </>
              )}
            </button>

            <div className="text-center text-[10px] font-mono text-slate-500">
              * Human-in-the-loop: Requiere confirmación tácita del operador para alterar la tabla perimetral.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
