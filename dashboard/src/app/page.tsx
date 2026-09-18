'use client';

import React, { useState } from 'react';
import { useIncidentStream } from '@/hooks/useIncidentStream';
import { HeaderTactico } from '@/components/HeaderTactico';
import { TopologiaRed } from '@/components/TopologiaRed';
import { MatrizMitre } from '@/components/MatrizMitre';
import { TimelineForense } from '@/components/TimelineForense';
import { TarjetaContencion } from '@/components/TarjetaContencion';
import { CadenaCustodia } from '@/components/CadenaCustodia';
import { ModalActaPericial } from '@/components/ModalActaPericial';

export default function Home() {
  const {
    socState,
    incident,
    displayedEvents,
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
    droppedPackets,
    isStreaming,
    isMuted,
    toggleAudio,
    loadIncident,
    startStreamingIncident,
    approveMitigation,
    resetToStandby,
  } = useIncidentStream();

  const [isActaOpen, setIsActaOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500/30 selection:text-red-200">
      {/* 1. Header Táctico Superior Militarizado */}
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
        onStartStream={() => startStreamingIncident(selectedScenario)}
        isStreaming={isStreaming}
        onReset={resetToStandby}
        statusMessage={statusMessage}
        isMuted={isMuted}
        onToggleAudio={toggleAudio}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 p-3 md:p-5 max-w-7xl mx-auto w-full space-y-4">
        {/* 2. Topología Táctica Activa de Red */}
        <TopologiaRed
          incident={incident}
          socState={socState}
          droppedPackets={droppedPackets}
        />

        {/* 3. Matriz MITRE ATT&CK Enterprise (Kill Chain) */}
        <MatrizMitre activeTechniques={incident?.mitre_attack || []} />

        {/* 4. Grid Operativo: Timeline Forense + Tarjeta de Contención */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Columna Izquierda: Reconstrucción Cronológica del Ataque */}
          <div className="lg:col-span-7 h-[560px]">
            <TimelineForense
              incident={incident}
              displayedEvents={displayedEvents}
              isStreaming={isStreaming}
            />
          </div>

          {/* Columna Derecha: Tarjeta de Contención Defensiva y Kernel Inspector */}
          <div className="lg:col-span-5 h-[560px]">
            <TarjetaContencion
              incident={incident}
              socState={socState}
              firewallType={firewallType}
              onChangeFirewallType={setFirewallType}
              isProtectedIp={isProtectedIp}
              onApproveMitigation={() => approveMitigation()}
              responseDurationSec={responseDurationSec}
              droppedPackets={droppedPackets}
              onOpenActa={() => setIsActaOpen(true)}
            />
          </div>
        </div>

        {/* 5. Panel Inferior: Cadena de Custodia Criptográfica SHA-256 */}
        <div>
          <CadenaCustodia auditLog={auditLog} />
        </div>
      </main>

      {/* Footer Táctico */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-2.5 text-center text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>CYBER.AR 2026 • FACULTAD DE INGENIERÍA DEL EJÉRCITO (FIE - UNDEF)</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span>EJE 2: IA PARA LA DEFENSA DE REDES E INFRAESTRUCTURA</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">SOBERANÍA DE DATOS GARANTIZADA</span>
        </div>
      </footer>

      {/* Modal de Acta Pericial Forense */}
      <ModalActaPericial
        isOpen={isActaOpen}
        onClose={() => setIsActaOpen(false)}
        incident={incident}
        auditRecord={auditLog.length > 0 ? auditLog[0] : null}
      />
    </div>
  );
}
