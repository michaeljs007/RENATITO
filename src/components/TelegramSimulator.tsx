import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Bot, 
  Check, 
  CheckCheck, 
  FileText, 
  Image as ImageIcon, 
  Clock, 
  Terminal,
  Play,
  KeyRound,
  Wifi,
  WifiOff,
  Radio,
  ExternalLink,
  Download,
  AlertCircle,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Establishment, TelegramBotMessage } from '../types/jarvis';

interface TelegramSimulatorProps {
  establishments: Establishment[];
  onTriggerCron: () => void;
  lastCronRun: string;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({
  establishments,
  onTriggerCron,
  lastCronRun
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'real' | 'simulador' | 'archivos'>('real');

  // Real Bot Connection State
  const [realToken, setRealToken] = useState('');
  const [realChatId, setRealChatId] = useState('');
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [verifiedBot, setVerifiedBot] = useState<{ id?: number; first_name?: string; username?: string } | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [pollingLogs, setPollingLogs] = useState<Array<{ timestamp: string; type: string; text: string }>>([]);
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);
  const [testAlertSuccess, setTestAlertSuccess] = useState<string | null>(null);
  const [isDetectingChatId, setIsDetectingChatId] = useState(false);

  // Web Simulator State
  const [messages, setMessages] = useState<TelegramBotMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `🤖 *JARVIS GABITA · Motor de Auditoría ACESS*\n\nSesión iniciada con éxito.\n*Chat autorizado:* \`admin_chat_id: 584920194\`\n*Base de datos:* \`/home/jarvis/jarvis-gabita/jarvis_control.db\` (WAL: activo)\n*Ciclos automáticos:* 08:00, 12:00, 16:00, 20:00\n\nComandos disponibles:\n• \`/estado\` - Última corrida, alertas y pendientes\n• \`/alertas\` - Detalle de rojos y amarillos\n• \`/usuarios\` - Reporte completo de establecimientos\n• \`/usuarios rojo\` - Filtro sólo críticos\n• \`/usuarios amarillo\` - Filtro próximos\n• \`/usuarios verde\` - Filtro al día\n• \`/usuarios pendientes\` - Reenvíos y faltantes\n• \`/perfiles\` - Alias de \`/usuarios\``,
      timestamp: '08:00',
    }
  ]);
  const [inputCommand, setInputCommand] = useState('');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<Establishment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active establishments to backend server for live bot
  useEffect(() => {
    fetch('/api/telegram/sync-establishments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ establishments })
    }).catch(() => {});
  }, [establishments]);

  // Periodic poll of status and logs
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/telegram/status');
        if (res.ok) {
          const data = await res.json();
          setIsPollingActive(data.isActive);
          if (data.botInfo && !verifiedBot) setVerifiedBot(data.botInfo);
          if (data.adminChatId && !realChatId) setRealChatId(data.adminChatId);
          if (Array.isArray(data.logs)) setPollingLogs(data.logs);
        }
      } catch {
        // fallback
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [verifiedBot, realChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Verify Bot Token with Telegram
  const handleVerifyToken = async () => {
    if (!realToken.trim()) return;
    setIsTestingToken(true);
    setTokenError(null);
    try {
      const res = await fetch('/api/telegram/test-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: realToken.trim() })
      });
      const data = await res.json();
      if (data.ok) {
        setVerifiedBot(data.bot);
      } else {
        setTokenError(data.error || 'Token inválido según api.telegram.org');
        setVerifiedBot(null);
      }
    } catch (err: any) {
      setTokenError(`Error de conexión: ${err.message}`);
    } finally {
      setIsTestingToken(false);
    }
  };

  // Auto-detect Chat ID from Telegram updates
  const handleDetectChatId = async () => {
    const token = realToken.trim();
    if (!token) {
      setTokenError('Por favor ingresa primero el token del bot');
      return;
    }
    setIsDetectingChatId(true);
    setTokenError(null);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        // find last message
        const lastMsg = data.result[data.result.length - 1].message;
        if (lastMsg && lastMsg.chat && lastMsg.chat.id) {
          setRealChatId(String(lastMsg.chat.id));
          setTestAlertSuccess(`¡Chat ID detectado: ${lastMsg.chat.id} (${lastMsg.from?.first_name || 'Usuario'})!`);
        } else {
          setTokenError('Se recibieron actualizaciones pero ninguna contiene un mensaje reciente. Envía /start a tu bot en Telegram y vuelve a hacer clic.');
        }
      } else {
        setTokenError('No se encontraron mensajes recientes. Abre Telegram, busca tu bot y envíale /start.');
      }
    } catch (err: any) {
      setTokenError(`Error buscando Chat ID: ${err.message}`);
    } finally {
      setIsDetectingChatId(false);
    }
  };

  // Toggle Live Polling
  const handleTogglePolling = async () => {
    if (isPollingActive) {
      try {
        await fetch('/api/telegram/stop-polling', { method: 'POST' });
        setIsPollingActive(false);
      } catch {}
    } else {
      if (!realToken.trim()) {
        setTokenError('Se requiere el token del bot para activar el polling en vivo');
        return;
      }
      try {
        const res = await fetch('/api/telegram/start-polling', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: realToken.trim(),
            adminChatId: realChatId.trim()
          })
        });
        const data = await res.json();
        if (data.ok) {
          setIsPollingActive(true);
          setTokenError(null);
        } else {
          setTokenError(data.error);
        }
      } catch (err: any) {
        setTokenError(`Error iniciando bot: ${err.message}`);
      }
    }
  };

  // Send Direct Alert to Telegram
  const handleSendTestMessage = async () => {
    if (!realChatId.trim()) {
      setTokenError('Ingresa o detecta tu Chat ID antes de enviar la alerta');
      return;
    }
    const token = realToken.trim();
    if (!token) {
      setTokenError('Ingresa el token del bot');
      return;
    }

    setIsSendingTestAlert(true);
    setTestAlertSuccess(null);
    setTokenError(null);

    const messagePayload = `🚀 *JARVIS GABITA · Alerta de Prueba ACESS*\n\n` +
      `¡Hola! La conexión con tu bot de Telegram ha sido verificada con éxito.\n` +
      `• *Chat ID:* \`${realChatId}\`\n` +
      `• *Establecimientos:* ${establishments.length}\n` +
      `• *Alertas críticas:* ${establishments.filter(e => e.colorEstado === 'rojo').length}\n\n` +
      `Ahora puedes responderle a este bot desde tu móvil con:\n` +
      `\`/estado\`, \`/alertas\`, \`/usuarios\` o \`/perfiles\`.`;

    try {
      const res = await fetch('/api/telegram/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          chatId: realChatId.trim(),
          text: messagePayload
        })
      });
      const data = await res.json();
      if (data.ok) {
        setTestAlertSuccess(`¡Mensaje entregado en Telegram a tu chat (${realChatId}) con éxito!`);
      } else {
        setTokenError(data.error || 'Error enviando mensaje');
      }
    } catch (err: any) {
      setTokenError(`Fallo al enviar: ${err.message}`);
    } finally {
      setIsSendingTestAlert(false);
    }
  };

  // Simulator Command Logic
  const processCommand = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const userMsg: TelegramBotMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputCommand('');

    setTimeout(() => {
      handleBotReply(text);
    }, 200);
  };

  const handleBotReply = (cmd: string) => {
    const lower = cmd.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let replyText = '';

    const rojos = establishments.filter((e) => e.colorEstado === 'rojo');
    const amarillos = establishments.filter((e) => e.colorEstado === 'amarillo');
    const verdes = establishments.filter((e) => e.colorEstado === 'verde');
    const pendientes = establishments.filter((e) => e.reenvioPendiente || !e.docDocx || !e.docPng);

    if (lower === '/start') {
      replyText = `🤖 *JARVIS GABITA · Bot de Control y Auditoría*\n\nConexión autorizada para el chat administrativo.\nEstablecimientos monitoreados: *${establishments.length}*\n\nEscriba \`/estado\` o use los botones de comando rápidos para comenzar.`;
    } else if (lower === '/estado') {
      replyText = `📊 *JARVIS GABITA · Estado Operativo*\n\n` +
        `• *Última corrida:* ${lastCronRun}\n` +
        `• *Establecimientos en matriz:* ${establishments.length}\n` +
        `• *Alertas críticas (Rojo):* ${rojos.length}\n` +
        `• *Alertas próximas (Amarillo):* ${amarillos.length}\n` +
        `• *Al día (Verde):* ${verdes.length}\n` +
        `• *Pendientes de reenvío / doc:* ${pendientes.length}\n\n` +
        `⏱ *Próximo ciclo programado:* 12:00\n` +
        `🗄 *Base SQLite:* WAL OK · Modo sólo lectura en bot`;
    } else if (lower === '/alertas') {
      const alertItems = [...rojos, ...amarillos];
      if (alertItems.length === 0) {
        replyText = `✅ *No hay alertas críticas ni próximas.*\nTodos los establecimientos están al día.`;
      } else {
        replyText = `⚠️ *JARVIS GABITA · Detalle de Alertas (${alertItems.length})*\n\n` +
          alertItems.map((est, idx) => {
            const badge = est.colorEstado === 'rojo' ? '🔴 CRÍTICA' : '🟡 PRÓXIMA';
            return `*${idx + 1}. ${est.razonSocial}*\n` +
              `   Perfil: ${est.perfil} · Trámite: \`${est.tramiteRef}\`\n` +
              `   Revisión: *${badge}* (${est.diasRestantes} días restantes)\n` +
              `   Fecha inspección: ${est.fechaInspeccion}\n` +
              `   Acción: ${est.accionRequerida}`;
          }).join('\n\n');
      }
    } else if (lower.startsWith('/usuarios') || lower.startsWith('/perfiles')) {
      let filterTarget = 'todos';
      if (lower.includes('rojo')) filterTarget = 'rojo';
      else if (lower.includes('amarillo')) filterTarget = 'amarillo';
      else if (lower.includes('verde')) filterTarget = 'verde';
      else if (lower.includes('pendientes')) filterTarget = 'pendientes';

      let list = establishments;
      if (filterTarget === 'rojo') list = rojos;
      else if (filterTarget === 'amarillo') list = amarillos;
      else if (filterTarget === 'verde') list = verdes;
      else if (filterTarget === 'pendientes') list = pendientes;

      if (list.length === 0) {
        replyText = `ℹ️ *JARVIS GABITA · usuarios y perfiles*\n\nNo hay establecimientos con el filtro *${filterTarget.toUpperCase()}*.`;
      } else {
        replyText = `📋 *JARVIS GABITA · usuarios y perfiles (${list.length})*\n` +
          (filterTarget !== 'todos' ? `*Filtro aplicado:* ${filterTarget.toUpperCase()}\n\n` : '\n') +
          list.map((est, idx) => {
            const docxStr = est.docDocx ? 'DOCX sí' : 'DOCX no';
            const pngStr = est.docPng ? 'PNG sí' : 'PNG no';
            const tgStr = est.entregaTelegram ? 'Telegram sí' : 'Telegram no';
            const mailStr = est.entregaCorreo ? 'Correo sí' : 'Correo no';
            const revStr = est.colorEstado === 'rojo' ? '🔴 CRÍTICA' : est.colorEstado === 'amarillo' ? '🟡 PRÓXIMA' : '🟢 AL DÍA';

            return `*${idx + 1}. ${est.razonSocial}*\n` +
              `   Perfil: ${est.perfil} · Trámite: \`${est.tramiteRef}\`\n` +
              `   Documentación: ${docxStr} · ${pngStr}\n` +
              `   Entrega: ${tgStr} · ${mailStr}${est.reenvioPendiente ? ' (reenvío pendiente)' : ''}\n` +
              `   Revisión: *${revStr}* · Inspección ${est.fechaInspeccion} · ${est.diasRestantes} día(s)\n` +
              `   Acción: ${est.accionRequerida}`;
          }).join('\n\n');
      }
    } else {
      replyText = `❓ Comando no reconocido: \`${cmd}\`\n\nPruebe con \`/estado\`, \`/alertas\`, \`/usuarios\` o \`/perfiles\`.`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-b`,
        sender: 'bot',
        text: replyText,
        timestamp,
      }
    ]);
  };

  const downloadPythonScript = () => {
    window.open('/scripts/jarvis_engine.py', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-1">
            <span>Bot de Telegram Real</span>
            <span aria-hidden="true">·</span>
            <span>API Oficial de Telegram</span>
            <span aria-hidden="true">·</span>
            <span>Polling en Vivo</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Conexión con Bot de Telegram
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conecta tu bot real creado en @BotFather para recibir y responder comandos <code className="text-sky-300 font-mono text-xs">/estado</code>, <code className="text-sky-300 font-mono text-xs">/alertas</code> y <code className="text-sky-300 font-mono text-xs">/usuarios</code> desde tu celular.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPollingActive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Bot Activo en Vivo</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Bot Desconectado</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('real')}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'real'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Vincular mi Telegram Real</span>
        </button>
        <button
          onClick={() => setActiveSubTab('simulador')}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'simulador'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Simulador Web de Consola</span>
        </button>
        <button
          onClick={() => setActiveSubTab('archivos')}
          className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'archivos'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Archivos Python para Debian</span>
        </button>
      </div>

      {/* SUBTAB 1: Conectar Bot Real */}
      {activeSubTab === 'real' && (
        <div className="space-y-6">
          {/* Token & Chat ID Box */}
          <div className="p-6 rounded-lg bg-[#1E293B]/80 border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sky-400" />
              <span>Credenciales de Telegram (@BotFather)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingresa el token que te entregó <strong>@BotFather</strong> en Telegram con <code className="text-sky-300 font-mono">/newbot</code>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Token del Bot de Telegram <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={realToken}
                    onChange={(e) => setRealToken(e.target.value)}
                    placeholder="Ej: 7129845120:AAHq_m7Xk9_..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyToken}
                    disabled={isTestingToken || !realToken.trim()}
                    className="px-3 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white rounded transition-colors whitespace-nowrap"
                  >
                    {isTestingToken ? 'Verificando...' : 'Verificar Token'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chat ID Administrativo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={realChatId}
                    onChange={(e) => setRealChatId(e.target.value)}
                    placeholder="Ej: 584920194"
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleDetectChatId}
                    disabled={isDetectingChatId}
                    title="Envía /start a tu bot en Telegram y haz clic aquí"
                    className="px-2.5 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded transition-colors whitespace-nowrap"
                  >
                    {isDetectingChatId ? 'Detectando...' : 'Detectar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Error or Success Banners */}
            {tokenError && (
              <div className="mt-4 p-3 rounded bg-red-950/40 border border-red-800/80 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{tokenError}</span>
              </div>
            )}

            {testAlertSuccess && (
              <div className="mt-4 p-3 rounded bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{testAlertSuccess}</span>
              </div>
            )}

            {verifiedBot && (
              <div className="mt-4 p-3 rounded bg-slate-900 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{verifiedBot.first_name}</span>
                      <span className="font-mono text-emerald-400 font-normal">@{verifiedBot.username}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ID: {verifiedBot.id} · Conexión directa con api.telegram.org OK
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePolling}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                      isPollingActive
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isPollingActive ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                    <span>{isPollingActive ? 'Detener Polling' : 'Activar Bot en Vivo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTestMessage}
                    disabled={isSendingTestAlert}
                    className="px-3 py-1.5 text-xs font-medium bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 rounded transition-colors"
                  >
                    {isSendingTestAlert ? 'Enviando...' : 'Enviar Alerta de Prueba'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions to Test with Mobile Telegram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#1E293B]/60 border border-slate-800 text-xs">
              <h4 className="font-semibold text-sky-400 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>¿Cómo probarlo desde tu teléfono?</span>
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
                <li>
                  Copia tu <strong>Token de Telegram</strong> obtenido en <code className="text-sky-300 font-mono">@BotFather</code> y pégalo arriba.
                </li>
                <li>
                  Haz clic en <strong>Verificar Token</strong>.
                </li>
                <li>
                  Abre Telegram en tu teléfono o PC, busca tu bot (ej: <code className="text-sky-300 font-mono">@{verifiedBot?.username || 'mi_bot'}</code>) y pulsa <strong>Iniciar</strong> o envía <code className="text-sky-300 font-mono">/start</code>.
                </li>
                <li>
                  Haz clic en <strong>Detectar Chat ID</strong> para vincular tu chat personal como administrador.
                </li>
                <li>
                  Pulsa <strong>Activar Bot en Vivo</strong>. ¡Listo! Escríbele <code className="text-sky-300 font-mono">/estado</code> o <code className="text-sky-300 font-mono">/alertas</code> desde Telegram y te responderá al instante.
                </li>
              </ol>
            </div>

            {/* Live Terminal Traffic Log */}
            <div className="p-4 rounded-lg bg-[#1E293B]/60 border border-slate-800 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Tráfico en Vivo con Telegram API</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isPollingActive ? 'escuchando...' : 'detenido'}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] h-48 overflow-y-auto space-y-1">
                  {pollingLogs.length === 0 ? (
                    <div className="text-slate-500 italic p-2">
                      Sin eventos registrados aún. Al activar el bot, aquí aparecerán los mensajes entrantes de Telegram y las respuestas automáticas.
                    </div>
                  ) : (
                    pollingLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight">
                        <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                        <span
                          className={
                            log.type === 'error'
                              ? 'text-red-400'
                              : log.type === 'incoming'
                              ? 'text-sky-300 font-semibold'
                              : log.type === 'reply'
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                          }
                        >
                          {log.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 mt-2">
                Conexión segura SSL/TLS con servidores de Telegram · Uptime gestionado en Node/Express.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Simulador Web */}
      {activeSubTab === 'simulador' && (
        <div>
          {/* Main Chat Container */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#0F172A] flex flex-col h-[520px] shadow-xl">
            {/* Chat Header */}
            <div className="bg-[#1E293B] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-600/30 border border-sky-500/40 flex items-center justify-center text-sky-400 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>JARVIS GABITA Audit Bot</span>
                    <span className="text-[11px] font-mono text-emerald-400">@jarvis_gabita_bot</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    admin_chat_id: 584920194 · Modo Consola Interactiva
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                Último ciclo: <span className="font-mono text-slate-300">{lastCronRun}</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-radial from-slate-900/60 to-[#0B1329]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-[#1E293B] text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed">
                      {msg.text.split('\n').map((line, idx) => {
                        const parts = line.split(/(\*[^*]+\*|`[^`]+`)/g);
                        return (
                          <div key={idx} className={line === '' ? 'h-2' : ''}>
                            {parts.map((part, pIdx) => {
                              if (part.startsWith('*') && part.endsWith('*')) {
                                return (
                                  <strong key={pIdx} className="font-semibold text-white">
                                    {part.slice(1, -1)}
                                  </strong>
                                );
                              }
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return (
                                  <code
                                    key={pIdx}
                                    className="px-1 py-0.5 rounded bg-slate-950/80 font-mono text-sky-300 text-xs"
                                  >
                                    {part.slice(1, -1)}
                                  </code>
                                );
                              }
                              return part;
                            })}
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                        msg.sender === 'user' ? 'text-sky-200' : 'text-slate-500'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-200" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Command Pills */}
            <div className="bg-[#1E293B]/80 px-4 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-400 font-medium text-[11px] mr-1 shrink-0">Comandos:</span>
              <button
                onClick={() => processCommand('/estado')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors whitespace-nowrap font-mono"
              >
                /estado
              </button>
              <button
                onClick={() => processCommand('/alertas')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors whitespace-nowrap font-mono"
              >
                /alertas
              </button>
              <button
                onClick={() => processCommand('/usuarios')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap font-mono"
              >
                /usuarios
              </button>
              <button
                onClick={() => processCommand('/usuarios rojo')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700 transition-colors whitespace-nowrap font-mono"
              >
                /usuarios rojo
              </button>
              <button
                onClick={() => processCommand('/usuarios amarillo')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-yellow-300 border border-slate-700 transition-colors whitespace-nowrap font-mono"
              >
                /usuarios amarillo
              </button>
              <button
                onClick={() => processCommand('/perfiles')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors whitespace-nowrap font-mono"
              >
                /perfiles
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processCommand(inputCommand);
              }}
              className="p-3 bg-[#1E293B] border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputCommand}
                onChange={(e) => setInputCommand(e.target.value)}
                placeholder="Escriba /estado, /alertas, /usuarios..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="submit"
                disabled={!inputCommand.trim()}
                className="p-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Archivos Python para Debian */}
      {activeSubTab === 'archivos' && (
        <div className="space-y-4 p-5 rounded-lg bg-[#1E293B]/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Archivos del Motor y Servicio para Servidor Debian
              </h3>
              <p className="text-slate-400 mt-0.5">
                Archivos listos para ejecutar de forma autónoma en <code className="text-sky-300 font-mono">/home/jarvis/jarvis-gabita</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-slate-900 border border-slate-800">
              <div className="font-semibold text-sky-400 mb-1">jarvis_engine.py</div>
              <p className="text-slate-400 mb-3">
                Motor principal en Python 3 con soporte para SQLite WAL, asistente interactivo <code className="text-sky-300 font-mono">--telegram</code>, demonio de polling continuo <code className="text-sky-300 font-mono">--bot</code> y evaluación periódica <code className="text-sky-300 font-mono">--cron</code>.
              </p>
              <div className="text-[11px] text-slate-500">
                Ubicación: <code className="font-mono text-slate-300">/home/jarvis/jarvis-gabita/jarvis_engine.py</code>
              </div>
            </div>

            <div className="p-4 rounded bg-slate-900 border border-slate-800">
              <div className="font-semibold text-sky-400 mb-1">instalar_servicio_bot.sh</div>
              <p className="text-slate-400 mb-3">
                Script bash que genera y registra la unidad systemd <code className="text-sky-300 font-mono">jarvis-bot.service</code> con reinicio automático en fallo y máscara segura de permisos UMask=0077.
              </p>
              <div className="text-[11px] text-slate-500">
                Ubicación: <code className="font-mono text-slate-300">/etc/systemd/system/jarvis-bot.service</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
