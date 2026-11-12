#!/usr/bin/env python3
"""
JARVIS GABITA · Motor de Auditoría ACESS & Bot de Telegram
Versión: 2026-10-31 · Debian 12 / 13
"""

import os
import sys
import json
import time
import sqlite3
import argparse
import urllib.request
import urllib.parse
from datetime import datetime

# Rutas estándar recomendadas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, 'config.json')
SECRETS_FILE = os.path.join(BASE_DIR, 'secrets.json')
DB_FILE = os.path.join(BASE_DIR, 'jarvis_control.db')
EXPEDIENTES_DIR = os.path.join(BASE_DIR, 'expedientes')
LOG_FILE = os.path.join(BASE_DIR, 'jarvis.log')

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(line + "\n")
    except Exception:
        pass

def load_json(filepath):
    if not os.path.exists(filepath):
        return {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        log(f"Error leyendo {filepath}: {e}")
        return {}

def save_json(filepath, data, mode=0o600):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    try:
        os.chmod(filepath, mode)
    except Exception:
        pass

def get_config():
    cfg = load_json(CONFIG_FILE)
    if not cfg:
        cfg = {
            "modo": "ambos",
            "excel_file": "Matriz_Real.xlsx",
            "sheet_name": "Establecimientos",
            "generar_docx": True,
            "generar_png": True,
            "enviar_adjuntos": True,
            "dias_aviso_vigencia": 30,
            "telegram_enviar_imagen": True,
            "correo_activo": False
        }
        save_json(CONFIG_FILE, cfg)
    return cfg

def get_secrets():
    # Precedencia: Variables de entorno > secrets.json > config.json
    sec = load_json(SECRETS_FILE)
    token = os.environ.get('TELEGRAM_TOKEN', sec.get('telegram_token', ''))
    admin_chat = os.environ.get('ADMIN_CHAT_ID', sec.get('admin_chat_id', ''))
    return {
        "telegram_token": token,
        "admin_chat_id": str(admin_chat) if admin_chat else ''
    }

def init_db():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS establecimientos (
            id TEXT PRIMARY KEY,
            razon_social TEXT,
            ruc TEXT,
            unicodigo TEXT,
            perfil TEXT,
            tramite_ref TEXT,
            doc_docx INTEGER DEFAULT 1,
            doc_png INTEGER DEFAULT 1,
            entrega_telegram INTEGER DEFAULT 0,
            entrega_correo INTEGER DEFAULT 0,
            reenvio_pendiente INTEGER DEFAULT 0,
            estado_revision TEXT DEFAULT 'AL DÍA',
            color_estado TEXT DEFAULT 'verde',
            fecha_inspeccion TEXT,
            dias_restantes INTEGER,
            accion_requerida TEXT
        );
    """)
    conn.commit()

    # Seed demo data if table is empty
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM establecimientos;")
    if cur.fetchone()[0] == 0:
        demo = [
            ('est-01', 'Consultorio Odontológico Sonrisas', '1792451928001', '17D01-001234', 'Consultorio General', 'SPF-431540', 1, 1, 1, 0, 0, 'CRÍTICA', 'rojo', '14/11/2026', 11, 'Presentar planos actualizados y calibración de autoclave.'),
            ('est-02', 'Clínica Quirúrgica San Gabriel', '1791834920001', '17D05-008912', 'Hospital del Día', 'SPF-438921', 1, 1, 1, 1, 0, 'CRÍTICA', 'rojo', '18/11/2026', 15, 'Actualizar contrato de desechos biopeligrosos y póliza de responsabilidad civil.'),
            ('est-03', 'Farmacias Económicas del Norte', '0992384712001', '09D02-004521', 'Distribuidora Farmacéutica', 'SPF-432098', 1, 0, 1, 0, 1, 'PRÓXIMA', 'amarillo', '25/11/2026', 22, 'Registrar nuevo Químico Farmacéutico responsable y registro Senescyt.'),
            ('est-04', 'Centro Médico & Especialidades Los Andes', '1790023419001', '17D03-007722', 'Centro de Especialidades', 'SPF-439002', 1, 1, 1, 1, 0, 'PRÓXIMA', 'amarillo', '29/11/2026', 26, 'Completar reporte de dosis radiológica en equipo de Rayos X dental.'),
            ('est-05', 'Laboratorio Clínico Alfa Diagnóstico', '0190345612001', '01D01-003319', 'Laboratorio Clínico LAC-2', 'SPF-440112', 1, 1, 1, 0, 0, 'AL DÍA', 'verde', '15/12/2026', 42, 'Permiso vigente. Mantener bitácora de control de calidad interno.'),
            ('est-06', 'Policlínico Metropolitano del Valle', '1793098112001', '17D08-005610', 'Policlínico Ambulatorio', 'SPF-441203', 1, 1, 1, 1, 0, 'AL DÍA', 'verde', '20/12/2026', 47, 'Verificar fechas de vencimiento de medicamentos en botiquín de emergencia.'),
            ('est-07', 'Centro Pediátrico San Juan', '1890123849001', '18D01-002190', 'Consultorio Pediátrico', 'SPF-442890', 1, 1, 0, 0, 1, 'PRÓXIMA', 'amarillo', '02/12/2026', 29, 'Subir comprobante de pago de tasa de inspección ACESS.'),
            ('est-08', 'Óptica y Centro de Visión Integral', '1718293041001', '17D02-009844', 'Consultorio Optométrico', 'SPF-443109', 1, 1, 1, 1, 0, 'AL DÍA', 'verde', '10/01/2027', 68, 'Ninguna acción urgente. Permiso vigente hasta enero 2027.'),
            ('est-09', 'Hospital del Día Santa Elena', '2490018273001', '24D01-009012', 'Hospital del Día / Cirugía', 'SPF-437812', 0, 0, 0, 0, 1, 'CRÍTICA', 'rojo', '12/11/2026', 9, 'Falta generar expediente DOCX/PNG y renovar contrato con gestor de biopeligrosos.'),
            ('est-10', 'Farmacia San Blas Central', '1792901844001', '17D04-006733', 'Farmacia Comunitaria', 'SPF-444501', 1, 1, 1, 1, 0, 'AL DÍA', 'verde', '05/01/2027', 63, 'Revisión periódica de temperatura y humedad en área de almacenamiento.')
        ]
        cur.executemany("""
            INSERT INTO establecimientos VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, demo)
        conn.commit()
    conn.close()

