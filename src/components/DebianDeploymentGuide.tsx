import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  CheckSquare, 
  Square, 
  FileText, 
  Download, 
  ShieldCheck, 
  AlertTriangle,
  FolderLock,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { JarvisConfig } from '../types/jarvis';
import { DEFAULT_CONFIG } from '../data/initialData';

export const DebianDeploymentGuide: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pasos' | 'config' | 'troubleshoot' | 'notion'>('pasos');

  // Config editor state
  const [config, setConfig] = useState<JarvisConfig>(DEFAULT_CONFIG);
  const [secrets, setSecrets] = useState({
    telegram_token: '123456789:AAHq_m7Xk9_ExampleTokenBot',
    admin_chat_id: '584920194',
    gmail_user: 'auditoria.acess@gmail.com',
    gmail_app_password: 'xxxx-xxxx-xxxx-xxxx',
    servidor_token: 'sec_auth_token_8921_custom'
  });

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadNotionMarkdown = () => {
    const markdownContent = `# JARVIS GABITA · puesta en marcha en Debian

> Página lista para importar en Notion: **Import > Markdown**.
> Versión: 2026-10-31 · Tiempo estimado: **12 a 18 minutos** en un Debian limpio.
> Resultado: bot de Telegram con /estado, /alertas y /usuarios, ciclos automáticos 4 veces al día, documentos DOCX/PNG y secretos con permisos 600.

---

## 1. Resultado esperado
Al terminar debe poder escribirle al bot:
- /estado -> última corrida, alertas y pendientes.
- /alertas -> detalle de rojos y amarillos.
- /usuarios -> por cada establecimiento/perfil: documentación DOCX/PNG, entrega por Telegram/correo y revisión.
- /usuarios rojo|amarillo|verde|pendientes -> filtros del reporte.
- /perfiles -> alias de /usuarios.

Además:
- jarvis-bot.service queda activo y se reinicia si falla.
- El cron ejecuta el ciclo a las 08:00, 12:00, 16:00 y 20:00.
- Los expedientes quedan en expedientes/.
- config.json, secrets.json y la base quedan sólo para el usuario jarvis (permisos 600).

---

## 2. Mapa de ubicaciones y usuarios

| Elemento | Ruta / valor | Permisos |
|---|---|---|
| Proyecto | /home/jarvis/jarvis-gabita | 700 jarvis:jarvis |
| Configuración | /home/jarvis/jarvis-gabita/config.json | 600 jarvis:jarvis |
| Secretos | /home/jarvis/jarvis-gabita/secrets.json | 600 jarvis:jarvis |
| Base SQLite | /home/jarvis/jarvis-gabita/jarvis_control.db | 600 jarvis:jarvis |
| Expedientes | /home/jarvis/jarvis-gabita/expedientes/ | 700 jarvis:jarvis |
| Log del motor | /home/jarvis/jarvis-gabita/jarvis.log | 600 jarvis:jarvis |
| Unidad systemd | /etc/systemd/system/jarvis-bot.service | 644 root:root |
| Cron | crontab del usuario jarvis | sólo jarvis/root |

---

## 3. Comandos de Puesta en Marcha

### Paso 1: Preparar Debian
\`\`\`bash
sudo apt update
sudo apt -y upgrade
sudo apt install -y python3 python3-venv python3-pip sqlite3 curl cron ufw
sudo timedatectl set-timezone America/Guayaquil
sudo ufw allow OpenSSH
sudo ufw enable
\`\`\`

### Paso 2: Crear el usuario de servicio
\`\`\`bash
sudo adduser --disabled-password --gecos "" jarvis
sudo passwd jarvis
sudo usermod -aG sudo jarvis
sudo install -d -o jarvis -g jarvis -m 700 /home/jarvis/jarvis-gabita
\`\`\`

### Paso 3: Copiar el proyecto e instalar
\`\`\`bash
sudo cp -a /ruta/al/paquete/. /home/jarvis/jarvis-gabita/
sudo chown -R jarvis:jarvis /home/jarvis/jarvis-gabita
sudo -iu jarvis
cd ~/jarvis-gabita
./install.sh
exit
\`\`\`

### Paso 4: Conectar Bot de Telegram
\`\`\`bash
sudo -u jarvis /home/jarvis/jarvis-gabita/venv/bin/python \\
  /home/jarvis/jarvis-gabita/jarvis_engine.py --telegram \\
  --config /home/jarvis/jarvis-gabita/config.json
\`\`\`

### Paso 5: Instalar servicio systemd
\`\`\`bash
sudo /home/jarvis/jarvis-gabita/instalar_servicio_bot.sh \\
  --dir /home/jarvis/jarvis-gabita \\
  --usuario jarvis
\`\`\`

### Paso 6: Cron de ciclos (08:00, 12:00, 16:00, 20:00)
\`\`\`cron
0 8,12,16,20 * * * cd /home/jarvis/jarvis-gabita && /home/jarvis/jarvis-gabita/venv/bin/python jarvis_engine.py --cron >> /home/jarvis/jarvis-gabita/ejecucion.log 2>&1
\`\`\`

### Paso 7: Cierre de seguridad
\`\`\`bash
sudo chown -R jarvis:jarvis /home/jarvis/jarvis-gabita
sudo chmod 700 /home/jarvis/jarvis-gabita
sudo chmod 600 /home/jarvis/jarvis-gabita/config.json
sudo chmod 600 /home/jarvis/jarvis-gabita/secrets.json
sudo chmod 600 /home/jarvis/jarvis-gabita/jarvis_control.db
sudo deluser jarvis sudo
sudo usermod -s /usr/sbin/nologin jarvis
\`\`\`
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DESPLIEGUE_DEBIAN_NOTION.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stepsList = [
    {
      num: 1,
      title: 'Paso 1 · Preparar Debian (Paquetes & Firewall)',
      desc: 'Actualización del sistema, dependencias Python/SQLite y zona horaria Guayaquil.',
      cmd: `sudo apt update\nsudo apt -y upgrade\nsudo apt install -y python3 python3-venv python3-pip sqlite3 curl cron ufw\nsudo timedatectl set-timezone America/Guayaquil\nsudo ufw allow OpenSSH\nsudo ufw enable\nsudo ufw status`
    },
    {
      num: 2,
      title: 'Paso 2 · Crear el usuario de servicio jarvis',
      desc: 'Usuario aislado con permisos 700 en su home y sudo temporal para el instalador.',
      cmd: `sudo adduser --disabled-password --gecos "" jarvis\nsudo passwd jarvis\nsudo usermod -aG sudo jarvis\nsudo install -d -o jarvis -g jarvis -m 700 /home/jarvis/jarvis-gabita`
    },
    {
      num: 3,
      title: 'Paso 3 · Copiar el proyecto e instalar (install.sh)',
      desc: 'Despliegue del código, venv, swap de memoria y corrida de prueba.',
      cmd: `sudo cp -a /ruta/al/paquete/. /home/jarvis/jarvis-gabita/\nsudo rm -rf /home/jarvis/jarvis-gabita/.venv /home/jarvis/jarvis-gabita/venv\nsudo chown -R jarvis:jarvis /home/jarvis/jarvis-gabita\n\nsudo -iu jarvis\ncd ~/jarvis-gabita\n./install.sh\nexit`
    },
    {
      num: 4,
      title: 'Paso 4 · Revisar la configuración (config.json)',
      desc: 'Ajuste de modo (ambos), nombre de matriz .xlsx, generación de DOCX/PNG y días de aviso.',
      cmd: `sudo -u jarvis nano /home/jarvis/jarvis-gabita/config.json`
    },
    {
      num: 5,
      title: 'Paso 5 · Conectar el bot de Telegram (--telegram)',
      desc: 'Asistente interactivo que descubre el chat_id con /start y guarda secrets.json en 600.',
      cmd: `sudo systemctl stop jarvis-bot 2>/dev/null || true\nsudo -u jarvis /home/jarvis/jarvis-gabita/venv/bin/python \\\n  /home/jarvis/jarvis-gabita/jarvis_engine.py --telegram \\\n  --config /home/jarvis/jarvis-gabita/config.json`
    },
    {
      num: 6,
      title: 'Paso 6 · Verificar el reporte por usuario/perfil (--usuarios)',
      desc: 'Comprobación en consola del estado de expedientes y revisiones.',
      cmd: `sudo -u jarvis /home/jarvis/jarvis-gabita/venv/bin/python \\\n  /home/jarvis/jarvis-gabita/jarvis_engine.py --usuarios \\\n  --config /home/jarvis/jarvis-gabita/config.json`
    },
    {
      num: 7,
      title: 'Paso 7 · Instalar el servicio systemd (jarvis-bot.service)',
      desc: 'Habilitación de systemd con reinicio automático en caso de falla y umask 0077.',
      cmd: `sudo /home/jarvis/jarvis-gabita/instalar_servicio_bot.sh \\\n  --dir /home/jarvis/jarvis-gabita \\\n  --usuario jarvis\n\nsystemctl status jarvis-bot --no-pager`
    },
    {
      num: 8,
      title: 'Paso 8 · Cron de ciclos (08:00, 12:00, 16:00, 20:00)',
      desc: 'Programación de las 4 evaluaciones automáticas diarias en crontab de jarvis.',
      cmd: `sudo crontab -u jarvis -l\n# Si falta, añadir:\n# 0 8,12,16,20 * * * cd /home/jarvis/jarvis-gabita && /home/jarvis/jarvis-gabita/venv/bin/python jarvis_engine.py --cron >> /home/jarvis/jarvis-gabita/ejecucion.log 2>&1`
    },
    {
      num: 9,
      title: 'Paso 9 · Seguridad y permisos (quitar sudo y nologin)',
      desc: 'Blindaje del servidor: permisos 600 en secrets y retiro de shell interactivo al usuario jarvis.',
      cmd: `sudo chown -R jarvis:jarvis /home/jarvis/jarvis-gabita\nsudo chmod 700 /home/jarvis/jarvis-gabita\nsudo chmod 600 /home/jarvis/jarvis-gabita/config.json\nsudo chmod 600 /home/jarvis/jarvis-gabita/secrets.json\nsudo chmod 600 /home/jarvis/jarvis-gabita/jarvis_control.db\n\nsudo deluser jarvis sudo\nsudo usermod -s /usr/sbin/nologin jarvis`
    },
    {
      num: 10,
      title: 'Paso 10 · Respaldo y actualización periódica',
      desc: 'Snapshot en caliente de SQLite con .backup y compresión de expedientes.',
      cmd: `sudo install -d -m 700 /root/backups\nsudo sqlite3 /home/jarvis/jarvis-gabita/jarvis_control.db \\\n  ".backup '/root/backups/jarvis-$(date +%F).db'"\nsudo tar -czf /root/backups/jarvis-$(date +%F).tgz \\\n  -C /home/jarvis/jarvis-gabita config.json secrets.json expedientes\nsudo chmod 600 /root/backups/jarvis-*`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-1">
            <span>Servidor Debian 12 / 13</span>
            <span aria-hidden="true">·</span>
            <span>Tiempo: 12 - 18 minutos</span>
            <span aria-hidden="true">·</span>
            <span>Listo para Notion</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Puesta en Marcha en Servidor Debian
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Guía paso a paso para desplegar el motor JARVIS, bot de Telegram, servicio systemd y crontab seguro.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadNotionMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar DESPLIEGUE_DEBIAN_NOTION.md</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('pasos')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'pasos' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Checklist de 10 Pasos ({Object.values(completedSteps).filter(Boolean).length}/10)
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'config' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Generador config.json & secrets.json
        </button>
        <button
          onClick={() => setActiveTab('troubleshoot')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'troubleshoot' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Resolución de Incidencias
        </button>
      </div>

      {/* Checklist View */}
      {activeTab === 'pasos' && (
        <div className="space-y-4">
          {/* Ubicaciones Quick Reference */}
          <div className="p-4 rounded-lg bg-[#1E293B]/60 border border-slate-800 text-xs">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-sky-400" />
              <span>Mapa de Ubicaciones y Permisos Clave</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-slate-300 font-mono text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Proyecto:</span>
                /home/jarvis/jarvis-gabita <span className="text-sky-400">(700)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Secretos & Config:</span>
                secrets.json / config.json <span className="text-amber-400">(600)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block">Servicio Systemd:</span>
                jarvis-bot.service <span className="text-emerald-400">(644)</span>
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {stepsList.map((step) => {
              const isDone = !!completedSteps[step.num];
              return (
                <div
                  key={step.num}
                  className={`p-4 rounded-lg border transition-all ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                      : 'bg-[#1E293B]/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleStep(step.num)}
                        className="text-slate-400 hover:text-sky-400 transition-colors"
                      >
                        {isDone ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <div>
                        <h3 className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-400">{step.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => copyText(step.cmd, `step-${step.num}`)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
                    >
                      {copiedIndex === `step-${step.num}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-3 rounded bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                    {step.cmd}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Config Editor View */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* config.json */}
          <div className="p-5 rounded-lg bg-[#1E293B]/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                1. /home/jarvis/jarvis-gabita/config.json
              </h3>
              <button
                onClick={() => copyText(JSON.stringify(config, null, 2), 'cfg')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                {copiedIndex === 'cfg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar config.json</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Permisos: <code className="text-sky-300 font-mono">600 jarvis:jarvis</code>. Define modo de corrida y expedientes.
            </p>

            <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-[360px]">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>

          {/* secrets.json */}
          <div className="p-5 rounded-lg bg-[#1E293B]/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                2. /home/jarvis/jarvis-gabita/secrets.json
              </h3>
              <button
                onClick={() => copyText(JSON.stringify(secrets, null, 2), 'sec')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                {copiedIndex === 'sec' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar secrets.json</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Permisos: <code className="text-amber-300 font-mono">600 jarvis:jarvis</code>. Contiene token del bot y chat_id autorizado.
            </p>

            <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto max-h-[360px]">
              {JSON.stringify(secrets, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Troubleshooting Matrix */}
      {activeTab === 'troubleshoot' && (
        <div className="p-5 rounded-lg bg-[#1E293B]/70 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">
            Matriz de Resolución de Incidencias Frecuentes
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <th className="py-2.5 px-3">Síntoma</th>
                  <th className="py-2.5 px-3">Causa probable</th>
                  <th className="py-2.5 px-3">Solución</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-mono text-red-300">jarvis-bot en failed</td>
                  <td className="py-2.5 px-3">Token o admin_chat_id no configurados en secrets.json</td>
                  <td className="py-2.5 px-3">Ejecute <code className="text-sky-300 font-mono">--telegram</code> y revise <code className="text-sky-300 font-mono">journalctl -u jarvis-bot</code></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-amber-300">409 Conflict</td>
                  <td className="py-2.5 px-3">Otro proceso viejo está usando getUpdates</td>
                  <td className="py-2.5 px-3">Detenga el servicio con <code className="text-sky-300 font-mono">sudo systemctl stop jarvis-bot</code> antes de reconfigurar</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-red-300">401 Unauthorized</td>
                  <td className="py-2.5 px-3">Token del bot revocado en @BotFather o mal copiado</td>
                  <td className="py-2.5 px-3">Genere un nuevo token en BotFather y repita el asistente <code className="text-sky-300 font-mono">--telegram</code></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-amber-300">Permission denied en base/log</td>
                  <td className="py-2.5 px-3">Archivos creados accidentalmente por el usuario root</td>
                  <td className="py-2.5 px-3">Ejecute <code className="text-sky-300 font-mono">sudo chown -R jarvis:jarvis /home/jarvis/jarvis-gabita</code></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-slate-300">database is locked</td>
                  <td className="py-2.5 px-3">Dos ciclos simultáneos intentando escribir en SQLite</td>
                  <td className="py-2.5 px-3">No ejecute <code className="text-sky-300 font-mono">--forzar</code> en el mismo minuto del cron; la base está en modo WAL</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono text-slate-300">/usuarios dice DOCX no</td>
                  <td className="py-2.5 px-3">No se ha corrido el ciclo inicial o generar_docx está en false</td>
                  <td className="py-2.5 px-3">Revise <code className="text-sky-300 font-mono">config.json</code> y ejecute un ciclo de prueba</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
