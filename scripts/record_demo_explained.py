import os
import glob
import subprocess
import time
from playwright.sync_api import sync_playwright

def main():
    print("=" * 60)
    print("  CYBERSOAR-AR — Grabación Automatizada de Demo Explicada (1 min)")
    print("=" * 60)

    os.makedirs("docs", exist_ok=True)
    temp_dir = "docs/temp_record_explained"
    os.makedirs(temp_dir, exist_ok=True)

    # Limpiar grabaciones previas en temp_dir
    for f in glob.glob(f"{temp_dir}/*"):
        try:
            os.remove(f)
        except Exception:
            pass

    start_time = time.time()

    with sync_playwright() as p:
        print("[*] Lanzando Chromium en resolución Full HD (1920x1080)...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=temp_dir,
            record_video_size={"width": 1920, "height": 1080},
            color_scheme="dark",
            device_scale_factor=1
        )
        page = context.new_page()

        print("[*] Navegando a http://localhost:3000/demo-studio...")
        page.goto("http://localhost:3000/demo-studio", wait_until="networkidle")
        print("[+] Página Demo Studio cargada con éxito.")

        # Obtener locator del iframe que contiene el dashboard
        frame = page.frame_locator("#dashboard-frame")

        # =======================================================
        # FASE 1: VIGILANCIA EN REPOSO (0s -> 10s)
        # =======================================================
        print("\n--- FASE 1 [00:00 - 00:10]: Vigilancia en Reposo (DEFCON 4) ---")
        time.sleep(3.0)
        try:
            frame.locator("select").select_option("ssh_bruteforce")
            print("[+] Escenario seleccionado en iframe: SSH Brute Force.")
        except Exception as e:
            print(f"[!] Selector scenario: {e}")

        # Esperar hasta t=10s
        elapsed = time.time() - start_time
        if elapsed < 10.0:
            time.sleep(10.0 - elapsed)

        # =======================================================
        # FASE 2: INGESTA Y AGRESIÓN HOSTIL (10s -> 22s)
        # =======================================================
        print("\n--- FASE 2 [00:10 - 00:22]: Ingesta y Ráfaga Hostil SSH ---")
        try:
            stream_btn = frame.locator("button:has-text('STREAM EN VIVO')")
            if stream_btn.count() > 0:
                stream_btn.click()
                print("[+] Botón STREAM EN VIVO presionado.")
            else:
                frame.locator("button:has-text('RÁPIDO')").click()
                print("[+] Botón RÁPIDO presionado.")
        except Exception as e:
            print(f"[!] Error clic stream: {e}")

        # Esperar hasta t=22s
        elapsed = time.time() - start_time
        if elapsed < 22.0:
            time.sleep(22.0 - elapsed)

        # =======================================================
        # FASE 3: INFERENCIA MITRE & GUARDRAILS (22s -> 36s)
        # =======================================================
        print("\n--- FASE 3 [00:22 - 00:36]: Inferencia MITRE T1110.001 y Guardrails ---")
        print("[*] Visualizando alerta roja DEFCON 2 y validación anti-Auto-DoS...")

        # Esperar hasta t=36s
        elapsed = time.time() - start_time
        if elapsed < 36.0:
            time.sleep(36.0 - elapsed)

        # =======================================================
        # FASE 4: MANDO MILITAR HUMAN-IN-THE-LOOP (36s -> 48s)
        # =======================================================
        print("\n--- FASE 4 [00:36 - 00:48]: Mando Human-in-the-Loop & Corte Kernel ---")
        try:
            approve_btn = frame.locator("button:has-text('APROBAR MITIGACIÓN AUTOMÁTICA')")
            approve_btn.wait_for(state="visible", timeout=5000)
            approve_btn.click()
            print("[+] Mitigación autorizada por el operador humano (Human-in-the-Loop).")
        except Exception as e:
            print(f"[!] Error clic mitigación: {e}")

        time.sleep(4.0)
        try:
            kernel_tab = frame.locator("button:has-text('Inspección Kernel')")
            if kernel_tab.count() > 0:
                kernel_tab.click()
                print("[+] Pestaña Inspección Kernel activada.")
                time.sleep(2.5)
                frame.locator("button:has-text('Regla Sugerida SOAR')").click()
        except Exception as e:
            print(f"[!] Tab kernel: {e}")

        # Esperar hasta t=48s
        elapsed = time.time() - start_time
        if elapsed < 48.0:
            time.sleep(48.0 - elapsed)

        # =======================================================
        # FASE 5: CADENA DE CUSTODIA Y VERIFICACIÓN (48s -> 60s)
        # =======================================================
        print("\n--- FASE 5 [00:48 - 01:00]: Cadena de Custodia & Acta SHA-256 ---")
        try:
            acta_btn = frame.locator("button:has-text('GENERAR ACTA PERICIAL DE CIBERDEFENSA')")
            acta_btn.wait_for(state="visible", timeout=5000)
            acta_btn.click()
            print("[+] Acta pericial oficial desplegada con Hash SHA-256.")
        except Exception as e:
            print(f"[!] Error acta modal: {e}")

        # Esperar visualización del acta hasta t=57s
        elapsed = time.time() - start_time
        if elapsed < 57.0:
            time.sleep(57.0 - elapsed)

        try:
            close_btn = frame.locator("div.fixed button:has(svg.lucide-x)")
            if close_btn.count() > 0:
                close_btn.click()
                print("[+] Modal forense cerrado.")
        except Exception as e:
            print(f"[!] Error cerrar modal: {e}")

        # Esperar hasta completar 60s
        elapsed = time.time() - start_time
        if elapsed < 61.0:
            time.sleep(61.0 - elapsed)

        print("[*] Cerrando contexto y guardando archivo de video...")
        context.close()
        browser.close()

    total_elapsed = time.time() - start_time
    print(f"[+] Tiempo total de grabación: {total_elapsed:.1f} segundos.")

    recorded_videos = glob.glob(f"{temp_dir}/*.webm")
    if not recorded_videos:
        print("[!] Error: No se encontró video generado.")
        return

    raw_video = recorded_videos[0]
    output_mp4 = "docs/cyber_soar_demo_explicado.mp4"
    print(f"[+] Video fuente: {raw_video} ({os.path.getsize(raw_video)} bytes)")

    # Transcodificar a MP4 H.264
    print(f"[*] Transcodificando con ffmpeg a {output_mp4}...")
    ffmpeg_cmd = [
        "/opt/homebrew/bin/ffmpeg",
        "-y",
        "-i", raw_video,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        output_mp4
    ]
    res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(output_mp4):
        size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
        print(f"\n{'='*60}")
        print(f"  [✓] ¡VIDEO DEMO EXPLICADO GENERADO EXITOSAMENTE!")
        print(f"  Ubicación: {output_mp4}")
        print(f"  Tamaño:    {size_mb:.2f} MB")
        print(f"  Duración:  ~60 segundos (1 minuto)")
        print(f"  Formato:   MP4 (H.264 / 1080p / 30fps)")
        print(f"{'='*60}\n")
    else:
        print(f"[!] Error ffmpeg: {res.stderr}")

    # Limpiar temp_dir
    for f in glob.glob(f"{temp_dir}/*"):
        try:
            os.remove(f)
        except Exception:
            pass
    try:
        os.rmdir(temp_dir)
    except Exception:
        pass

if __name__ == "__main__":
    main()
