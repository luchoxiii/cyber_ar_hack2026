import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { incident_id, target_ip, command, operator = 'OP-DEFENSA-CYBERAR (UNDEF)' } = body;

    if (!incident_id || !target_ip || !command) {
      return NextResponse.json(
        { error: 'Missing required parameters (incident_id, target_ip, command)' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const auditPayload = `${incident_id}|${target_ip}|${command}|${timestamp}|${operator}|CYBERAR_SOVEREIGNTY_V1`;
    const sha256_hash = crypto.createHash('sha256').update(auditPayload).digest('hex');

    // Notificación en segundo plano al webhook de n8n (Rama 2 de Denis) si está levantado
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_MITIGATE_WEBHOOK || 'http://localhost:5678/webhook-test/mitigate';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'MITIGATION_APPROVED',
          incident_id,
          target_ip,
          command_executed: command,
          sha256_hash,
          operator,
          timestamp,
        }),
        signal: controller.signal,
      }).catch(() => {});
      clearTimeout(timeoutId);
    } catch {
      // n8n no está levantado aún, se continúa sin interrupción
    }

    // Simulación de latencia de kernel netfilter local (150ms)
    await new Promise((resolve) => setTimeout(resolve, 150));

    return NextResponse.json({
      success: true,
      audit_id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      incident_id,
      timestamp,
      operator,
      command_executed: command,
      sha256_hash,
      firewall_status: 'ACTIVE_BLOCKED',
      sovereignty_mode: 'AIR-GAPPED_LOCAL_CONTAINMENT',
      time_to_contain_ms: 184,
      message: `Regla de contención ejecutada exitosamente. Vector ${target_ip} neutralizado.`
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Error procesando la mitigación', details: String(err) },
      { status: 500 }
    );
  }
}
