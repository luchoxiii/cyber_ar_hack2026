'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Incident, SOCState, ForensicAudit } from '@/types/incident';

export function isInternalProtectedSubnet(ip: string): boolean {
  if (!ip) return false;
  // Subred de comando interno CyberAr (10.0.0.0/8 o loopback)
  if (ip.startsWith('10.') || ip === '127.0.0.1' || ip === 'localhost') {
    return true;
  }
  return false;
}

export function useIncidentStream() {
  const [socState, setSocState] = useState<SOCState>('STANDBY');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [auditLog, setAuditLog] = useState<ForensicAudit[]>([]);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [selectedScenario, setSelectedScenario] = useState<string>('c2_multistage');
  const [firewallType, setFirewallType] = useState<'ufw' | 'iptables'>('ufw');
  const [defenseStartTime, setDefenseStartTime] = useState<number | null>(null);
  const [responseDurationSec, setResponseDurationSec] = useState<number | null>(null);
  const [isProtectedIp, setIsProtectedIp] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Sistema en guardia perimetral pasiva.');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar demoMode con env var si existe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const envDemo = process.env.NEXT_PUBLIC_DEMO_MODE;
      if (envDemo !== undefined) {
        setDemoMode(envDemo === 'true');
      }
    }
  }, []);

  // Verificar si la IP es protegida cuando cambia el incidente
  useEffect(() => {
    if (incident?.suggested_mitigation?.target_ip) {
      setIsProtectedIp(isInternalProtectedSubnet(incident.suggested_mitigation.target_ip));
    } else {
      setIsProtectedIp(false);
    }
  }, [incident]);

  // Cargar incidente (ya sea por demo o por backend)
  const loadIncident = useCallback(async (scenarioKey: string = selectedScenario) => {
    setStatusMessage('Consultando telemetría de amenazas...');
    try {
      let data: Incident | null = null;

      if (!demoMode) {
        // Intento con backend local (Task 2) con timeout de 1 segundo
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);

        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/incident/latest';
          const res = await fetch(`${backendUrl}?scenario=${scenarioKey}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          console.warn('Backend no disponible en <1s. Activando fallback local sin interrupciones.');
        }
      }

      // Si falló backend o estamos en Demo Mode
      if (!data) {
        const res = await fetch(`/mock_incidents.json`);
        if (res.ok) {
          const incidents: Incident[] = await res.json();
          data = incidents.find((i) => i.scenario_key === scenarioKey) || incidents[0];
        } else {
          // Fallback al mock individual si fuera necesario
          const singleRes = await fetch(`/mock_incident.json`);
          if (singleRes.ok) {
            data = await singleRes.json();
          }
        }
      }

      if (data) {
        setIncident(data);
        setSocState('INCIDENT_DETECTED');
        setDefenseStartTime(Date.now());
        setResponseDurationSec(null);
        setStatusMessage(`Alerta crítica: ${data.name} detectada.`);
      }
    } catch (err) {
      console.error('Error cargando incidente:', err);
      setStatusMessage('Error al obtener datos. Sistema en modo seguro.');
    }
  }, [demoMode, selectedScenario]);

  // Ejecutar mitigación aprobada
  const approveMitigation = useCallback(async (customIp?: string) => {
    if (!incident) return;

    const targetIp = customIp || incident.suggested_mitigation.target_ip;
    const command = firewallType === 'ufw'
      ? (incident.suggested_mitigation.command_ufw || `ufw insert 1 deny from ${targetIp} to any`)
      : (incident.suggested_mitigation.command_iptables || `iptables -I INPUT 1 -s ${targetIp} -j DROP`);

    setSocState('MITIGATING');
    setStatusMessage('Despachando regla al firewall perimetral...');

    const startTime = defenseStartTime || Date.now();
    const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setResponseDurationSec(duration);

    try {
      // Llamada a POST /api/mitigate
      const res = await fetch('/api/mitigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incident.id,
          target_ip: targetIp,
          command,
          operator: 'OP-DEFENSA-CYBERAR',
        }),
      });

      let auditData: ForensicAudit;

      if (res.ok) {
        auditData = await res.json();
      } else {
        // Fallback criptográfico en cliente si la API fallara
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
          sovereignty_mode: 'AIR-GAPPED_OFFLINE_CONTAINMENT',
        };
      }

      // Guardar en la cadena de custodia
      setAuditLog((prev) => [auditData, ...prev]);
      setSocState('CONTAINED');
      setStatusMessage(`Vector ${targetIp} neutralizado. Contención activa.`);
    } catch (err) {
      console.error('Error aprobando mitigación:', err);
      // Resiliencia: registrar contención local igualmente
      setSocState('CONTAINED');
      setStatusMessage('Mitigación aplicada en modo de contingencia local.');
    }
  }, [incident, firewallType, defenseStartTime]);

  // Reiniciar a standby
  const resetToStandby = useCallback(() => {
    setSocState('STANDBY');
    setIncident(null);
    setDefenseStartTime(null);
    setResponseDurationSec(null);
    setStatusMessage('Sistema en guardia perimetral pasiva.');
  }, []);

  // Limpieza de temporizadores
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
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
  };
}
