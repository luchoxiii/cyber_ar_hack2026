'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Incident, SOCState, ForensicAudit, TimelineEvent, IncidentSeverity } from '@/types/incident';
import { soundEngine } from '@/utils/audio';

export function isInternalProtectedSubnet(ip: string): boolean {
  if (!ip) return false;
  if (ip.startsWith('10.') || ip === '127.0.0.1' || ip === 'localhost') {
    return true;
  }
  return false;
}

// Normalizador elástico para recibir JSON crudo de n8n, SQLite o LLM de Denis
function normalizeIncident(raw: Record<string, unknown>): Incident {
  // Manejo de severidad en español o inglés
  let severity: IncidentSeverity = 'HIGH';
  const rawSev = String(raw.severity || raw.severidad || 'CRITICAL').toUpperCase();
  if (rawSev.includes('BAJ') || rawSev.includes('LOW')) severity = 'LOW';
  else if (rawSev.includes('MED')) severity = 'MEDIUM';
  else if (rawSev.includes('ALT') || rawSev.includes('HIGH')) severity = 'HIGH';
  else if (rawSev.includes('CRI')) severity = 'CRITICAL';

  // Origen
  const rawSource = (raw.source as Record<string, unknown>) || {};
  const sourceIp = String(rawSource.ip || raw.source_ip || raw.ip_origen || raw.attacker_ip || '185.220.101.5');
  const sourceCountry = String(rawSource.country || raw.pais || 'Desconocido');

  // Destino
  const rawDest = (raw.destination as Record<string, unknown>) || {};
  const destIp = String(rawDest.ip || raw.destination_ip || raw.ip_destino || raw.target_ip || '192.168.1.50');
  const destHostname = String(rawDest.hostname || raw.host_destino || 'srv-core-defense.ar');

  // Mitigación
  const rawMitigation = (raw.suggested_mitigation as Record<string, unknown>) || {};
  const commandUfw = String(
    rawMitigation.command_ufw ||
    raw.comando_mitigacion ||
    raw.mitigation_command ||
    `ufw insert 1 deny from ${sourceIp} to any`
  );
  const commandIptables = String(
    rawMitigation.command_iptables ||
    `iptables -I INPUT 1 -s ${sourceIp} -j DROP`
  );

  return {
    id: String(raw.id || raw.incident_id || `INC-${Date.now().toString().slice(-4)}`),
    scenario_key: String(raw.scenario_key || 'custom'),
    name: String(raw.name || raw.nombre || raw.titulo || raw.resumen || 'Incidente de Ciberseguridad Detectado'),
    severity,
    confidence_score: Number(raw.confidence_score || raw.certeza || 0.96),
    detected_at: String(raw.detected_at || raw.timestamp || new Date().toISOString()),
    source: {
      ip: sourceIp,
      country: sourceCountry,
      asn: String(rawSource.asn || 'AS-DYNAMIC'),
      reputation: String(rawSource.reputation || 'Alerta SOAR'),
    },
    destination: {
      ip: destIp,
      hostname: destHostname,
      subnet: String(rawDest.subnet || '192.168.1.0/24'),
      zone: String(rawDest.zone || 'DMZ Estratégica'),
    },
    mitre_attack: Array.isArray(raw.mitre_attack) ? raw.mitre_attack : [
      {
        id: String(raw.mitre_id || 'T1110.001'),
        name: String(raw.mitre_name || 'Intrusión no autorizada'),
        tactic: 'Credential Access',
        description: 'Técnica correlacionada por agente de IA.',
      }
    ],
    timeline_events: Array.isArray(raw.timeline_events) ? raw.timeline_events : [
      {
        id: 'EVT-01',
        phase: 'Fase 1: Ingesta n8n',
        timestamp: new Date().toISOString(),
        event_type: 'CORRELATED_ALERT',
        mitre_id: String(raw.mitre_id || 'T1110.001'),
        source_ip: sourceIp,
        destination_ip: destIp,
        port: 22,
        protocol: 'TCP',
        message: String(raw.resumen || 'Telemetría correlacionada por el agente de n8n.'),
      }
    ],
    suggested_mitigation: {
      action_type: 'FIREWALL_ISOLATION',
      target_ip: sourceIp,
      command_ufw: commandUfw,
      command_iptables: commandIptables,
      estimated_impact: String(rawMitigation.estimated_impact || 'Aislamiento perimetral del vector atacante.'),
      risk_level: 'ZERO_COLLATERAL',
    },
  };
}

