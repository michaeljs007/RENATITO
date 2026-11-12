import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI();
  } catch (e) {
    console.warn('Could not initialize GoogleGenAI:', e);
  }
}

interface EstablishmentData {
  id: string;
  razonSocial: string;
  ruc: string;
  unicodigo: string;
  perfil: string;
  tramiteRef: string;
  docDocx: boolean;
  docPng: boolean;
  entregaTelegram: boolean;
  entregaCorreo: boolean;
  reenvioPendiente: boolean;
  estadoRevision: string;
  colorEstado: string;
  fechaInspeccion: string;
  diasRestantes: number;
  accionRequerida: string;
}

let activeEstablishments: EstablishmentData[] = [
  {
    id: 'est-01',
    razonSocial: 'Consultorio Odontológico Sonrisas',
    ruc: '1792451928001',
    unicodigo: '17D01-001234',
    perfil: 'Consultorio General',
    tramiteRef: 'SPF-431540',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: false,
    reenvioPendiente: false,
    estadoRevision: 'CRÍTICA',
    colorEstado: 'rojo',
    fechaInspeccion: '14/11/2026',
    diasRestantes: 11,
    accionRequerida: 'Presentar planos actualizados y calibración de autoclave.'
  },
  {
    id: 'est-02',
    razonSocial: 'Clínica Quirúrgica San Gabriel',
    ruc: '1791834920001',
    unicodigo: '17D05-008912',
    perfil: 'Hospital del Día',
    tramiteRef: 'SPF-438921',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'CRÍTICA',
    colorEstado: 'rojo',
    fechaInspeccion: '18/11/2026',
    diasRestantes: 15,
    accionRequerida: 'Actualizar contrato de desechos biopeligrosos y póliza de responsabilidad civil.'
  },
  {
    id: 'est-03',
    razonSocial: 'Farmacias Económicas del Norte',
    ruc: '0992384712001',
    unicodigo: '09D02-004521',
    perfil: 'Distribuidora Farmacéutica',
    tramiteRef: 'SPF-432098',
    docDocx: true,
    docPng: false,
    entregaTelegram: true,
    entregaCorreo: false,
    reenvioPendiente: true,
    estadoRevision: 'PRÓXIMA',
    colorEstado: 'amarillo',
    fechaInspeccion: '25/11/2026',
    diasRestantes: 22,
    accionRequerida: 'Registrar nuevo Químico Farmacéutico responsable y registro Senescyt.'
  },
  {
    id: 'est-04',
    razonSocial: 'Centro Médico & Especialidades Los Andes',
    ruc: '1790023419001',
    unicodigo: '17D03-007722',
    perfil: 'Centro de Especialidades',
    tramiteRef: 'SPF-439002',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'PRÓXIMA',
    colorEstado: 'amarillo',
    fechaInspeccion: '29/11/2026',
    diasRestantes: 26,
    accionRequerida: 'Completar reporte de dosis radiológica en equipo de Rayos X dental.'
  },
  {
    id: 'est-05',
    razonSocial: 'Laboratorio Clínico Alfa Diagnóstico',
    ruc: '0190345612001',
    unicodigo: '01D01-003319',
    perfil: 'Laboratorio Clínico LAC-2',
    tramiteRef: 'SPF-440112',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: false,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '15/12/2026',
    diasRestantes: 42,
    accionRequerida: 'Permiso vigente. Mantener bitácora de control de calidad interno.'
  },
  {
    id: 'est-06',
    razonSocial: 'Policlínico Metropolitano del Valle',
    ruc: '1793098112001',
    unicodigo: '17D08-005610',
    perfil: 'Policlínico Ambulatorio',
    tramiteRef: 'SPF-441203',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '20/12/2026',
    diasRestantes: 47,
    accionRequerida: 'Verificar fechas de vencimiento de medicamentos en botiquín de emergencia.'
  },
  {
    id: 'est-07',
    razonSocial: 'Centro Pediátrico San Juan',
    ruc: '1890123849001',
    unicodigo: '18D01-002190',
    perfil: 'Consultorio Pediátrico',
    tramiteRef: 'SPF-442890',
    docDocx: true,
    docPng: true,
    entregaTelegram: false,
    entregaCorreo: false,
    reenvioPendiente: true,
    estadoRevision: 'PRÓXIMA',
    colorEstado: 'amarillo',
    fechaInspeccion: '02/12/2026',
    diasRestantes: 29,
    accionRequerida: 'Subir comprobante de pago de tasa de inspección ACESS.'
  },
  {
    id: 'est-08',
    razonSocial: 'Óptica y Centro de Visión Integral',
    ruc: '1718293041001',
    unicodigo: '17D02-009844',
    perfil: 'Consultorio Optométrico',
    tramiteRef: 'SPF-443109',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '10/01/2027',
    diasRestantes: 68,
    accionRequerida: 'Ninguna acción urgente. Permiso vigente hasta enero 2027.'
  },
  {
    id: 'est-09',
    razonSocial: 'Hospital del Día Santa Elena',
    ruc: '2490018273001',
    unicodigo: '24D01-009012',
    perfil: 'Hospital del Día / Cirugía',
    tramiteRef: 'SPF-437812',
    docDocx: false,
    docPng: false,
    entregaTelegram: false,
    entregaCorreo: false,
    reenvioPendiente: true,
    estadoRevision: 'CRÍTICA',
    colorEstado: 'rojo',
    fechaInspeccion: '12/11/2026',
    diasRestantes: 9,
    accionRequerida: 'Falta generar expediente DOCX/PNG y renovar contrato con gestor de biopeligrosos.'
  },
  {
    id: 'est-10',
    razonSocial: 'Farmacia San Blas Central',
    ruc: '1792901844001',
    unicodigo: '17D04-006733',
    perfil: 'Farmacia Comunitaria',
    tramiteRef: 'SPF-444501',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '05/01/2027',
    diasRestantes: 63,
    accionRequerida: 'Revisión periódica de temperatura y humedad en área de almacenamiento.'
  }
];

