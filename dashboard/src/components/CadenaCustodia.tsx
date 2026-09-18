'use client';

import React, { useState } from 'react';
import { ForensicAudit } from '@/types/incident';
import { FileCheck, Copy, Check, Download, Hash } from 'lucide-react';

interface CadenaCustodiaProps {
  auditLog: ForensicAudit[];
}

export const CadenaCustodia: React.FC<CadenaCustodiaProps> = ({ auditLog }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLog, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cadena_custodia_cyberar_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden backdrop-blur">
      {/* Encabezado */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Cadena de Custodia & Registro Forense Inmutable
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Firma criptográfica SHA-256 de cada acción de mitigación aprobada por el operador
            </p>
          </div>
        </div>

        {auditLog.length > 0 && (
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exportar Evidencia (.json)</span>
          </button>
        )}
      </div>

      {/* Cuerpo del Log */}
      <div className="p-3 overflow-x-auto">
        {auditLog.length === 0 ? (
          <div className="py-6 text-center text-slate-500 font-mono text-xs">
            <Hash className="h-6 w-6 mx-auto mb-1.5 text-slate-600" />
            No se han registrado acciones de contención en la sesión activa.
            <div className="text-[11px] text-slate-600 mt-1">
              Al presionar &quot;Aprobar Mitigación&quot;, la firma criptográfica se estampará aquí automáticamente.
            </div>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-400">
                <th className="pb-2">Timestamp (UTC)</th>
                <th className="pb-2">ID Incidente</th>
                <th className="pb-2">Comando Aplicado</th>
                <th className="pb-2">Hash SHA-256 (Evidencia)</th>
                <th className="pb-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {auditLog.map((log) => (
                <tr key={log.audit_id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 text-slate-400 whitespace-nowrap">
                    {log.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-2.5 font-bold text-slate-200 whitespace-nowrap">
                    {log.incident_id}
                  </td>
                  <td className="py-2.5 text-emerald-400 max-w-xs truncate">
                    <code>{log.command_executed}</code>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800/80 max-w-sm">
                      <span className="truncate text-[10px] text-slate-300 select-all font-mono">
                        {log.sha256_hash}
                      </span>
                      <button
                        onClick={() => handleCopyHash(log.sha256_hash)}
                        title="Copiar Hash SHA-256"
                        className="text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                      >
                        {copiedHash === log.sha256_hash ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                      {log.firewall_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