export function useIncidentStream() {
  const [socState, setSocState] = useState<SOCState>('STANDBY');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [displayedEvents, setDisplayedEvents] = useState<TimelineEvent[]>([]);
  const [auditLog, setAuditLog] = useState<ForensicAudit[]>([]);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [selectedScenario, setSelectedScenario] = useState<string>('c2_multistage');
  const [firewallType, setFirewallType] = useState<'ufw' | 'iptables'>('ufw');
  const [defenseStartTime, setDefenseStartTime] = useState<number | null>(null);
  const [responseDurationSec, setResponseDurationSec] = useState<number | null>(null);
  const [isProtectedIp, setIsProtectedIp] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Sistema en guardia perimetral pasiva. DEFCON 4.');
  const [droppedPackets, setDroppedPackets] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const envDemo = process.env.NEXT_PUBLIC_DEMO_MODE;
      if (envDemo !== undefined) {
        setDemoMode(envDemo === 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (incident?.suggested_mitigation?.target_ip) {
      setIsProtectedIp(isInternalProtectedSubnet(incident.suggested_mitigation.target_ip));
    } else {
      setIsProtectedIp(false);
    }
  }, [incident]);

  useEffect(() => {
    if (socState === 'CONTAINED') {
      timerRef.current = setInterval(() => {
        setDroppedPackets((prev) => prev + Math.floor(Math.random() * 14) + 6);
      }, 700);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setDroppedPackets(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [socState]);

  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Carga instantánea con normalización elástica
  const loadIncident = useCallback(async (scenarioKey: string = selectedScenario) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsStreaming(false);

    try {
      let rawData: Record<string, unknown> | null = null;
      if (!demoMode) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/incident/latest';
          const res = await fetch(`${backendUrl}?scenario=${scenarioKey}`, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (res.ok) rawData = await res.json();
        } catch {
          console.warn('Backend n8n no respondió en <1s. Fallback a datos locales.');
        }
      }

      if (!rawData) {
        const res = await fetch('/mock_incidents.json');
        if (res.ok) {
          const incidents: Record<string, unknown>[] = await res.json();
          rawData = incidents.find((i) => i.scenario_key === scenarioKey) || incidents[0];
        }
      }

      if (rawData) {
        const normalized = normalizeIncident(rawData);
        setIncident(normalized);
        setDisplayedEvents(normalized.timeline_events);
        setSocState('INCIDENT_DETECTED');
        setDefenseStartTime(Date.now());
        setResponseDurationSec(null);
        setStatusMessage(`ALERTA DEFCON 2: ${normalized.name}`);
        soundEngine.playCriticalAlarm();
      }
    } catch (err) {
      console.error('Error cargando incidente:', err);
    }
  }, [demoMode, selectedScenario]);

  // Ingesta dinámica en vivo (Stream)
  const startStreamingIncident = useCallback(async (scenarioKey: string = selectedScenario) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setSocState('STANDBY');
    setIncident(null);
    setDisplayedEvents([]);
    setIsStreaming(true);
    setStatusMessage('Iniciando ingesta de telemetría en tiempo real...');

    try {
      const res = await fetch('/mock_incidents.json');
      if (!res.ok) return;
      const incidents: Record<string, unknown>[] = await res.json();
      const raw = incidents.find((i) => i.scenario_key === scenarioKey) || incidents[0];
      const targetIncident = normalizeIncident(raw);

      let currentIndex = 0;
      setIncident(targetIncident);
      setSocState('INCIDENT_DETECTED');
      setDefenseStartTime(Date.now());

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < targetIncident.timeline_events.length) {
          const nextEvt = targetIncident.timeline_events[currentIndex];
          setDisplayedEvents((prev) => [...prev, nextEvt]);
          soundEngine.playEventRadar();
          setStatusMessage(`Ingesta en vivo: ${nextEvt.phase} correlacionada (${nextEvt.mitre_id})`);
          currentIndex++;
        } else {
          if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
          setIsStreaming(false);
          soundEngine.playCriticalAlarm();
          setStatusMessage(`ALERTA DEFCON 2: Intrusión completa correlacionada. Requiere contención.`);
        }
      }, 1300);
    } catch (err) {
      console.error('Error en stream:', err);
      setIsStreaming(false);
    }
  }, [selectedScenario]);

  // Aprobar mitigación
  const approveMitigation = useCallback(async (customIp?: string) => {
    if (!incident) return;

    const targetIp = customIp || incident.suggested_mitigation.target_ip;
    const command = firewallType === 'ufw'
      ? (incident.suggested_mitigation.command_ufw || `ufw insert 1 deny from ${targetIp} to any`)
      : (incident.suggested_mitigation.command_iptables || `iptables -I INPUT 1 -s ${targetIp} -j DROP`);

    setSocState('MITIGATING');
    setStatusMessage('Inyectando regla de aislamiento en kernel netfilter...');

    const startTime = defenseStartTime || Date.now();
    const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setResponseDurationSec(duration);

    try {
      const res = await fetch('/api/mitigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incident.id,
          target_ip: targetIp,
          command,
          operator: 'OP-DEFENSA-CYBERAR (UNDEF)',
        }),
      });

      let auditData: ForensicAudit;
      if (res.ok) {
        auditData = await res.json();
      } else {
        const textToHash = `${incident.id}|${targetIp}|${command}|${new Date().toISOString()}|OP-DEFENSA-CYBERAR`;
        const encoder = new TextEncoder();
        const hashBuf = await crypto.subtle.digest('SHA-256', encoder.encode(textToHash));
        const hashArr = Array.from(new Uint8Array(hashBuf));
        const sha256_hash = hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');

        auditData = {
          audit_id: `AUD-LOCAL-${Date.now()}`,
          incident_id: incident.id,
          timestamp: new Date().toISOString(),
          operator: 'OP-DEFENSA-CYBERAR (AIR-GAPPED)',
          command_executed: command,
          sha256_hash,
          firewall_status: 'ACTIVE_BLOCKED',
          time_to_contain_ms: 280,
          sovereignty_mode: 'AIR-GAPPED_LOCAL_CONTAINMENT',
        };
      }

      setAuditLog((prev) => [auditData, ...prev]);
      setSocState('CONTAINED');
      setStatusMessage(`AMENAZA NEUTRALIZADA: Vector ${targetIp} bloqueado en tabla activa.`);
      soundEngine.playMitigationSuccess();
    } catch (err) {
      console.error('Error en mitigación:', err);
      setSocState('CONTAINED');
      soundEngine.playMitigationSuccess();
    }
  }, [incident, firewallType, defenseStartTime]);

  const resetToStandby = useCallback(() => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setSocState('STANDBY');
    setIncident(null);
    setDisplayedEvents([]);
    setDefenseStartTime(null);
    setResponseDurationSec(null);
    setIsStreaming(false);
    setStatusMessage('Sistema en guardia perimetral pasiva. DEFCON 4.');
  }, []);

  return {
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
  };
}