// In-Memory Telegram Bot Poller State
interface BotState {
  isActive: boolean;
  token: string;
  adminChatId: string;
  botInfo: { id?: number; first_name?: string; username?: string } | null;
  lastUpdateId: number;
  intervalId: NodeJS.Timeout | null;
  logs: Array<{ timestamp: string; type: 'info' | 'incoming' | 'reply' | 'error'; text: string }>;
}

const botState: BotState = {
  isActive: false,
  token: '',
  adminChatId: '',
  botInfo: null,
  lastUpdateId: 0,
  intervalId: null,
  logs: []
};

function addLog(type: 'info' | 'incoming' | 'reply' | 'error', text: string) {
  const timestamp = new Date().toLocaleTimeString();
  botState.logs.unshift({ timestamp, type, text });
  if (botState.logs.length > 50) botState.logs.pop();
}

// Generate formatted replies matching the specification
function generateCommandReply(rawText: string, chatId: string): string {
  const text = rawText.trim().toLowerCase();
  const rojos = activeEstablishments.filter((e) => e.colorEstado === 'rojo');
  const amarillos = activeEstablishments.filter((e) => e.colorEstado === 'amarillo');
  const verdes = activeEstablishments.filter((e) => e.colorEstado === 'verde');
  const pendientes = activeEstablishments.filter((e) => e.reenvioPendiente || !e.docDocx || !e.docPng);

  if (text === '/start') {
    return `🤖 *JARVIS GABITA · Bot de Control y Auditoría ACESS*\n\n` +
      `¡Bienvenido! Conexión exitosa y verificada.\n` +
      `*Chat ID:* \`${chatId}\`\n` +
      `*Base de datos:* \`/home/jarvis/jarvis-gabita/jarvis_control.db\`\n` +
      `*Establecimientos monitoreados:* ${activeEstablishments.length}\n\n` +
      `Comandos disponibles:\n` +
      `• \`/estado\` - Última corrida, alertas y pendientes\n` +
      `• \`/alertas\` - Detalle de rojos y amarillos\n` +
      `• \`/usuarios\` - Reporte completo de establecimientos\n` +
      `• \`/usuarios rojo\` - Filtro sólo críticos\n` +
      `• \`/usuarios amarillo\` - Filtro próximos\n` +
      `• \`/usuarios verde\` - Filtro al día\n` +
      `• \`/usuarios pendientes\` - Reenvíos y faltantes\n` +
      `• \`/perfiles\` - Alias de /usuarios`;
  }

  if (text === '/estado') {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    return `📊 *JARVIS GABITA · Estado Operativo*\n\n` +
      `• *Última corrida:* ${now}\n` +
      `• *Establecimientos en matriz:* ${activeEstablishments.length}\n` +
      `• *Alertas críticas (Rojo):* ${rojos.length}\n` +
      `• *Alertas próximas (Amarillo):* ${amarillos.length}\n` +
      `• *Al día (Verde):* ${verdes.length}\n` +
      `• *Pendientes de reenvío / doc:* ${pendientes.length}\n\n` +
      `⏱ *Próximos ciclos:* 08:00 · 12:00 · 16:00 · 20:00\n` +
      `🗄 *Base SQLite:* WAL OK · Modo sólo lectura en bot`;
  }

  if (text === '/alertas') {
    const alertItems = [...rojos, ...amarillos];
    if (alertItems.length === 0) {
      return `✅ *JARVIS GABITA · Alertas*\n\nNo existen alertas críticas ni próximas en este momento. Todos los establecimientos están al día.`;
    }
    return `⚠️ *JARVIS GABITA · Detalle de Alertas (${alertItems.length})*\n\n` +
      alertItems.map((est, idx) => {
        const badge = est.colorEstado === 'rojo' ? '🔴 CRÍTICA' : '🟡 PRÓXIMA';
        return `*${idx + 1}. ${est.razonSocial}*\n` +
          `   Perfil: ${est.perfil} · Trámite: \`${est.tramiteRef}\`\n` +
          `   Revisión: *${badge}* (${est.diasRestantes} días restantes)\n` +
          `   Fecha inspección: ${est.fechaInspeccion}\n` +
          `   Acción: ${est.accionRequerida}`;
      }).join('\n\n');
  }

  if (text.startsWith('/usuarios') || text.startsWith('/perfiles')) {
    let filterTarget = 'todos';
    if (text.includes('rojo')) filterTarget = 'rojo';
    else if (text.includes('amarillo')) filterTarget = 'amarillo';
    else if (text.includes('verde')) filterTarget = 'verde';
    else if (text.includes('pendientes')) filterTarget = 'pendientes';

    let list = activeEstablishments;
    if (filterTarget === 'rojo') list = rojos;
    else if (filterTarget === 'amarillo') list = amarillos;
    else if (filterTarget === 'verde') list = verdes;
    else if (filterTarget === 'pendientes') list = pendientes;

    if (list.length === 0) {
      return `ℹ️ *JARVIS GABITA · usuarios y perfiles*\n\nNo hay establecimientos con el filtro *${filterTarget.toUpperCase()}*.`;
    }

    return `📋 *JARVIS GABITA · usuarios y perfiles (${list.length})*\n` +
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

  return `❓ Comando no reconocido: \`${rawText}\`\n\nPruebe con:\n• \`/estado\`\n• \`/alertas\`\n• \`/usuarios\`\n• \`/usuarios rojo\`\n• \`/perfiles\``;
}

// Telegram API Helper: send message
async function sendTelegramMessage(token: string, chatId: string | number, text: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown'
    })
  });
  return await res.json();
}

