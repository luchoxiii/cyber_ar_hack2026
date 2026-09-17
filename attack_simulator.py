import argparse
import datetime
import json
import random
import time
import requests

# URL de tu webhook en n8n local (ajustar puerto o path según tu instancia)
DEFAULT_N8N_WEBHOOK = "http://localhost:5678/webhook-test/security-events"
TARGET_SERVER_IP = "192.168.1.50"


def generate_base_event(
    src_ip: str, dst_ip: str, port: int, proto: str, event_type: str, raw_msg: str
) -> dict:
    """Task 1.2: Esquema JSON estándar de telemetría de red / host."""
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "event_type": event_type,
        "network": {
            "source_ip": src_ip,
            "destination_ip": dst_ip,
            "destination_port": port,
            "protocol": proto.upper(),
        },
        "payload": {
            "raw_message": raw_msg,
            "user_agent": (
                "curl/8.4.0" if proto.lower() == "http" else "OpenSSH_8.9p1"
            ),
        },
    }


def send_to_n8n(events: list[dict], webhook_url: str):
    """Task 1.3: Envío por POST al endpoint de n8n."""
    print(f"\n[+] Enviando {len(events)} eventos a n8n: {webhook_url}...")
    try:
        response = requests.post(
            webhook_url,
            json={"batch_size": len(events), "events": events},
            headers={"Content-Type": "application/json"},
            timeout=5,
        )
        print(f"[✓] Respuesta n8n: HTTP {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[!] Error de conexión con n8n: {e}")


# ==========================================
# Task 1.1: Escenarios de Ataque
# ==========================================


def run_ssh_brute_force(webhook_url: str, count: int = 15):
    """Escenario A: Ráfaga de intentos fallidos contra puerto 22."""
    attacker_ip = "185.220.101.5"
    users = ["root", "admin", "ubuntu", "test", "postgres"]
    events = []

    print(
        f"[*] Generando Escenario A: SSH Brute Force desde {attacker_ip} ({count} intentos)..."
    )
    for _ in range(count):
        user = random.choice(users)
        msg = f"Failed password for invalid user {user} from {attacker_ip} port {random.randint(40000, 65000)} ssh2"
        ev = generate_base_event(
            src_ip=attacker_ip,
            dst_ip=TARGET_SERVER_IP,
            port=22,
            proto="TCP",
            event_type="AUTH_FAILURE",
            raw_msg=msg,
        )
        events.append(ev)
        time.sleep(0.05)

    send_to_n8n(events, webhook_url)


def run_port_scan(webhook_url: str):
    """Escenario B: Escaneo rápido horizontal de puertos comunes."""
    attacker_ip = "45.154.255.89"
    common_ports = [
        21,
        22,
        23,
        25,
        80,
        110,
        139,
        443,
        445,
        1433,
        3306,
        3389,
        5432,
        8080,
        8443,
    ]
    events = []

    print(
        f"[*] Generando Escenario B: Port Scan (SYN Stealth) desde {attacker_ip}..."
    )
    for port in common_ports:
        msg = f"Firewall DROP: IN=eth0 SRC={attacker_ip} DST={TARGET_SERVER_IP} PROTO=TCP SPT={random.randint(40000, 60000)} DPT={port} FLAGS=SYN"
        ev = generate_base_event(
            src_ip=attacker_ip,
            dst_ip=TARGET_SERVER_IP,
            port=port,
            proto="TCP",
            event_type="FIREWALL_DROP",
            raw_msg=msg,
        )
        events.append(ev)
        time.sleep(0.02)

    send_to_n8n(events, webhook_url)


def run_web_exploit(webhook_url: str):
    """Escenario C: Inyecciones HTTP y Path Traversal."""
    attacker_ip = "194.26.29.112"
    payloads = [
        ("GET /../../../../etc/passwd", "Path Traversal attempt on system files"),
        (
            "POST /api/login?user=admin'--",
            "SQL Injection detected in auth query",
        ),
        (
            "GET /cgi-bin/test.sh?cmd=cat%20/etc/shadow",
            "Command Injection vulnerability probe",
        ),
        (
            "GET /.env",
            "Sensitive environment configuration disclosure attempt",
        ),
        ("POST /upload.php?file=shell.php.jpg", "Malicious file upload attempt"),
    ]
    events = []

    print(
        f"[*] Generando Escenario C: Web Exploits / Directory Traversal desde {attacker_ip}..."
    )
    for uri, desc in payloads:
        msg = f'HTTP/1.1 403 Forbidden - Request: "{uri}" - Alert: {desc}'
        ev = generate_base_event(
            src_ip=attacker_ip,
            dst_ip=TARGET_SERVER_IP,
            port=80,
            proto="HTTP",
            event_type="WEB_ATTACK",
            raw_msg=msg,
        )
        events.append(ev)
        time.sleep(0.1)

    send_to_n8n(events, webhook_url)


# ==========================================
# CLI Runner
# ==========================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Simulador de ataques para pipeline SOC/n8n"
    )
    parser.add_argument(
        "--scenario",
        choices=["ssh", "scan", "web", "all"],
        default="ssh",
        help="Escenario de ataque a simular",
    )
    parser.add_argument(
        "--webhook",
        default=DEFAULT_N8N_WEBHOOK,
        help="URL del endpoint webhook de n8n",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=15,
        help="Cantidad de eventos (para escenario SSH)",
    )

    args = parser.parse_args()

    if args.scenario == "ssh":
        run_ssh_brute_force(args.webhook, args.count)
    elif args.scenario == "scan":
        run_port_scan(args.webhook)
    elif args.scenario == "web":
        run_web_exploit(args.webhook)
    elif args.scenario == "all":
        run_ssh_brute_force(args.webhook, 5)
        time.sleep(1)
        run_port_scan(args.webhook)
        time.sleep(1)
        run_web_exploit(args.webhook)