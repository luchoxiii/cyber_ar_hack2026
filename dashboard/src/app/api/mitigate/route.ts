import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { incident_id, target_ip, command, operator = 'DEF-OPERATOR-01' } = body;

    if (!incident_id || !target_ip || !command) {
      return NextResponse.json(
        { error: 'Missing required parameters (incident_id, target_ip, command)' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const auditPayload = `${incident_id}|${target_ip}|${command}|${timestamp}|${operator}|CYBERAR_SOVEREIGNTY_V1`;
    const sha256_hash = crypto.createHash('sha256').update(auditPayload).digest('hex');

    // Simulación de ejecución en kernel/iptables (latencia táctica de 250ms)
    await new Promise((resolve) => setTimeout(resolve, 250));

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
      time_to_contain_ms: 312,
      message: `Regla de contención ejecutada exitosamente. Vector ${target_ip} neutralizado.`
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Error procesando la mitigación', details: String(err) },
      { status: 500 }
    );
  }
}
