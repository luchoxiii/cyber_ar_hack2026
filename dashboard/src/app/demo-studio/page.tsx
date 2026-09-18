'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Zap, Lock, Cpu, Clock, CheckCircle2, FileText, Activity } from 'lucide-react';

interface Phase {
  id: number;
  timeRange: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  items: string[];
  guardrail?: string;
}

const PHASES: Phase[] = [
  {
    id: 1,
    timeRange: '00:00 - 00:10',
    title: 'FASE 1: VIGILANCIA EN REPOSO',
    subtitle: 'Enclave Militar Soberano Air-Gapped',
    badge: 'DEFCON 4 // NORMAL',
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
    items: [
      'Consola conectada al nodo táctico DEF-AR-01 en estado de vigilancia activa.',
      'Operación 100% aislada de Internet (Air-Gapped); cero telemetría a nubes externas.',
      'Inferencia local mediante pesos abiertos (Llama 3.1 on-premise en Ollama).',
      'Whitelist determinista de IPs críticas (Gateway, DNS, Red de Mando) cargada en memoria.'
    ]
  },
  {
    id: 2,
    timeRange: '00:10 - 00:22',
    title: 'FASE 2: INGESTA Y AGRESIÓN HOSTIL',
    subtitle: 'Aislamiento Semántico de Telemetría Cruda',
    badge: 'INGESTA EN VIVO // RÁFAGA SSH',
    badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
    guardrail: 'Guardrail 1: Aislamiento Semántico <raw_logs> (Anti-Prompt Injection OWASP LLM01)',
    items: [
      'Simulador inyecta ráfaga hostil de 15 intentos fallidos contra puerto 22 desde IP 185.220.101.5.',
      'Los logs se encapsulan entre etiquetas <raw_logs> tratándose como datos no confiables.',
      'Se neutraliza cualquier intento de inyección de prompt indirecto en usuarios o payloads.',
      'Buffer temporal en n8n (5-10s) agrupa la ráfaga para análisis contextual sin saturar la IA.'
    ]
  },
  {
    id: 3,
    timeRange: '00:22 - 00:36',
    title: 'FASE 3: INFERENCIA MITRE & GUARDRAILS',
    subtitle: 'Detección Inteligente & Resiliencia Anti-Auto-DoS',
    badge: 'DEFCON 2 // ALERTA ROJA',
    badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-700/70',
    guardrail: 'Guardrail 2: Salida JSON Tipada | Guardrail 3: Whitelist Matemática Anti-DoS',
    items: [
      'Agente clasifica el ataque bajo MITRE T1110.001 (Fuerza Bruta SSH) con 95% de confianza.',
      'La IA no corre comandos libres: emite un esquema JSON estrictamente tipado (Guardrail 2).',
      'Módulo matemático en Python puro valida que la IP propuesta NO sea el gateway ni el DNS.',
      'Se anula de raíz el vector de Auto-DoS (engaño al SOC para auto-bloquear infraestructura propia).'
    ]
  },
  {
    id: 4,
    timeRange: '00:36 - 00:48',
    title: 'FASE 4: MANDO MILITAR HUMAN-IN-THE-LOOP',
    subtitle: 'Doctrina de Mando y Control + Inyección en Kernel',
    badge: 'DEFCON 5 // AMENAZA NEUTRALIZADA',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70',
    guardrail: 'Guardrail 4: Comando Parametrizado (ufw insert 1 deny from {ip} to any)',
    items: [
      'Doctrina militar inquebrantable: La IA propone y asiste; el oficial humano decide y comanda.',
      'El operador revisa la telemetría y pulsa [ APROBAR MITIGACIÓN AUTOMÁTICA ].',
      'El backend ensambla la regla fija por lista segura de parámetros (sin shell=True).',
      'Inserción física en el firewall Linux Netfilter en 184 milisegundos (paquetes descartados).'
    ]
  },
  {
    id: 5,
    timeRange: '00:48 - 01:00',
    title: 'FASE 5: CADENA DE CUSTODIA & VERIFICACIÓN',
    subtitle: 'Evidencia Criptográfica Inmutable SHA-256',
    badge: 'ACTA PERICIAL // HASH SHA-256',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-600/70',
    items: [
      'Emisión automática del Acta Pericial Forense con hash SHA-256 inmutable para la justicia.',
      'Trazabilidad legal de operador, hora UTC exacta, regla aplicada e incidente.',
      'Kernel Netfilter descarta paquetes hostiles de forma continua (Connection Refused).',
      'MTTR de respuesta reducido de 45 minutos a menos de 15 segundos (-99.4% de reducción).'
    ]
  }
];

