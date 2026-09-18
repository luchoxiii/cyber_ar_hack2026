export type SOCState = 'STANDBY' | 'INCIDENT_DETECTED' | 'MITIGATING' | 'CONTAINED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  phase: string;
  timestamp: string;
  event_type: string;
  mitre_id: string;
  source_ip: string;
  destination_ip: string;
  port: number;
  protocol: string;
  message: string;
}

export interface MitigationAction {
  action_type: string;
  target_ip: string;
  command_ufw: string;
  command_iptables: string;
  estimated_impact: string;
  risk_level: string;
}

export interface Incident {
  id: string;
  scenario_key?: string;
  name: string;
  severity: IncidentSeverity;
  confidence_score: number;
  detected_at: string;
  source: {
    ip: string;
    country?: string;
    asn?: string;
    reputation?: string;
  };
  destination: {
    ip: string;
    hostname?: string;
    subnet?: string;
    zone?: string;
  };
  mitre_attack: MitreTechnique[];
  timeline_events: TimelineEvent[];
  suggested_mitigation: MitigationAction;
}

export interface ForensicAudit {
  audit_id: string;
  incident_id: string;
  timestamp: string;
  operator: string;
  command_executed: string;
  sha256_hash: string;
  firewall_status: string;
  time_to_contain_ms: number;
  sovereignty_mode: string;
}
