'use client';

import React from 'react';
import { Incident, ForensicAudit } from '@/types/incident';
import { X, Printer, Shield, CheckCircle2, Lock } from 'lucide-react';

interface ModalActaPericialProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  auditRecord: ForensicAudit | null;
}

export const ModalActaPericial: React.FC<ModalActaPericialProps> = ({
  isOpen,
  onClose,
  incident,
  auditRecord,
}) => {
  if (!isOpen || !incident || !auditRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Barra superior de control modal */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-bold">DOCUMENTO PERICIAL FORENSE ENCRIPTADO</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Acta Oficial (Documento Formal) */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 font-serif bg-slate-950 print:bg-white print:text-black">
          {/* Membrete Oficial */}
          <div className="text-center border-b-2 border-slate-800 pb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-red-500" />
              <span className="font-sans font-black tracking-widest text-sm text-slate-100 uppercase">
                REPÚBLICA ARGENTINA • MINISTERIO DE DEFENSA
              </span>
            </div>
            <div className="font-sans text-xs text-slate-400 tracking-wider">
              FACULTAD DE INGENIERÍA DEL EJÉRCITO (FIE) • UNIVERSIDAD DE LA DEFENSA NACIONAL (UNDEF)
            </div>
            <div className="font-sans text-[11px] text-red-400 font-bold uppercase tracking-widest mt-1">
              CENTRO DE OPERACIONES DE CIBERDEFENSA // SISTEMA SOAR TÁCTICO CYBER.AR
            </div>
            <div className="mt-3 inline-block px-3 py-1 bg-red-950/60 border border-red-500/40 rounded text-xs font-mono text-red-300 font-bold">
              ACTA OFICIAL DE INTERVENCIÓN PERICIAL Y CONTENCIÓN DE AMENAZAS #{auditRecord.audit_id}
            </div>
          </div>

          {/* Información del Folio */}
          <div className="grid grid-cols-2 gap-4 font-mono text-xs border border-slate-800 p-4 rounded bg-slate-900/50">
            <div>
              <span className="text-slate-500 block">ID INCIDENTE:</span>
              <span className="font-bold text-slate-200">{incident.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block">FECHA Y HORA (UTC):</span>
              <span className="text-slate-200">{auditRecord.timestamp}</span>
            </div>
            <div>
              <span className="text-slate-500 block">OPERADOR RESPONSABLE:</span>
              <span className="text-emerald-400 font-bold">{auditRecord.operator}</span>
            </div>
            <div>
              <span className="text-slate-500 block">MODALIDAD DE OPERACIÓN:</span>
              <span className="text-cyan-400 font-bold">{auditRecord.sovereignty_mode}</span>
            </div>
          </div>

          {/* 1. Descripción de la Incursión */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1">
              1. DESCRIPCIÓN TÉCNICA DEL EVENTO
            </h4>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              En la fecha y hora indicadas, la consola de ciberdefensa detectó una actividad hostil categorizada como{' '}
              <strong className="text-red-400">{incident.name}</strong>, con severidad{' '}
              <strong className="text-red-400">{incident.severity}</strong> e índice de certeza de correlación IA del{' '}
              <strong className="text-cyan-400">{(incident.confidence_score * 100).toFixed(0)}%</strong>.
            </p>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded border border-slate-800 space-y-1">
              <div><strong>Host Vector Atacante:</strong> {incident.source.ip} ({incident.source.country || 'No revelado'})</div>
              <div><strong>Activo Afectado:</strong> {incident.destination.hostname} ({incident.destination.ip} en {incident.destination.zone})</div>
              <div><strong>Técnicas MITRE ATT&CK Identificadas:</strong> {incident.mitre_attack.map(t => `${t.id} (${t.name})`).join(', ')}</div>
            </div>
          </div>

          {/* 2. Medida de Aislamiento Ejecutada */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1">
              2. ORDEN DE MITIGACIÓN Y REGLA DE KERNEL APLICADA
            </h4>
            <p className="text-xs font-mono text-slate-300">
              Con el objetivo de salvaguardar la disponibilidad e integridad de los sistemas de comando, el operador aprobó la ejecución inmediata del aislamiento perimetral:
            </p>
            <div className="font-mono text-xs bg-black p-3 rounded border border-emerald-500/40 text-emerald-400 font-bold">
              $ {auditRecord.command_executed}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Estado de la regla: <strong>{auditRecord.firewall_status}</strong> • Latencia de ejecución: <strong>{auditRecord.time_to_contain_ms} ms</strong>.
            </div>
          </div>

          {/* 3. Cadena de Custodia Criptográfica */}
          <div className="space-y-2 bg-slate-900/80 p-4 rounded border border-slate-800 font-mono">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              3. CERTIFICACIÓN CRIPTOGRÁFICA DE LA EVIDENCIA (SHA-256)
            </h4>
            <div className="text-[11px] text-slate-400">
              El siguiente valor hash representa la firma digital inmutable del conjunto de evidencia, orden emitida y timestamp de ejecución, garantizando su validez ante tribunales o auditorías de ciberdefensa:
            </div>
            <div className="p-2.5 rounded bg-black border border-slate-700 text-cyan-300 text-xs break-all select-all font-bold">
              {auditRecord.sha256_hash}
            </div>
          </div>

          {/* Firmas de Responsabilidad */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center font-sans text-xs">
            <div className="border-t border-slate-700 pt-2">
              <div className="font-bold text-slate-200">OP-DEFENSA-CYBERAR</div>
              <div className="text-slate-500 text-[10px]">Operador de Turno SOC // FIE-UNDEF</div>
            </div>
            <div className="border-t border-slate-700 pt-2">
              <div className="font-bold text-slate-200">SISTEMA AUTÓNOMO SOAR</div>
              <div className="text-slate-500 text-[10px]">Firma Criptográfica Verificada</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