export default function DemoStudioPage() {
  const [seconds, setSeconds] = useState<number>(0);
  const [currentPhaseId, setCurrentPhaseId] = useState<number>(1);

  // Timer de 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev >= 60 ? 60 : prev + 1;
        if (next < 10) setCurrentPhaseId(1);
        else if (next < 22) setCurrentPhaseId(2);
        else if (next < 36) setCurrentPhaseId(3);
        else if (next < 48) setCurrentPhaseId(4);
        else setCurrentPhaseId(5);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = (seconds / 60) * 100;
  const currentPhase = PHASES.find((p) => p.id === currentPhaseId) || PHASES[0];

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Barra Superior de Control del Estudio */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded bg-slate-900 border border-slate-700 text-rose-500">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider text-white">CYBERSOAR-AR</span>
              <span className="text-slate-500 text-xs font-mono">//</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">DEMOSTRACIÓN GUIADA Y EXPLICADA</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              HACKATHON CYBER.AR 2026 • EJE 2: IA Y CIBERDEFENSA (FIE - UNDEF)
            </div>
          </div>
        </div>

        {/* Cronómetro y Barra de Progreso */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
            <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-slate-200">
              {formatTime(seconds)} <span className="text-slate-500 font-normal">/ 01:00</span>
            </span>
          </div>

          <div className="w-48 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
            <Cpu className="h-3 w-3" />
            <span>100% AIR-GAPPED</span>
          </div>
        </div>
      </header>

      {/* Cuerpo Principal Dividido: 70% Dashboard Real / 30% Panel de Explicación */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lado Izquierdo: Consola Táctica SOC Real en Vivo */}
        <div className="w-[68%] h-full border-r border-slate-800 relative bg-slate-950">
          <div className="absolute top-2 left-2 z-10 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 flex items-center gap-2 shadow-lg backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>EJECUCIÓN DEL SISTEMA EN TIEMPO REAL</span>
          </div>
          <iframe
            id="dashboard-frame"
            src="/"
            className="w-full h-full border-none"
            title="Consola SOC Real CyberSOAR-AR"
          />
        </div>

        {/* Lado Derecho: Panel Táctico Explicativo Sincronizado */}
        <div className="w-[32%] h-full bg-slate-950/95 flex flex-col p-4 overflow-y-auto space-y-3.5 border-l border-slate-900">
          <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>CENTRO DE EXPLICACIÓN DOCTRINARIA</span>
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              FASE {currentPhaseId} DE 5
            </span>
          </div>

          {/* Tarjeta de la Fase Activa Destacada */}
          <div className="bg-slate-900/90 border-2 border-emerald-500/70 rounded-xl p-4 shadow-xl shadow-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${currentPhase.badgeColor}`}>
                {currentPhase.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-medium">
                {currentPhase.timeRange}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                {currentPhase.title}
              </h3>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                {currentPhase.subtitle}
              </p>
            </div>

            {currentPhase.guardrail && (
              <div className="bg-amber-950/40 border border-amber-600/50 rounded-lg p-2 text-[11px] font-mono text-amber-300 flex items-start gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{currentPhase.guardrail}</span>
              </div>
            )}

            <ul className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
              {currentPhase.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lista de las 5 Fases con Indicadores de Estado */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Secuencia Operativa Completa:
            </div>
            {PHASES.map((p) => {
              const isCurrent = p.id === currentPhaseId;
              const isPast = p.id < currentPhaseId;
              return (
                <div
                  key={p.id}
                  className={`px-3 py-2 rounded-lg border transition-all flex items-center justify-between text-xs font-mono ${
                    isCurrent
                      ? 'bg-slate-900 border-emerald-500 text-white font-bold'
                      : isPast
                      ? 'bg-slate-950 border-slate-900 text-slate-400 line-through opacity-60'
                      : 'bg-slate-950/50 border-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${isCurrent ? 'bg-emerald-400 animate-ping' : isPast ? 'bg-slate-600' : 'bg-slate-700'}`} />
                    <span>{p.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{p.timeRange}</span>
                </div>
              );
            })}
          </div>

          {/* Métricas de Cierre y Doctrina Militar */}
          <div className="mt-auto pt-3 border-t border-slate-900 grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">MTTR CON IA:</span>
              <span className="text-emerald-400 font-bold text-xs">&lt; 15 seg (-99.4%)</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">LATENCIA KERNEL:</span>
              <span className="text-emerald-400 font-bold text-xs">184 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
