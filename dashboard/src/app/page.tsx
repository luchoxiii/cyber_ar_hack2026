'use client';

import React from 'react';
import { useIncidentStream } from '@/hooks/useIncidentStream';
import { HeaderTactico } from '@/components/HeaderTactico';
import { TimelineForense } from '@/components/TimelineForense';
import { TarjetaContencion } from '@/components/TarjetaContencion';
import { CadenaCustodia } from '@/components/CadenaCustodia';

export default function Home() {
  const {
    socState,
    incident,
    auditLog,
    demoMode,
    setDemoMode,
    selectedScenario,
    setSelectedScenario,
    firewallType,
    setFirewallType,
    isProtectedIp,
    statusMessage,
    responseDurationSec,
    loadIncident,
    approveMitigation,
    resetToStandby,
  } = useIncidentStream();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* 1. Header Táctico Superior */}
      <HeaderTactico
        socState={socState}
        demoMode={demoMode}
        onToggleDemoMode={setDemoMode}
        selectedScenario={selectedScenario}
        onSelectScenario={(sc) => {
          setSelectedScenario(sc);
          loadIncident(sc);
        }}
        onSimulateIncident={() => loadIncident(selectedScenario)}
        onReset={resetToStandby}
        statusMessage={statusMessage}
      />

      {/* Main Grid: Columna Izquierda (Timeline) + Columna Derecha (Contención) */}
      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto w-full">
        {/* Columna Izquierda (60% ancho en pantallas grandes): Timeline Forense */}
        <div className="lg:col-span-7 h-[580px]">
          <TimelineForense incident={incident} />
        </div>

        {/* Columna Derecha (40% ancho en pantallas grandes): Tarjeta de Contención */}
        <div className="lg:col-span-5 h-[580px]">
          <TarjetaContencion
            incident={incident}
            socState={socState}
            firewallType={firewallType}
            onChangeFirewallType={setFirewallType}
            isProtectedIp={isProtectedIp}
            onApproveMitigation={() => approveMitigation()}
            responseDurationSec={responseDurationSec}
          />
        </div>

        {/* Panel Inferior: Cadena de Custodia & Evidencia SHA-256 */}
        <div className="lg:col-span-12">
          <CadenaCustodia auditLog={auditLog} />
        </div>
      </main>

      {/* Footer Táctico */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-2.5 text-center text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>CYBER.AR 2026 • FIE - UNDEF • EJE 2: IA PARA LA DEFENSA DE REDES</span>
        </div>
        <div>
          <span>REPOSITORIO RAMA 3: MITIGACIÓN ACTIVA &amp; HUMAN-IN-THE-LOOP</span>
        </div>
      </footer>
    </div>
  );
}
