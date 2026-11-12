#!/usr/bin/env bash
# ==============================================================================
# JARVIS GABITA · Instalador de Unidad Systemd para el Bot de Telegram
# Versión: 2026-10-31 · Debian 12 / 13
# ==============================================================================

set -euo pipefail

DIR="/home/jarvis/jarvis-gabita"
USUARIO="jarvis"
SERVICIO="jarvis-bot"
UNIDAD="/etc/systemd/system/${SERVICIO}.service"
PRINT_ONLY=0
UNINSTALL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)
      DIR="$2"; shift 2 ;;
    --usuario)
      USUARIO="$2"; shift 2 ;;
    --print)
      PRINT_ONLY=1; shift ;;
    --uninstall)
      UNINSTALL=1; shift ;;
    *)
      echo "Parámetro no reconocido: $1"; exit 1 ;;
  esac
done

if [[ "$UNINSTALL" -eq 1 ]]; then
  echo "Desinstalando servicio ${SERVICIO}..."
  systemctl stop "${SERVICIO}" 2>/dev/null || true
  systemctl disable "${SERVICIO}" 2>/dev/null || true
  rm -f "${UNIDAD}"
  systemctl daemon-reload
  echo "Servicio ${SERVICIO} desinstalado."
  exit 0
fi

read -r -d '' UNIT_CONTENT <<EOF || true
[Unit]
Description=JARVIS GABITA · Bot de Telegram y Auditoría ACESS
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=${USUARIO}
Group=${USUARIO}
WorkingDirectory=${DIR}
ExecStart=${DIR}/venv/bin/python ${DIR}/jarvis_engine.py --bot --config ${DIR}/config.json
Restart=on-failure
RestartSec=5s
KillSignal=SIGINT
UMask=0077

# Límites de protección
StartLimitIntervalSec=120
StartLimitBurst=5

[Install]
WantedBy=multi-user.target
EOF

if [[ "$PRINT_ONLY" -eq 1 ]]; then
  echo "=== Vista previa de la unidad systemd ==="
  echo "${UNIT_CONTENT}"
  exit 0
fi

# Validar entorno
if [[ $EUID -ne 0 ]]; then
  echo "ERROR: Debe ejecutar este script con sudo o como root."
  exit 1
fi

echo "Instalando servicio en ${UNIDAD}..."
echo "${UNIT_CONTENT}" > "${UNIDAD}"
chmod 644 "${UNIDAD}"

systemctl daemon-reload
systemctl enable "${SERVICIO}"
systemctl restart "${SERVICIO}"

echo "¡Servicio ${SERVICIO} instalado y arrancado con éxito!"
systemctl status "${SERVICIO}" --no-pager
