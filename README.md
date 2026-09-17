# cyber_ar_hack2026
Hackathon de CyberDefensa 2026 Arg

all Task 1

Cómo probarlo localmente
Instalar dependencias:

Bash
pip install requests
Ejecución básica (apuntando al webhook de prueba de n8n):

Bash
# Escenario A: SSH Brute Force
python attack_simulator.py --scenario ssh

# Escenario B: Escaneo de puertos
python attack_simulator.py --scenario scan

# Escenario C: Path Traversal / Web Exploits
python attack_simulator.py --scenario web

# Cambiar URL de webhook si n8n corre en otra IP o puerto:
python attack_simulator.py --scenario ssh --webhook http://localhost:5678/webhook-test/security-events