# 🔄 Motor de Orquestación n8n — CyberSOAR-AR

> **Fase 2 del Pipeline SOAR** — Ingesta, buffer temporal, inferencia con IA (Ollama / OpenAI), validación de guardrails deterministas y ejecución de remediación Human-in-the-Loop.

---

## 1. Arquitectura del Flujo

El archivo [`cyber_soar_workflow.json`](cyber_soar_workflow.json) contiene la definición completa del pipeline para importar directamente en n8n:

```
[Simulador de Telemetría]
          │ POST /webhook-test/security-events
          ▼
┌─────────────────────────────────┐
│ Webhook Ingesta Telemetría      │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Buffer Temporal y Aislamiento   │ ──▶ Encapsula logs en <raw_logs> (Guardrail 1)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Agente IA (Ollama / Local LLM)  │ ──▶ Inferencia estructurada (MITRE ATT&CK)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Validador Guardrails OWASP LLM  │ ──▶ Verificación Whitelist Anti-DoS (Guardrail 3)
└────────────────┬────────────────┘     y comando parametrizado (Guardrail 4)
                 ▼
     [Consola SOC / Dashboard]
                 │ Aprobación del operador
                 ▼ POST /webhook-test/mitigate
┌─────────────────────────────────┐
│ Webhook Aprobación Mitigación   │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Ejecutar Remediación (UFW/Drop) │ ──▶ ufw insert 1 deny from {ip} to any
└─────────────────────────────────┘
```

---

## 2. Despliegue Rápido con Docker

Para correr n8n localmente en un entorno air-gapped o de laboratorio:

```bash
docker run -it --rm \
  --name n8n-cybersoar \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Conexión con Ollama (LLM 100% On-Premise)

Si se utiliza Ollama local para no enviar datos a la nube externa:

```bash
# Descargar modelo abierto
ollama pull llama3.1

# n8n se conectará a Ollama en:
# http://host.docker.internal:11434 o http://localhost:11434
```

---

## 3. Importación del Flujo

1. Abrir la interfaz web de n8n en `http://localhost:5678`.
2. En el menú superior derecho, seleccionar **Import from File**.
3. Seleccionar el archivo `n8n/cyber_soar_workflow.json`.
4. Activar el interruptor **Active** para habilitar los webhooks en modo producción o usar el modo test.

---

## 4. Endpoints Expuestos

| Método | Path | Función |
|---|---|---|
| `POST` | `/webhook-test/security-events` | Ingesta de telemetría desde `attack_simulator.py` |
| `POST` | `/webhook-test/mitigate` | Recepción de aprobación del operador desde el Dashboard SOC |