def telegram_api_request(token, endpoint, data=None):
    url = f"https://api.telegram.org/bot{token}/{endpoint}"
    req = urllib.request.Request(url)
    if data:
        json_data = json.dumps(data).encode('utf-8')
        req.add_header('Content-Type', 'application/json')
        req.data = json_data
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        log(f"Error en Telegram API ({endpoint}): {e}")
        return {"ok": False, "description": str(e)}

def send_telegram_message(token, chat_id, text):
    return telegram_api_request(token, 'sendMessage', {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    })

def build_report(filter_type='todos'):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("SELECT id, razon_social, ruc, unicodigo, perfil, tramite_ref, doc_docx, doc_png, entrega_telegram, entrega_correo, reenvio_pendiente, estado_revision, color_estado, fecha_inspeccion, dias_restantes, accion_requerida FROM establecimientos")
    rows = cur.fetchall()
    conn.close()

    if filter_type == 'rojo':
        rows = [r for r in rows if r[12] == 'rojo']
    elif filter_type == 'amarillo':
        rows = [r for r in rows if r[12] == 'amarillo']
    elif filter_type == 'verde':
        rows = [r for r in rows if r[12] == 'verde']
    elif filter_type == 'pendientes':
        rows = [r for r in rows if r[10] == 1 or r[6] == 0 or r[7] == 0]

    header = f"JARVIS GABITA · usuarios y perfiles ({len(rows)})\n"
    if filter_type != 'todos':
        header += f"Filtro aplicado: {filter_type.upper()}\n"
    
    blocks = []
    for idx, r in enumerate(rows, 1):
        docx = "sí" if r[6] else "no"
        png = "sí" if r[7] else "no"
        tg = "sí" if r[8] else "no"
        mail = "sí" if r[9] else "no"
        reenv = " (reenvío pendiente)" if r[10] else ""
        
        b = f"{idx}. {r[1]}\n" \
            f"   Perfil: {r[4]} · Trámite: {r[5]}\n" \
            f"   Documentación: DOCX {docx} · PNG {png}\n" \
            f"   Entrega: Telegram {tg} · Correo {mail}{reenv}\n" \
            f"   Revisión: {r[11]} · Inspección {r[13]} · {r[14]} día(s)\n" \
            f"   Acción: {r[15]}"
        blocks.append(b)

    return header + "\n" + "\n\n".join(blocks)

