<![CDATA[# 🇦🇷 Soberanía Tecnológica y Ética — CyberSOAR-AR

> **Entregables 6 y 7** — Declaración de herramientas de terceros, componentes asistidos/generados por IA, y justificación de soberanía tecnológica.

---

## 1. Declaración de Soberanía Tecnológica

### 1.1 Principio Rector

CyberSOAR-AR está diseñado bajo el principio de **soberanía operativa total**: todo el pipeline de detección, análisis y respuesta puede ejecutarse dentro del perímetro de una red de defensa sin depender de servicios externos ni enviar telemetría fuera del enclave.

### 1.2 Arquitectura Air-Gapped

| Componente | Despliegue | Dependencia Externa | Estado Air-Gapped |
|---|---|---|---|
| `attack_simulator.py` | Local | Ninguna | ✅ 100% offline |
| n8n (orquestador) | Docker self-hosted | Ninguna (imágenes pre-descargadas) | ✅ 100% offline |
| LLM (modelo de lenguaje) | On-premise via Ollama | Ninguna (modelo descargado previamente) | ✅ 100% offline |
| Guardrails (Python) | Local | Ninguna (stdlib Python) | ✅ 100% offline |
| Consola SOC | Local (frontend estático) | Ninguna | ✅ 100% offline |

### 1.3 Garantías de No-Exfiltración

- **Sin llamadas a APIs externas:** El LLM se ejecuta localmente mediante [Ollama](https://ollama.ai/) con modelos como `llama3.1` o `mistral`. No se realizan llamadas a OpenAI, Anthropic, Google ni ningún otro proveedor de IA en la nube.
- **Sin telemetría:** Ningún componente del sistema envía métricas, logs, errores ni datos de uso a servidores externos.
- **Sin resolución DNS externa:** En configuración de producción, el sistema opera sin acceso a Internet.
- **Logs confinados:** Todos los registros de incidentes, decisiones del agente y acciones de guardrails se almacenan exclusivamente en el almacenamiento local del SOC.

### 1.4 Modelo de Despliegue para Enclaves de Defensa

```
┌─────────────────────────────────────────────────┐
│            RED AIR-GAPPED DE DEFENSA            │
│                                                 │
│  ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│  │ Simulador │   │  n8n     │   │  Ollama    │  │
│  │ Python   │──▶│  Docker  │──▶│  (LLM      │  │
│  │          │   │          │   │  Local)     │  │
│  └──────────┘   └──────────┘   └────────────┘  │
│                       │                         │
│                       ▼                         │
│              ┌─────────────────┐                │
│              │   Consola SOC   │                │
│              │   (Operador)    │                │
│              └─────────────────┘                │
│                                                 │
│         ══════════════════════════               │
│         ║  SIN SALIDA A INTERNET ║              │
│         ══════════════════════════               │
└─────────────────────────────────────────────────┘
```

---

## 2. Declaración de Herramientas de Terceros

### 2.1 Dependencias de Software

| Herramienta | Versión | Licencia | Uso en el Proyecto | Soberanía |
|---|---|---|---|---|
| **Python** | 3.11+ | PSF License | Lenguaje principal del simulador y guardrails | ✅ Open source |
| **requests** | 2.31+ | Apache 2.0 | Envío HTTP de eventos al webhook | ✅ Open source |
| **n8n** | Latest | Sustainable Use License | Orquestación del workflow de análisis | ✅ Self-hosted |
| **Ollama** | Latest | MIT | Ejecución local de modelos LLM | ✅ Open source, local |
| **Docker** | Latest | Apache 2.0 | Contenedorización de n8n y Ollama | ✅ Open source |
| **Git** | Latest | GPL v2 | Control de versiones | ✅ Open source |

### 2.2 Modelos de IA Utilizables

| Modelo | Proveedor | Licencia | Capacidad | Ejecutable Offline |
|---|---|---|---|---|
| Llama 3.1 8B | Meta | Llama 3.1 Community License | Análisis de texto, clasificación | ✅ Sí (via Ollama) |
| Mistral 7B | Mistral AI | Apache 2.0 | Alternativa ligera | ✅ Sí (via Ollama) |
| Qwen 2.5 7B | Alibaba | Apache 2.0 | Alternativa con buen soporte multi-idioma | ✅ Sí (via Ollama) |

> **Nota:** Durante el desarrollo del hackathon puede utilizarse la API de OpenAI para prototipado rápido. En producción y despliegue en enclaves de defensa, el modelo se ejecuta **exclusivamente on-premise** mediante Ollama.

### 2.3 Frameworks y Estándares de Referencia

| Recurso | Tipo | Uso |
|---|---|---|
| MITRE ATT&CK v14 | Framework de amenazas | Clasificación de técnicas detectadas |
| OWASP Top 10 for LLM (2025) | Guía de seguridad | Diseño de los 4 guardrails |
| STRIDE (Microsoft) | Modelo de amenazas | Análisis de riesgos del sistema |
| RFC 5737 | Estándar IETF | IPs de documentación para tests |

---

## 3. Declaración de Uso de Inteligencia Artificial

### 3.1 Componentes Asistidos por IA

En cumplimiento con los requisitos de transparencia del hackathon, se declara explícitamente qué componentes del proyecto fueron asistidos o generados con herramientas de IA:

| Componente | Asistencia IA | Herramienta | Nivel de Asistencia |
|---|---|---|---|
| `attack_simulator.py` | Sí | GitHub Copilot / Antigravity | Asistencia en estructura y boilerplate |
| Documentación (`docs/`) | Sí | Antigravity (Google) | Generación y refinamiento de contenido técnico |
| Guardrails (código Python) | Sí | GitHub Copilot / Antigravity | Asistencia en implementación |
| Diseño de arquitectura | No | — | Diseño manual del equipo |
| Selección de frameworks (MITRE, OWASP) | No | — | Decisión del equipo |
| System Prompt del agente | Parcial | — | Diseño manual + iteración con IA |

### 3.2 Justificación del Uso de IA en el Desarrollo

El uso de asistentes de IA en el desarrollo del proyecto está **alineado con el espíritu del hackathon** (Eje 2: Ciberdefensa e Inteligencia Artificial):

1. **La IA es la herramienta, no el producto completo.** Las decisiones de arquitectura, selección de frameworks y diseño de guardrails fueron tomadas por el equipo humano.
2. **Transparencia total.** Cada componente declara explícitamente si recibió asistencia de IA.
3. **Conocimiento demostrable.** El equipo puede explicar y defender cada decisión técnica independientemente de la herramienta utilizada para implementarla.

### 3.3 Uso de IA en Tiempo de Ejecución

El agente LLM dentro de CyberSOAR-AR se utiliza **exclusivamente** para:

- Analizar lotes de logs de seguridad.
- Clasificar incidentes según MITRE ATT&CK.
- Proponer acciones de mitigación en formato JSON estructurado.

El agente **NO** tiene capacidad de:

- Ejecutar comandos en el sistema operativo.
- Acceder a redes externas.
- Modificar su propio prompt o configuración.
- Tomar decisiones sin aprobación del operador humano.

---

## 4. Consideraciones Éticas

### 4.1 Uso Responsable del Simulador de Ataques

> ⚠️ **ADVERTENCIA:** El script `attack_simulator.py` genera tráfico de red que simula ataques reales. Su uso está estrictamente limitado a entornos de prueba y laboratorio.

**Restricciones de uso:**

- Solo ejecutar contra IPs de laboratorio (`192.168.1.50` por defecto).
- Solo apuntar a webhooks locales (`localhost:5678` por defecto).
- **Nunca** dirigir el simulador contra sistemas en producción o infraestructura de terceros.
- El uso indebido de esta herramienta puede constituir un delito informático según la legislación argentina (Ley 26.388).

### 4.2 Proporcionalidad en la Respuesta Automatizada

CyberSOAR-AR implementa el principio de **proporcionalidad**:

- Las acciones de baja severidad generan solo alertas informativas.
- Las acciones de media severidad requieren revisión del operador.
- Las acciones de alta/crítica severidad requieren **confirmación explícita** del operador antes de ejecutarse.
- **Ninguna acción es irreversible sin intervención humana.**

### 4.3 Privacidad y Protección de Datos

- El sistema no procesa datos personales de usuarios finales.
- Los logs analizados son sintéticos y no contienen información real.
- En un despliegue real, los logs deben anonimizarse antes de ser procesados por el LLM.
- El sistema cumple con el principio de minimización de datos: solo extrae entidades relevantes (IPs, puertos, técnicas) sin almacenar el log completo en texto plano.

### 4.4 No-Discriminación Algorítmica

El agente LLM analiza patrones de red objetivos (IPs, puertos, payloads) y no toma decisiones basadas en la identidad, ubicación geográfica o afiliación de los usuarios.

---

## 5. Licencias y Cumplimiento

| Aspecto | Estado |
|---|---|
| Todo el código fuente es open source o licencia permisiva | ✅ |
| Modelos LLM utilizables tienen licencia para uso comercial/gubernamental | ✅ |
| No se utilizan APIs propietarias con lock-in en producción | ✅ |
| El proyecto puede desplegarse sin conexión a Internet | ✅ |
| Se declaran todas las herramientas de terceros | ✅ |
| Se declara explícitamente el uso de IA generativa | ✅ |

---

*Documento generado para los Entregables 6 y 7 del Hackathon de CyberDefensa Argentina 2026.*
]]>
