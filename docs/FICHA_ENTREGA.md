# 🇦🇷 FICHA OFICIAL DE ENTREGA — HACKATHON CYBER.AR 2026
**I Congreso de Ciberdefensa Argentina 2026 | Facultad de Ingeniería del Ejército (FIE) — UNDEF**  
*“La Ciberdefensa necesita de todos”*

---

## 1. Datos Generales del Proyecto

| Campo | Detalle |
|---|---|
| **Nombre del Proyecto** | **CyberSOAR-AR** |
| **Lema Operativo** | *"La IA propone y asiste; el operador de defensa decide y comanda."* |
| **Eje Temático Seleccionado** | **Eje 2:** Inteligencia artificial para la defensa de redes e infraestructura |
| **Línea Específica** | Asistente soberano para clasificación de alertas, correlación temporal y contención de incidentes |
| **Repositorio Oficial** | [https://github.com/luchoxiii/cyber_ar_hack2026](https://github.com/luchoxiii/cyber_ar_hack2026) |
| **Rama Principal de Evaluación** | `main` |
| **Licencia de Software** | Código Abierto / Permisiva ([`LICENSE`](../LICENSE)) |

---

## 2. Nómina del Equipo

| Integrante | Rol en el Proyecto | Responsabilidad Principal |
|---|---|---|
| **Ricardo Gabriel Díaz** | Fullstack / UI Engineering | Consola Táctica SOC Next.js, Topología de Red y Cadena de Custodia |
| **Dennis Ferraro** | Telemetría & Automatización | Simulador de Ataques Hostiles, Esquema JSON y Pipeline n8n |
| **Luciano** | Seguridad & Modelos LLM | Guardrails OWASP LLM, Threat Modeling STRIDE y Soberanía Tecnológica |
| **Marco Ungaro** | Pitcher & Estrategia de Defensa | Pitch y Defensa ante el Jurado (3 min), Oratoria y Relaciones Institucionales |

---

## 3. Resumen Ejecutivo (300 palabras)

Los Centros de Operaciones de Seguridad (SOC) militares y de infraestructura crítica nacional enfrentan una asimetría crítica: mientras un analista humano procesa en promedio 50 alertas por hora, una intrusión coordinada genera miles de eventos en segundos. La investigación y aplicación manual de reglas perimetrales insume entre **30 y 45 minutos**, lapso en el cual el adversario se desplaza lateralmente y consolida canales de Comando y Control (C2).

**CyberSOAR-AR** es una plataforma de orquestación, automatización y respuesta ante incidentes (SOAR) asistida por Inteligencia Artificial, concebida específicamente para operar en **enclaves air-gapped** sin conexión a Internet ni dependencia de proveedores de nube extranjeros.

El sistema ingiere telemetría en tiempo real, agrupa eventos en ventanas temporales de correlación, detecta técnicas hostiles mapeadas a la matriz **MITRE ATT&CK** (fuerza bruta SSH `T1110.001`, escaneo de puertos `T1046`, web exploits `T1190`) y genera propuestas exactas de mitigación perimetral. 

Para eliminar riesgos de ejecución autónoma ciega o vulnerabilidades de modelos de lenguaje, CyberSOAR-AR implementa **4 Guardrails Deterministas** alineados al estándar **OWASP Top 10 for LLM Applications 2025**:
1. Aislamiento semántico de prompt (`<raw_logs>`) contra Prompt Injection indirecto.
2. Salida forzada mediante esquema tipado estricto (JSON Schema).
3. Whitelist inmutable de infraestructura crítica (prevención de ataques de Auto-DoS contra gateways o DNS).
4. Ensamblado parametrizado de reglas de firewall sin ejecución de shell arbitrario.

El control final permanece siempre en el operador militar mediante una **Consola Táctica Next.js (Human-in-the-Loop)**, donde un solo clic autoriza la contención perimetral, reduciendo el tiempo de respuesta de **45 minutos a menos de 15 segundos (-99.4%)**, generando un acta de auditoría con hash criptográfico **SHA-256** para preservar la cadena de custodia pericial.

---

## 4. Diferenciales Clave para la Defensa Nacional

* **Soberanía Operativa Total:** Inferencia on-premise mediante modelos abiertos (Ollama / Llama 3.1 / Mistral). Cero telemetría enviada al exterior. Cero llamadas a APIs comerciales externas.
* **Human-in-the-Loop Obligatorio:** Cumplimiento de la doctrina de comando y control; la IA sintetiza y asiste, el oficial de guardia autoriza.
* **Resiliencia Matemática Anti-DoS:** Código determinista en Python que impide aislar componentes vitales del comando, incluso si el modelo es inducido a error.
* **Cadena de Custodia Criptográfica:** Trazabilidad inmutable de cada lote analizado y de cada mitigación aprobada mediante hashes SHA-256 aptos para peritajes judiciales o sumarios militares.

---

## 5. Matriz de Entregables del Hackathon

| Entregable | Documento de Respaldo | Componente de Software |
|---|---|---|
| **E1: Problema, usuarios y supuestos** | [`README.md`](../README.md#problema-y-pertinencia) | Definición de perfil de operador SOC y enclaves air-gapped |
| **E2: Prototipo funcional y código** | [`README.md`](../README.md#componentes-clave-integrados) | `dashboard/`, `attack_simulator.py`, `guardrails.py` |
| **E3: Arquitectura e instalación** | [`README.md`](../README.md#arquitectura-de-componentes) | Flujo n8n en `n8n/cyber_soar_workflow.json` |
| **E4: Modelo de amenazas** | [`docs/THREAT_MODEL.md`](THREAT_MODEL.md) | STRIDE, MITRE ATT&CK y OWASP Top 10 for LLM |
| **E5: Pruebas y evidencias** | [`docs/TESTS_Y_EVIDENCIAS.md`](TESTS_Y_EVIDENCIAS.md) | Tests unitarios, verificación de corte y `data/dataset_sintetico.json` |
| **E6: Soberanía, ética y accesibilidad** | [`docs/SOBERANIA_Y_ETICA.md`](SOBERANIA_Y_ETICA.md) | Protocolo air-gapped, WCAG 2.1 AA y declaración de IA |
| **E7: Pitch deck, demo y video** | [`docs/PITCH_Y_GUION_DEMO.md`](PITCH_Y_GUION_DEMO.md) | Diapositivas [`docs/slides.html`](slides.html), guion 180s y Video Demo Oficial en YouTube (60s) |

---

## 6. Verificación Rápida para el Jurado (60 Segundos)

```bash
# 1. Probar suite de guardrails deterministas OWASP (5 segundos)
python3 guardrails.py

# 2. Generar telemetría y verificar corte pericial de conexión
python3 attack_simulator.py --verify-blocked --ip 185.220.101.5

# 3. Lanzar Consola Táctica SOC
cd dashboard && npm run dev
# Acceso inmediato en navegador: http://localhost:3000
```

---

## 7. Estrategia de Adopción Real Post-Hackathon

1. **Integración Inmediata (Corto Plazo):** Conexión vía Syslog / Webhook con agentes SIEM existentes en las Fuerzas Armadas (Wazuh, Suricata, OSSEC).
2. **Especialización Soberana (Mediano Plazo):** Fine-tuning con datasets desclasificados del Comando Conjunto de Ciberdefensa (CCCD) para optimizar la jerga y perfiles de amenaza regionales.
3. **Escalamiento Estratégico (Largo Plazo):** Malla federada de nodos CyberSOAR-AR desplegados en organismos de infraestructura crítica nacional (red eléctrica, comunicaciones militares, puertos y transporte).

---
*Ficha técnica oficial entregada para la evaluación del I Congreso de Ciberdefensa Argentina 2026.*
