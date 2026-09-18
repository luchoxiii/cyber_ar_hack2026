# CyberSOAR-AR — Matriz de Tareas y Fases

## Fase 1: El Simulador de Telemetría (Tu fuente de datos)
El agente necesita eventos que analizar. Armamos un script mínimo en Python para inyectar logs realistas al webhook de n8n.

### Rama 1
- [x] **Task 1.1:** Crear script `attack_simulator.py` con 3 escenarios de prueba:
  - **Escenario A (Fuerza Bruta SSH):** Ráfaga de logins fallidos desde una misma IP contra un puerto 22.
  - **Escenario B (Escaneo de Puertos/Recon):** Conexiones rápidas a múltiples puertos en segundos.
  - **Escenario C (Web Exploit / Path Traversal):** Peticiones HTTP con payloads como `../../etc/passwd` o comandos shell.
- [x] **Task 1.2:** Formatear los eventos en un JSON estándar (timestamp, IP origen, IP destino, puerto, protocolo, payload/mensaje).
- [x] **Task 1.3:** Agregar función de envío por POST al endpoint de n8n (con fallback y guardado local).

---

## Fase 2: El Cerebro en n8n (Ingesta, Correlación e Inferencia)
Aquí vive la lógica del agente y la conexión con el LLM.

### Rama 2
- [x] **Task 2.1:** Configurar nodo Webhook (POST) en n8n para recibir la ráfaga de logs (`n8n/cyber_soar_workflow.json`).
- [x] **Task 2.2:** Nodo de acumulación/buffer (nodo Code o ventana temporal de 5-10 segundos) para no evaluar log por log, sino el lote de eventos en conjunto (esto es lo que permite la correlación temporal) y delimitación semántica `<raw_logs>`.
- [x] **Task 2.3:** Configurar el nodo AI Agent / Ollama / OpenAI con un System Prompt estricto y Structured Outputs (JSON Schema obligatorio):
  - Severidad (BAJA, MEDIA, ALTA, CRÍTICA).
  - Táctica y Técnica MITRE ATT&CK (ej. T1110 - Brute Force).
  - Resumen ejecutivo del incidente (en 2 oraciones).
  - Comando exacto de mitigación propuesto (ej. comando bash de bloqueo o revocación).
- [x] **Task 2.4:** Parsear la respuesta y persistir el incidente con validación de Guardrails OWASP (`guardrails.py`).

---

## Fase 3: Mitigación Activa y Human-in-the-Loop
El diferencial que te hace ganar: la IA propone y el humano aprueba con un clic para ejecutar la defensa.

### Rama 3
- [x] **Task 3.1:** Crear un mecanismo de aprobación rápida:
  - **Opción UI Web Táctica:** Dashboard militar en Next.js (`dashboard/`) con topología de red, matriz MITRE, cadena de custodia SHA-256 y botón táctico de acción.
- [x] **Task 3.2:** Flujo de ejecución en n8n: Al recibir la aprobación, un nodo Execute Command ejecuta la remediación local (`ufw insert 1 deny from {ip} to any`).
- [x] **Task 3.3:** Verificación de corte: El simulador reintenta y muestra en consola conexión bloqueada / rechazada (`python attack_simulator.py --verify-blocked`).

---

## Fase 4: La Presentación y Demo en Vivo
Un hackathon se gana en los 3 minutos de pitch.

### Rama 4
- [x] **Task 4.1:** Armar el "guion de demo" (`docs/PITCH_Y_GUION_DEMO.md`):
  - Terminal con simulador disparando el ataque.
  - Canvas de n8n procesando los datos y LLM estructurando la amenaza en tiempo real.
  - Alerta visual con la clasificación MITRE y el comando propuesto.
  - Clic en "Aprobar Mitigación" y demostración de que el ataque se interrumpió de inmediato.
- [x] **Task 4.2:** Diapositivas clave (`docs/PITCH_Y_GUION_DEMO.md`):
  - Problema (fatiga de alertas SOC: 50 alertas/h vs miles).
  - Solución (Agente correlacionador con contención y guardrails OWASP).
  - Arquitectura Soberana Air-Gapped (100% on-premise con Ollama).
  - ROI en tiempo de respuesta (de 45 minutos manuales a 15 segundos).