def build_estado():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("SELECT color_estado, COUNT(*) FROM establecimientos GROUP BY color_estado")
    counts = dict(cur.fetchall())
    cur.execute("SELECT COUNT(*) FROM establecimientos WHERE reenvio_pendiente=1 OR doc_docx=0 OR doc_png=0")
    pend = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM establecimientos")
    total = cur.fetchone()[0]
    conn.close()

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"📊 *JARVIS GABITA · Estado Operativo*\n\n" \
           f"• *Última corrida:* {now}\n" \
           f"• *Establecimientos en matriz:* {total}\n" \
           f"• *Alertas críticas (Rojo):* {counts.get('rojo', 0)}\n" \
           f"• *Alertas próximas (Amarillo):* {counts.get('amarillo', 0)}\n" \
           f"• *Al día (Verde):* {counts.get('verde', 0)}\n" \
           f"• *Pendientes:* {pend}\n\n" \
           f"⏱ *Ciclos programados:* 08:00, 12:00, 16:00, 20:00\n" \
           f"🗄 *Base SQLite:* WAL OK · Modo sólo lectura"

def build_alertas():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("SELECT razon_social, perfil, tramite_ref, color_estado, dias_restantes, fecha_inspeccion, accion_requerida FROM establecimientos WHERE color_estado IN ('rojo', 'amarillo') ORDER BY dias_restantes ASC")
    rows = cur.fetchall()
    conn.close()

    if not rows:
        return "✅ *No hay alertas críticas ni próximas.* Todos los establecimientos están al día."

    header = f"⚠️ *JARVIS GABITA · Detalle de Alertas ({len(rows)})*\n\n"
    items = []
    for idx, r in enumerate(rows, 1):
        badge = "🔴 CRÍTICA" if r[3] == 'rojo' else "🟡 PRÓXIMA"
        items.append(
            f"*{idx}. {r[0]}*\n"
            f"   Perfil: {r[1]} · Trámite: `{r[2]}`\n"
            f"   Revisión: *{badge}* ({r[4]} días restantes)\n"
            f"   Fecha inspección: {r[5]}\n"
            f"   Acción: {r[6]}"
        )
    return header + "\n\n".join(items)

