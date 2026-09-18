import os
import glob
import subprocess
import time
from playwright.sync_api import sync_playwright

def main():
    print("[*] Iniciando grabación automatizada de demo con Playwright...")
    os.makedirs("docs", exist_ok=True)
    temp_dir = "docs/temp_record"
    os.makedirs(temp_dir, exist_ok=True)

    # Limpiar grabaciones previas en temp_dir
    for f in glob.glob(f"{temp_dir}/*"):
        try:
            os.remove(f)
        except Exception:
            pass

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

        print("[*] Navegando a http://localhost:3000...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        print("[+] Página cargada en estado STANDBY.")
        time.sleep(2.5)

        # 1. Seleccionar Escenario SSH si no está seleccionado
        try:
            page.select_option("select", "ssh_bruteforce")
            print("[+] Escenario seleccionado: SSH Brute Force.")
            time.sleep(1)
        except Exception as e:
            print(f"[!] Selector scenario: {e}")

        # 2. Iniciar Stream en Vivo
        print("[*] Disparando ingesta en vivo (STREAM EN VIVO)...")
        try:
            stream_btn = page.locator("button:has-text('STREAM EN VIVO')")
            if stream_btn.count() > 0:
                stream_btn.click()
            else:
                # Fallback botón RÁPIDO
                page.locator("button:has-text('RÁPIDO')").click()
        except Exception as e:
            print(f"[!] Error clic stream: {e}")

        # 3. Esperar que entren los eventos y aparezca la alerta roja DEFCON 2
        print("[*] Esperando correlación temporal y evaluación de guardrails...")
        time.sleep(4.5)

        # 4. Aprobación Human-in-the-Loop
        print("[*] Presionando [ APROBAR MITIGACIÓN AUTOMÁTICA ]...")
        try:
            approve_btn = page.locator("button:has-text('APROBAR MITIGACIÓN AUTOMÁTICA')")
            approve_btn.wait_for(state="visible", timeout=6000)
            approve_btn.click()
            print("[+] Mitigación autorizada por el operador militar.")
        except Exception as e:
            print(f"[!] Error clic mitigación: {e}")

        # 5. Esperar estado neutralizado (verde esmeralda)
        time.sleep(3.0)

        # 6. Mostrar Inspección Kernel Netfilter
        try:
            kernel_tab = page.locator("button:has-text('Inspección Kernel')")
            if kernel_tab.count() > 0:
                kernel_tab.click()
                print("[+] Pestaña Inspección Kernel activada.")
                time.sleep(2.5)
                # Volver a regla
                page.locator("button:has-text('Regla Sugerida SOAR')").click()
                time.sleep(1.0)
        except Exception as e:
            print(f"[!] Tab kernel: {e}")

        # 7. Abrir Acta Pericial Forense con Hash SHA-256
        print("[*] Abriendo Acta Pericial Forense...")
        try:
            acta_btn = page.locator("button:has-text('GENERAR ACTA PERICIAL DE CIBERDEFENSA')")
            acta_btn.wait_for(state="visible", timeout=5000)
            acta_btn.click()
            print("[+] Acta pericial desplegada en pantalla con Hash SHA-256.")
            time.sleep(4.0)

            # Cerrar modal
            close_btn = page.locator("div.fixed button:has(svg.lucide-x)")
            if close_btn.count() > 0:
                close_btn.click()
                print("[+] Modal cerrado.")
                time.sleep(1.5)
        except Exception as e:
            print(f"[!] Acta modal: {e}")

        # Cerrar contexto para guardar el video
        print("[*] Finalizando sesión y guardando archivo de video...")
        context.close()
        browser.close()

    # Buscar el archivo de video generado
    recorded_videos = glob.glob(f"{temp_dir}/*.webm")
    if not recorded_videos:
        print("[!] Error: No se encontró ningún archivo de video en temp_dir.")
        return

    raw_video = recorded_videos[0]
    output_mp4 = "docs/cyber_soar_demo.mp4"
    print(f"[+] Video grabado: {raw_video} ({os.path.getsize(raw_video)} bytes)")

    # Transcodificar a MP4 H.264 de alta calidad con ffmpeg
    print(f"[*] Transcodificando a MP4 con ffmpeg: {output_mp4}...")
    ffmpeg_cmd = [
        "/opt/homebrew/bin/ffmpeg",
        "-y",
        "-i", raw_video,
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        output_mp4
    ]
    res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if res.returncode == 0 and os.path.exists(output_mp4):
        size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
        print(f"\n{'='*60}")
        print(f"  [✓] ¡VIDEO DEMO GENERADO EXITOSAMENTE!")
        print(f"  Ubicación: {output_mp4}")
        print(f"  Tamaño:    {size_mb:.2f} MB")
        print(f"  Formato:   MP4 (H.264 / 1080p / 30fps)")
        print(f"{'='*60}\n")
    else:
        print(f"[!] Error en ffmpeg: {res.stderr}")

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