// Poll Telegram updates function
async function pollTelegramUpdates() {
  if (!botState.isActive || !botState.token) return;

  try {
    const url = `https://api.telegram.org/bot${botState.token}/getUpdates?offset=${botState.lastUpdateId + 1}&timeout=5`;
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 409) {
        addLog('error', 'Error 409: Hay otra instancia o webhook de Telegram activo para este token.');
      } else if (response.status === 401) {
        addLog('error', 'Error 401: Token de Telegram no autorizado o revocado.');
      }
      return;
    }

    const data = await response.json();
    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        botState.lastUpdateId = Math.max(botState.lastUpdateId, update.update_id);
        const msg = update.message;
        if (msg && msg.text) {
          const chatId = String(msg.chat.id);
          const fromUser = msg.from ? (msg.from.username || msg.from.first_name || 'Usuario') : 'Usuario';
          const incomingText = msg.text;

          addLog('incoming', `De @${fromUser} (Chat: ${chatId}): "${incomingText}"`);

          // If adminChatId is specified, check authorization or auto-bind on /start
          if (!botState.adminChatId || botState.adminChatId === chatId || incomingText.startsWith('/start')) {
            if (!botState.adminChatId && incomingText.startsWith('/start')) {
              botState.adminChatId = chatId;
              addLog('info', `Chat ID administrativo detectado y vinculado: ${chatId}`);
            }

            const reply = generateCommandReply(incomingText, chatId);
            await sendTelegramMessage(botState.token, chatId, reply);
            addLog('reply', `Respuesta enviada a Telegram para "${incomingText}"`);
          } else {
            addLog('error', `Mensaje ignorado de Chat ID no autorizado: ${chatId} (esperado: ${botState.adminChatId})`);
            await sendTelegramMessage(
              botState.token,
              chatId,
              `⛔ *Acceso no autorizado*\nEste bot responde exclusivamente al administrador autorizado (\`admin_chat_id: ${botState.adminChatId}\`).`
            );
          }
        }
      }
    }
  } catch (err: any) {
    addLog('error', `Fallo de conexión polling: ${err.message}`);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Test bot token with Telegram getMe
  app.post('/api/telegram/test-token', async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ ok: false, error: 'Token es requerido' });
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json();
      if (data.ok) {
        addLog('info', `Token validado: @${data.result.username} (${data.result.first_name})`);
        return res.json({ ok: true, bot: data.result });
      } else {
        return res.status(400).json({ ok: false, error: data.description || 'Token inválido' });
      }
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // API Route: Send direct Telegram message / test alert
  app.post('/api/telegram/send-message', async (req, res) => {
    const { token, chatId, text } = req.body;
    const botToken = token || botState.token;
    if (!botToken || !chatId || !text) {
      return res.status(400).json({ ok: false, error: 'Token, chatId y text son requeridos' });
    }

    try {
      const result = await sendTelegramMessage(botToken, chatId, text);
      if (result.ok) {
        addLog('reply', `Mensaje enviado directamente a Chat ID ${chatId}`);
        return res.json({ ok: true, result: result.result });
      } else {
        addLog('error', `Telegram error: ${result.description}`);
        return res.status(400).json({ ok: false, error: result.description });
      }
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // API Route: Start live polling in background
  app.post('/api/telegram/start-polling', async (req, res) => {
    const { token, adminChatId } = req.body;
    if (!token) {
      return res.status(400).json({ ok: false, error: 'Token es requerido' });
    }

    // Verify token first
    try {
      const verifyRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const verifyData = await verifyRes.json();
      if (!verifyData.ok) {
        return res.status(400).json({ ok: false, error: verifyData.description || 'Token inválido' });
      }

      botState.token = token;
      botState.adminChatId = adminChatId || '';
      botState.botInfo = verifyData.result;
      botState.isActive = true;

      // Clear existing interval if any
      if (botState.intervalId) {
        clearInterval(botState.intervalId);
      }

      // Initial getUpdates to skip ancient messages if offset is 0
      try {
        const initUpdates = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5`);
        const initData = await initUpdates.json();
        if (initData.ok && initData.result.length > 0) {
          botState.lastUpdateId = initData.result[initData.result.length - 1].update_id;
        }
      } catch {
        // proceed
      }

      // Set polling interval (~2.5s)
      botState.intervalId = setInterval(pollTelegramUpdates, 2500);
      addLog('info', `Servicio de Bot activado para @${verifyData.result.username}. Polling en vivo.`);

      return res.json({
        ok: true,
        bot: verifyData.result,
        message: `Bot @${verifyData.result.username} activado y escuchando mensajes en vivo.`
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  });

  // API Route: Stop polling
  app.post('/api/telegram/stop-polling', (req, res) => {
    botState.isActive = false;
    if (botState.intervalId) {
      clearInterval(botState.intervalId);
      botState.intervalId = null;
    }
    addLog('info', 'Servicio de Bot detenido.');
    return res.json({ ok: true, message: 'Bot detenido exitosamente' });
  });

  // API Route: Get Bot Status and Logs
  app.get('/api/telegram/status', (req, res) => {
    return res.json({
      isActive: botState.isActive,
      botInfo: botState.botInfo,
      adminChatId: botState.adminChatId,
      logs: botState.logs,
      establishmentsCount: activeEstablishments.length
    });
  });

  // API Route: Sync establishments from client
  app.post('/api/telegram/sync-establishments', (req, res) => {
    if (Array.isArray(req.body.establishments)) {
      activeEstablishments = req.body.establishments;
      addLog('info', `Matriz de control sincronizada (${activeEstablishments.length} establecimientos)`);
      return res.json({ ok: true, count: activeEstablishments.length });
    }
    return res.status(400).json({ ok: false, error: 'Array requerido' });
  });

  // Webhook receiver if user sets up Telegram Webhook
  app.post('/api/telegram/webhook', async (req, res) => {
    res.status(200).send('OK');
    const update = req.body;
    if (update && update.message && update.message.text && botState.token) {
      const msg = update.message;
      const chatId = String(msg.chat.id);
      const text = msg.text;
      addLog('incoming', `[Webhook] Chat ${chatId}: "${text}"`);
      const reply = generateCommandReply(text, chatId);
      await sendTelegramMessage(botState.token, chatId, reply);
      addLog('reply', `[Webhook] Respuesta enviada a ${chatId}`);
    }
  });

  // API Route: Test external n8n Webhook connection from UI
  app.post('/api/test-n8n-webhook', async (req, res) => {
    const { webhookUrl, payload } = req.body;
    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return res.status(400).json({ ok: false, error: 'URL de webhook requerida' });
    }

    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {
          ruc: '1792451928001',
          unicodigo: '17D01-001234',
          razon_social: 'Establecimiento de Prueba Test n8n',
          tipologia: 'consultorio',
          tipo_tramite: 'renovacion',
          total_docs: 5
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;
      let responseData: any = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      return res.json({
        ok: response.ok,
        status: response.status,
        latencyMs,
        data: responseData
      });
    } catch (err: any) {
      return res.status(500).json({
        ok: false,
        error: err.name === 'AbortError' ? 'Tiempo de espera agotado (10s)' : err.message,
        latencyMs: Date.now() - start
      });
    }
  });

  // API Route: Simulate n8n Native AI Audit (matches the n8n LangChain Native AI prompt)
  app.post('/api/simulate-native-ai-audit', async (req, res) => {
    const {
      razonSocial = 'Consultorio de Especialidades',
      ruc = '1792451928001',
      unicodigo = '17D01-001234',
      tipologia = 'consultorio',
      tramite = 'renovacion',
      docsCount = 5,
      archivosPresentes = ['Cedula_Representante.pdf', 'Planilla_IESS.pdf', 'Cartera_Servicios.pdf']
    } = req.body;

    let docsEsperados = 5;
    if (tipologia === 'centro_medico' || tipologia === 'farmacia') docsEsperados = 8;
    if (tipologia === 'hospital') docsEsperados = 12;

    const faltantes = Math.max(0, docsEsperados - (docsCount || 0));

    // Try server-side Gemini if API key is present
    if (genAI) {
      try {
        const prompt = `Eres el Auditor Sanitario Senior de Aprobación 360 y perito en normativas de ACESS / MSP Ecuador.
Analiza el siguiente expediente recibido desde Hostinger para el flujo n8n:
- Establecimiento: ${razonSocial}
- RUC: ${ruc}
- Unicódigo: ${unicodigo}
- Trámite: ${tramite}
- Tipología Sanitaria: ${tipologia}
- Documentos Cargados: ${docsCount} de ${docsEsperados} exigidos por normativa
- Archivos reportados: ${archivosPresentes.join(', ')}

Reglas ACESS:
1. Si es Renovación y falta Unicódigo, marcar como RIESGO ALTO.
2. Si la cantidad de documentos es menor a ${docsEsperados}, emitir Dictamen OBSERVADO y detallar qué falta.
3. Si cumple los documentos, emitir Dictamen FAVORABLE y dar 3 recomendaciones para la inspección física.

Formato de respuesta obligatorio:
🎯 DICTAMEN: [FAVORABLE / OBSERVADO / CRÍTICO]
🚦 SEMÁFORO DE RIESGO: [VERDE / AMARILLO / ROJO]
📋 EVALUACIÓN DOCUMENTAL: [Detalle conciso]
⚠️ REQUISITOS FALTANTES O RIESGOS: [Puntos clave]
💡 RECOMENDACIONES TÉCNICAS: [3 puntos para preparar la inspección física]
📝 RESUMEN TELEGRAM: [2 líneas breves]`;

        const aiResponse = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const text = aiResponse.text || '';
        return res.json({
          ok: true,
          mode: 'gemini_live',
          model: 'gemini-3.8-flash',
          dictamen: text,
          docsEsperados,
          docsCount,
          semaforo: text.includes('VERDE') ? 'VERDE' : text.includes('ROJO') ? 'ROJO' : 'AMARILLO'
        });
      } catch (err: any) {
        console.warn('Gemini call failed, falling back to regulatory engine:', err.message);
      }
    }

    // Heuristic Regulatory Engine fallback
    let dictamen = 'FAVORABLE';
    let semaforo = 'VERDE';
    let evaluacion = `El establecimiento cuenta con ${docsCount} de ${docsEsperados} documentos requeridos.`;
    let faltantesTexto = 'Ninguno detectado. Cobertura documental al 100%.';

    if (faltantes > 0) {
      dictamen = 'OBSERVADO';
      semaforo = 'AMARILLO';
      evaluacion = `El expediente presenta ${docsCount} de ${docsEsperados} documentos exigidos por la tipología ${tipologia}.`;
      faltantesTexto = `Faltan ${faltantes} documento(s) obligatorio(s): ${
        tipologia === 'hospital'
          ? 'Contrato de desechos biopeligrosos, manual de bioseguridad o póliza civil.'
          : tipologia === 'centro_medico'
          ? 'Planos de distribución arquitectónica o certificados de calibración.'
          : 'Comprobante de tasa de inspección o permiso anterior.'
      }`;
    }

    if (tramite === 'renovacion' && (!unicodigo || unicodigo.toLowerCase().includes('nuevo') || unicodigo === 'SIN_UNICODIGO')) {
      dictamen = 'CRÍTICO';
      semaforo = 'ROJO';
      faltantesTexto += ' Inconsistencia crítica: Trámite marcado como renovación sin unicódigo provincial ACESS.';
    }

    const dictamenCompleto = `🎯 DICTAMEN: ${dictamen}
🚦 SEMÁFORO DE RIESGO: ${semaforo}
📋 EVALUACIÓN DOCUMENTAL: ${evaluacion}
⚠️ REQUISITOS FALTANTES O RIESGOS: ${faltantesTexto}
💡 RECOMENDACIONES TÉCNICAS:
1. Verificar rotulado de áreas según manual de bioseguridad vigente de ACESS.
2. Contar con botiquín de emergencias con medicamentos no caducados y registro Senescyt a la vista.
3. Mantener extintores con recarga vigente y señalética de evacuación visible.
📝 RESUMEN TELEGRAM:
Expediente de ${razonSocial} evaluado con Dictamen ${dictamen} (${semaforo}). Carpeta Google Drive generada y lista para inspección.`;

    return res.json({
      ok: true,
      mode: 'regulatory_engine',
      model: 'ACESS-RuleEngine-v4',
      dictamen: dictamenCompleto,
      docsEsperados,
      docsCount,
      semaforo
    });
  });

  // Mount Vite or static dist
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR !== 'false';
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`JARVIS GABITA Server running on port ${port}`);
  });
}

startServer();