def run_telegram_daemon():
    init_db()
    sec = get_secrets()
    token = sec.get('telegram_token')
    admin_chat = sec.get('admin_chat_id')

    if not token:
        log("ERROR: telegram_token no está configurado en secrets.json ni variable de entorno.")
        sys.exit(1)

    me = telegram_api_request(token, 'getMe')
    if not me.get('ok'):
        log(f"ERROR: Token inválido: {me.get('description')}")
        sys.exit(1)

    bot_user = me['result']['username']
    log(f"Bot @{bot_user} iniciado. Escuchando mensajes de admin_chat_id: {admin_chat}...")

    offset = 0
    while True:
        try:
            updates = telegram_api_request(token, f"getUpdates?offset={offset}&timeout=20")
            if updates.get('ok') and updates.get('result'):
                for u in updates['result']:
                    offset = u['update_id'] + 1
                    msg = u.get('message')
                    if not msg or 'text' not in msg:
                        continue

                    chat_id = str(msg['chat']['id'])
                    text = msg['text'].strip()
                    lower = text.lower()

                    # Authorization check
                    if admin_chat and chat_id != admin_chat:
                        log(f"Mensaje rechazado de chat no autorizado: {chat_id}")
                        send_telegram_message(token, chat_id, "⛔ *Acceso denegado:* Chat no autorizado.")
                        continue

                    log(f"Comando recibido de {chat_id}: {text}")

                    if lower == '/start':
                        reply = "🤖 *JARVIS GABITA · Bot de Auditoría ACESS*\n\nSesión iniciada con éxito.\nEscriba `/estado`, `/alertas`, `/usuarios` o `/perfiles`."
                    elif lower == '/estado':
                        reply = build_estado()
                    elif lower == '/alertas':
                        reply = build_alertas()
                    elif lower.startswith('/usuarios') or lower.startswith('/perfiles'):
                        ft = 'todos'
                        if 'rojo' in lower: ft = 'rojo'
                        elif 'amarillo' in lower: ft = 'amarillo'
                        elif 'verde' in lower: ft = 'verde'
                        elif 'pendientes' in lower: ft = 'pendientes'
                        reply = build_report(ft)
                    else:
                        reply = "❓ Comando no reconocido.\nUse `/estado`, `/alertas`, `/usuarios` o `/perfiles`."

                    send_telegram_message(token, chat_id, reply)
        except Exception as e:
            log(f"Error en bucle de polling: {e}")
            time.sleep(3)

def run_telegram_setup_wizard():
    print("=== Asistente de Conexión Telegram JARVIS GABITA ===")
    token = input("Ingrese el token del bot de Telegram (@BotFather): ").strip()
    if not token:
        print("Token vacío.")
        sys.exit(1)

    me = telegram_api_request(token, 'getMe')
    if not me.get('ok'):
        print(f"Error verificando token: {me.get('description')}")
        sys.exit(1)

    print(f"Token válido: @{me['result']['username']} ({me['result']['first_name']})")
    print("\nAbra Telegram y envíe el comando /start a su bot ahora mismo...")
    print("Esperando mensaje /start...")

    admin_chat = None
    for _ in range(30):
        updates = telegram_api_request(token, "getUpdates?limit=5")
        if updates.get('ok') and updates.get('result'):
            for u in updates['result']:
                msg = u.get('message', {})
                if msg.get('text', '').startswith('/start'):
                    admin_chat = str(msg['chat']['id'])
                    break
        if admin_chat:
            break
        time.sleep(2)

    if not admin_chat:
        print("No se recibió /start en el tiempo esperado. Puede ingresar su Chat ID manualmente:")
        admin_chat = input("Chat ID: ").strip()

    sec = load_json(SECRETS_FILE)
    sec['telegram_token'] = token
    sec['admin_chat_id'] = admin_chat
    save_json(SECRETS_FILE, sec, mode=0o600)

    print(f"\n¡Éxito! Guardado en secrets.json con permisos 600.")
    print(f"admin_chat_id asignado: {admin_chat}")
    send_telegram_message(token, admin_chat, "🚀 *JARVIS GABITA:* Conexión verificada con éxito desde Debian.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Motor JARVIS GABITA")
    parser.add_argument('--telegram', action='store_true', help="Asistente de configuración Telegram")
    parser.add_argument('--bot', action='store_true', help="Ejecutar demonio del bot de Telegram")
    parser.add_argument('--usuarios', action='store_true', help="Imprimir reporte en consola")
    parser.add_argument('--cron', action='store_true', help="Ejecutar ciclo de motor programado")
    parser.add_argument('--config', type=str, help="Ruta al archivo config.json")
    args = parser.parse_args()

    init_db()

    if args.telegram:
        run_telegram_setup_wizard()
    elif args.bot:
        run_telegram_daemon()
    elif args.usuarios:
        print(build_report())
    elif args.cron:
        log("Ejecutando ciclo automático cron...")
        sec = get_secrets()
        if sec.get('telegram_token') and sec.get('admin_chat_id'):
            send_telegram_message(sec['telegram_token'], sec['admin_chat_id'], build_estado())
        log("Ciclo cron finalizado.")
    else:
        parser.print_help()
