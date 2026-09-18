# 🎯 Pitch Deck y Guion de Demostración en Vivo — CyberSOAR-AR

> **Hackathon de CyberDefensa Argentina 2026 — FIE / UNDEF**  
> **Eje 2:** Inteligencia Artificial para la Defensa de Redes e Infraestructura  
> **Presentación Oficial para el Jurado (Pitch y Demostración Operativa)**  
> **Pitcher / Orador:** Marco Ungaro  
> **Diapositivas Proyectables (100% Offline):** [`docs/slides.html`](slides.html)  
> **Guía de Estudio y Defensa Oral ante el Jurado:** [`docs/GUIA_DEFENSA.md`](GUIA_DEFENSA.md)  
> **Video Demo Oficial en YouTube:** [https://youtu.be/AmBrMdtl2VQ](https://youtu.be/AmBrMdtl2VQ)  
> **Duración total:** 3 minutos de presentación y demo + 1 minuto de preguntas del jurado.

---

## PARTE I: ESTRUCTURA DEL PITCH DECK (DIAPOSITIVAS)

### 📊 Diapositiva 1: Portada Institucional
* **Título:** CyberSOAR-AR: Orquestación, Detección e Inferencia con IA Soberana para la Ciberdefensa
* **Subtítulo:** Neutralización de intrusiones en segundos con guardrails deterministas y Human-in-the-Loop.
* **Contexto:** Hackathon CyberAr 2026 — Facultad de Ingeniería del Ejército (FIE) / UNDEF.
* **Lema:** *"La IA propone y asiste; el operador de defensa decide y comanda."*

---

### 📊 Diapositiva 2: El Problema — La Asimetría del Tiempo en el SOC
* **El desafío real:** Un analista militar de SOC procesa en promedio ~50 eventos por hora. Una ráfaga de ataque coordinado genera miles de eventos en segundos.
* **Fatiga de alertas:** El 70% del tiempo se consume en clasificar eventos dispersos y correlacionar manualmente IPs, puertos y técnicas.
* **Tiempo de respuesta (MTTR):** Un triaje manual con aislamiento toma entre **30 y 45 minutos**, permitiendo al atacante desplazarse lateralmente o establecer canales C2.

---

### 📊 Diapositiva 3: La Solución — CyberSOAR-AR
* **Concepto:** Agente SOAR impulsado por modelos abiertos que ingiere telemetría en tiempo real, aplica correlación temporal y clasifica amenazas contra la matriz **MITRE ATT&CK**.
* **Diferencial Clave (Human-in-the-Loop):** La IA no ejecuta acciones autónomas a ciegas. Genera la propuesta exacta de contención y el operador la aprueba con un solo clic en una consola táctica.
* **Reducción del MTTR:** De **45 minutos a menos de 15 segundos**.

---

### 📊 Diapositiva 4: Arquitectura Soberana y Despliegue Air-Gapped
* **100% On-Premise:** Diseñado para enclaves clasificados sin acceso a Internet.
* **Sin filtración de datos:** Modelo de lenguaje ejecutado localmente con **Ollama** (`llama3.1` / `mistral`).
* **Cero telemetría externa:** Todos los logs y hashes quedan confinados al perímetro de defensa.
* **Cadena de Custodia Forense:** Registro inmutable de cada lote analizado mediante hash **SHA-256**.

```
[Telemetría Host/Red] ──▶ [Buffer n8n] ──▶ [Ollama Local] ──▶ [Guardrails Python] ──▶ [Consola SOC + Operador]
```

---

### 📊 Diapositiva 5: Seguridad y Guardrails (Alineados a OWASP LLM 2025)
> *"No dejamos que la IA ejecute comandos libres: implementamos 4 barreras deterministas."*

1. **Aislamiento de Prompt (Anti-LLM01):** Logs delimitados en `<raw_logs>` tratados como datos hostiles para neutralizar Prompt Injections en campos de usuario o user-agents.
2. **Salida Estructurada Tipada (Anti-LLM02):** La IA solo devuelve JSON validado contra esquema estricto (acción, target_ip, confianza, mitre_id). Jamás emite sintaxis de terminal.
3. **Whitelist de Infraestructura Crítica (Anti-DoS):** Código determinista que intercepta e impide bloquear gateways (`192.168.1.1`), DNS o redes del comando (`10.0.0.0/8`).
4. **Comando Parametrizado (Anti-LLM08):** El backend ensambla la regla fija (`ufw insert 1 deny from {ip} to any`) sin invocar `shell=True`.

---

### 📊 Diapositiva 6: Demostración en Vivo (Coreografía de 3 Minutos)
* **Video Demo Oficial (YouTube):** [https://youtu.be/AmBrMdtl2VQ](https://youtu.be/AmBrMdtl2VQ)
* **Paso 1:** Simulación de ataque coordinado (Fuerza bruta SSH + Escaneo de puertos + Path Traversal).
* **Paso 2:** Ingesta y correlación temporal instantánea en el motor n8n.
* **Paso 3:** Alerta táctica en la Consola SOC con visualización de técnica MITRE (T1110 / T1046).
* **Paso 4:** Clic del operador militar en **[Aprobar Mitigación]**.
* **Paso 5:** Verificación en terminal: agresión cortada de inmediato y generación de acta pericial SHA-256.

---

### 📊 Diapositiva 7: Impacto Operativo y Continuidad Técnica
* **Tiempo de Contención:** Reducción del **99.4%** (de 45 minutos manuales a <15 segundos de ciclo total y 184 ms de latencia en kernel).
* **Precisión:** Cero falsos positivos en infraestructura vital gracias a la whitelist inmutable.
* **Auditabilidad Forense:** Toda acción aprobada genera un hash SHA-256 apto para peritaje judicial o sumario militar.
* **Continuidad e Integración Abierta:** Ingesta estándar vía Syslog/Webhook compatible con SIEM existentes (Wazuh, Suricata, OSSEC).
* **Costo e Independencia:** Cero dólares en licencias privativas o consumo de tokens en nubes extranjeras.

---

### 📊 Diapositiva 8: ¡Muchas Gracias! (Equipo y Preguntas del Jurado)
* **Lema Final:** *"La IA propone y asiste; el operador de defensa decide y comanda."*
* **Nómina Oficial del Equipo (Orden alfabético por apellido):**
  - **Ricardo Gabriel Díaz** (Consola Táctica SOC Next.js)
  - **Dennis Ferraro** (Telemetría Hostil & Pipeline n8n)
  - **Luciano Lisachi** (Seguridad & Modelos LLM)
  - **Marco Ungaro** (Pitcher & Estrategia de Defensa)
* **Repositorio Oficial:** `github.com/luchoxiii/cyber_ar_hack2026`
* **Transición:** El orador invita al jurado a la ronda de preguntas y respuestas (1 minuto).

---

## PARTE II: GUION DE DEMOSTRACIÓN EN VIVO (3 MINUTOS)

> **Regla de oro:** 3 minutos cronometrados exactos. Practicar con cronómetro en mano.

```
TIEMPO TOTAL: 180 SEGUNDOS (03:00)
DISTRIBUCIÓN:
  • 00:00 - 00:35 : Introducción y Problema
  • 00:35 - 01:15 : Inyección del Ataque y Correlación
  • 01:15 - 02:00 : Consola SOC Táctica y Análisis MITRE
  • 02:00 - 02:35 : Decisión Human-in-the-Loop y Mitigación
  • 02:35 - 03:00 : Verificación de Corte y Conclusión
```

---

### ⏱️ [00:00 - 00:35] Apertura y Declaración de Misión

* **Presentador (Voz firme, mirando al jurado):**
  > *"Señores miembros del jurado, autoridades de la Facultad de Ingeniería del Ejército y especialistas: en un ataque cibernético contra infraestructura de defensa, el factor crítico no es la detección, es el **tiempo de contención**.*  
  > *Un analista militar promedio revisa 50 alertas por hora; un ataque coordinado genera 5.000 eventos en 3 minutos. El tiempo manual promedio para investigar y aplicar una regla de firewall es de **45 minutos**. En ese lapso, el adversario ya vulneró el perímetro.*  
  > *Presentamos **CyberSOAR-AR**: un agente SOAR con inteligencia artificial soberana, diseñado para operar en redes **air-gapped**, sin conexión a Internet y con guardrails matemáticos que impiden cualquier daño colateral."*

---

### ⏱️ [00:35 - 01:15] Disparo del Ataque (Terminal)

* **Acción:** El operador cambia a la pantalla de la terminal dividida (o proyector).
* **Comando a ejecutar:**
  ```bash
  python attack_simulator.py --scenario ssh --count 15
  ```
* **Presentador:**
  > *"En este momento, nuestro simulador de telemetría hostil dispara una ráfaga de 15 intentos de fuerza bruta SSH contra el servidor crítico `192.168.1.50` desde la IP externa `185.220.101.5`.*  
  > *El motor de orquestación n8n acumula estos logs en una ventana temporal de correlación. Pero presten atención a un detalle defensivo: los logs se envuelven en etiquetas semánticas `<raw_logs>` bajo nuestro **Guardrail 1 de Aislamiento de Prompt** para que ninguna inyección en los campos de usuario pueda engañar al modelo."*

---

### ⏱️ [01:15 - 02:00] Consola SOC Táctica y Análisis MITRE

* **Acción:** Cambiar a la pestaña del navegador con el **Dashboard SOC** (`http://localhost:3000`).
* **Visual:** El dashboard muestra la alerta crítica parpadeando en rojo, la Topología de Red y la Matriz MITRE.
* **Presentador:**
  > *"Vemos en pantalla la **Consola Táctica del Operador**. En menos de 2 segundos, el agente LLM on-premise:*  
  > *1. Correlacionó los eventos y clasificó la amenaza bajo **MITRE ATT&CK T1110.001 (Brute Force)**.*  
  > *2. Asignó severidad **CRÍTICA** con un 95% de nivel de confianza.*  
  > *3. Reconstruyó la cadena cronológica en la línea de tiempo forense.*  
  > *Y lo más importante: **la IA no ejecuta comandos libres**. Nuestro **Guardrail 2** forzó una salida en JSON tipado, y el **Guardrail 3** verificó que la IP hostil no pertenezca a la whitelist de gateways o comando de la defensa."*

---

### ⏱️ [02:00 - 02:35] Human-in-the-Loop y Aprobación de Mitigación

* **Acción:** El presentador señala la Tarjeta de Contención Defensiva.
* **Visual:** Se muestra el comando exacto propuesto:
  `ufw insert 1 deny from 185.220.101.5 to any`
* **Presentador:**
  > *"Aquí reside el valor operativo: **Human-in-the-Loop**. La IA sintetizó la regla exacta de filtrado perimetral, pero el control final siempre permanece en manos del operador militar.*  
  > *El operador verifica la recomendación y procede a autorizar la respuesta defensiva..."*
* **Acción:** Clic en el botón táctico: **`[APROBAR MITIGACIÓN AUTOMÁTICA]`**.
* **Visual:** La interfaz transiciona inmediatamente: el panel cambia a verde esmeralda con el estado **"AMENAZA NEUTRALIZADA"**, emite confirmación sonora y despliega el **Acta Pericial Forense** con el **Hash SHA-256 inmutable**.

---

### ⏱️ [02:35 - 03:00] Verificación de Corte Inmediato y Cierre

* **Acción:** Volver a la terminal y ejecutar la verificación de corte:
  ```bash
  python attack_simulator.py --verify-blocked --ip 185.220.101.5
  ```
* **Salida en pantalla:**
  ```
  [*] Reintento 1/3: Conectando SSH 185.220.101.5 -> 192.168.1.50:22 ...
      [BLOCKED] CONEXIÓN RECHAZADA / CONNECTION REFUSED (Kernel Packet Drop)
  [✓] MITIGACIÓN VERIFICADA: El vector de ataque fue completamente neutralizado.
  ```
* **Presentador (Cierre con impacto):**
  > *"Como pueden observar en la terminal, el adversario intenta reconectarse y el kernel descarta sus paquetes de inmediato.*  
  > *Hemos llevado el tiempo de respuesta de **45 minutos a 15 segundos**, con un sistema 100% soberano, ejecutable en redes air-gapped, con código abierto y cadena de custodia forense inmutable.*  
  > *CyberSOAR-AR: ciberdefensa asistida por IA con mando y soberanía nacional. ¡Muchas gracias! El equipo queda a disposición del jurado para responder sus preguntas."*
* **Acción:** El presentador pasa a la **Diapositiva 8 (¡Muchas Gracias! y Nómina del Equipo)**, que queda proyectada en pantalla con el repositorio oficial durante el minuto de preguntas.

---

## PARTE III: PREGUNTAS Y RESPUESTAS PROBABLES DEL JURADO

### 1. Jurado Militar: "¿Qué pasa si un atacante falsifica la IP de nuestro propio router de comando para que el agente nos desconecte a nosotros mismos?"
* **Respuesta:**  
  > *"Excelente pregunta, general/coronel. Ese es precisamente el ataque de **Auto-DoS** que modelamos en nuestra matriz STRIDE. Implementamos el **Guardrail 3 (Whitelist de Infraestructura Crítica)**: un módulo en Python estrictamente determinista, sin IA, que intercepta cada IP propuesta. Si la IP pertenece al rango de gestión `10.0.0.0/24`, al gateway `192.168.1.1` o al DNS corporativo, la acción es abortada instantáneamente con una alerta de intento de auto-DoS."*

### 2. Jurado Técnico/IA: "¿Cómo previenen un ataque de Prompt Injection indirecto a través del payload de los logs?"
* **Respuesta:**  
  > *"Alineados con el estándar **OWASP Top 10 for LLM (LLM01 y LLM02)**, implementamos dos barreras:*  
  > *Primero, **Aislamiento de Prompt**: los logs crudos se encapsulan en etiquetas semánticas `<raw_logs>` y el System Prompt instruye al modelo a tratarlos exclusivamente como datos no confiables.*  
  > *Segundo, **Salida Estructurada Forzada**: el modelo no tiene la capacidad de emitir texto libre ni scripts bash; solo emite un JSON Schema predefinido con campos atómicos (`action`, `target_ip`, `mitre_id`). Si el JSON tiene campos adicionales o sintaxis inválida, el parser de guardrails lo descarta."*

### 3. Jurado de Soberanía: "¿La solución requiere conexión a internet o a las APIs de OpenAI / Anthropic?"
* **Respuesta:**  
  > *"En absoluto. El sistema fue diseñado bajo el principio de **Soberanía Operativa Total**. En despliegue de enclaves militares corre 100% desconectado (**air-gapped**): el orquestador n8n es un contenedor local y el modelo LLM corre sobre infraestructura propia mediante **Ollama** con pesos abiertos (Llama 3.1 8B o Mistral). Ningún byte ni dato forense sale de la red física de la unidad."*

---

## PARTE IV: PROTOCOLO DE CONTINGENCIA (PLAN B EN VIVO)

Si durante la presentación en la FIE/UNDEF surgieran fallas de conectividad, corte de proyector o demoras en el arranque de servicios:

1. **Si n8n no está levantado:** El dashboard de Next.js incluye un interruptor táctico **"Demo Mode"** (`NEXT_PUBLIC_DEMO_MODE=true`). Al pulsar **"Simular Incidente Crítico"**, la consola carga los datos forenses locales (`/public/mock_incident.json`) y permite completar el ciclo de aprobación y cálculo SHA-256 en menos de 10 segundos con total fluidez.
2. **Si no hay conexión física de red:** Toda la suite (`dashboard`, `guardrails.py`, `attack_simulator.py`) funciona en `localhost` sin requerir conexión WiFi ni dependencias externas.
3. **Comando de prueba rápida de guardrails (para mostrar en 5 segundos):**
   ```bash
   python guardrails.py
   ```
   Muestra en consola las 4 pruebas unitarias pasando con éxito ante el jurado.

