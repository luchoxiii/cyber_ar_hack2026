# PROJECT BRIEF: CYBER-AR AUTO-SOAR DASHBOARD (TASK 3)

## 1. Hackathon Context & Winning Targets
- **Event & Track:** Hackathon CyberAr 2026 (FIE-UNDEF) - Eje 2: Inteligencia Artificial para la Defensa de Redes e Infraestructura.
- **Target Bounties / Sponsors:** Mejor Solución Defensiva / Mejor Prototipo Funcional.
- **The 10-Second Plain Pitch:** Ayudamos al operador de ciberdefensa a neutralizar ataques coordinados en segundos mediante un panel que reconstruye la intrusión y ejecuta la contención en un clic.
- **The Golden Path Goal:** Cargar incidente sintético, visualizar la correlación en la línea temporal MITRE ATT&CK y aprobar la mitigación UFW/iptables en menos de 15 segundos.

---

## 2. External Context Pointers & Tooling Setup
REGLA DE RELEVANCIA: Únicamente dependencias indispensables para la UI del operador y consumo de eventos.

### A. Ecosystem Skills, SDKs y Paquetes a Instalar (Vía Terminal)
- **Comando de instalación:**
  `npx create-next-app@latest dashboard --typescript --tailwind --eslint --app --src-dir --no-import-alias`
  `cd dashboard && npm install lucide-react clsx tailwind-merge`
- **Rol Funcional:** Next.js + Tailwind CSS para el frontend reactivo de respuesta inmediata; Lucide React para iconografía táctica de ciberseguridad.

### B. Referencias Técnicas Clave
- **Esquema de Incidentes:** Compatible con Elastic Common Schema (ECS) y taxonomía MITRE ATT&CK Enterprise.
- **Ambiente de Ejecución:** Frontend local independiente que corre en `http://localhost:3000`.

### C. Endpoints & Constantes de Configuración
- **API Backend Local (Task 2):** `http://localhost:8000/api/incident/latest`
- **Flag de Resiliencia (.env.local):**
  `NEXT_PUBLIC_DEMO_MODE=true`
- **Payload de Prueba Local (JSON):** `/public/mock_incident.json`

---

## 3. Delegation Map (Roles & Tools)
Antigravity debe coordinar los siguientes roles:

1. **Frontend UI Generation (Google Stitch MCP):**
   - Delegar a Google Stitch MCP la maquetación integral del dashboard táctico bajo el prompt visual de la Sección 5.
   - Configurar los estados de UI: `STANDBY`, `INCIDENT_DETECTED`, `MITIGATING`, `CONTAINED`.

2. **Integration Layer (Antigravity Agent):**
   - Implementar un Hook (`useIncidentStream`) que consuma el endpoint local o cargue `/public/mock_incident.json` si `NEXT_PUBLIC_DEMO_MODE=true`.
   - Conectar el botón de mitigación para despachar un `POST /api/mitigate` con la acción aprobada y mostrar el hash forense resultante.

3. **Resilience & Deploy (Antigravity):**
   - Garantizar que la interfaz sea 100% navegable sin conexión a internet externa (principio de soberanía de datos CyberAr).
   - Validar compilación limpia (`npm run build`).

---

## 4. Business Logic & Functional Rules (What to Build)
- **Entrada de Datos:** Objeto JSON con ID de incidente, severidad, técnicas MITRE (ID y nombre), lista de eventos cronológicos (origen, destino, timestamp) y acción sugerida.
- **Lógica de Ejecución:**
  1. Al presionar "Cargar Incidente Demo", se puebla la línea de tiempo cronológica con 3 fases: Escaneo previo, Intrusión SSH, Conexión anómala a C2.
  2. Desplegar la tarjeta de contención defensiva mostrando el comando exacto propuesto: `ufw insert 1 deny from 198.51.100.42 to any`.
  3. Al hacer clic en "[Aprobar Mitigación]", simular llamada de ejecución de red, cambiar estado visual a verde ("AMENAZA NEUTRALIZADA") y mostrar el hash SHA-256 de auditoría forense.
- **Invariantes Críticas:**
  - El botón de mitigación debe advertir si la IP afectada pertenece a una subred protegida (ej. red interna de comando `10.0.0.0/8`).
- **Mocks Autorizados:** Si el backend de la Rama 2 no responde en < 1 segundo, la interfaz hace fallback instantáneo a los datos precargados locales sin mostrar pantallas de error.

---

## 5. UI Design Prompt (For Google Stitch MCP)
Prompt visual para enviar a Google Stitch MCP:
- **Estética & Tema:** SOC Táctico / Cyberdefense Dark Mode. Fondo pizarra profundo (`bg-slate-950`), bordes sutiles (`border-slate-800`), acentos en rojo carmesí para incidentes activos (`text-red-500`, `bg-red-500/10`) y verde esmeralda para contención exitosa (`text-emerald-400`, `bg-emerald-500/10`).
- **Layout:** Dashboard de pantalla completa sin scroll vertical innecesario, dividido en 3 paneles:
  1. *Header Superior:* Indicador "CYBER.AR - DEFENSE CONSOLE", estado de soberanía "AIR-GAPPED / LOCAL-ONLY", interruptor táctico "Demo Mode" y botón principal "Simular Incidente Crítico".
  2. *Columna Izquierda (Timeline Forense):* Visualización vertical de eventos correlacionados con badges MITRE ATT&CK (ej. T1110.001 Brute Force, T1071 C2 Communication).
  3. *Columna Derecha (Acción de Respuesta):* Tarjeta de Contención con visualización estilo terminal de la regla propuesta (`ufw insert 1 deny...`), selector de destino y el botón central reactivo: `[APROBAR MITIGACIÓN AUTOMÁTICA]`.
  4. *Panel Inferior (Cadena de Custodia):* Registro de auditoría con timestamp y cálculo de Hash SHA-256 inmutable de la evidencia.

---

## 6. Definition of Done
- [ ] Dashboard compilando sin errores (`npm run build`).
- [ ] Interruptor "Demo Mode" operativo para alternar entre API local y mock determinista.
- [ ] Flujo interactivo completo ejecutable en < 15 segundos durante la presentación.
- [ ] Código alojado exclusivamente en el directorio `/dashboard` dentro de la rama `rama-3-all-task-3`.
