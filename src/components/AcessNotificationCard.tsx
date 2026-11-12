import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Mail, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  User, 
  Building2, 
  Share2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { JESSICA_MORALES_NOTIFICATION } from '../data/initialData';
import { AcessNotificationData } from '../types/jarvis';

export const AcessNotificationCard: React.FC = () => {
  const [data, setData] = useState<AcessNotificationData>(JESSICA_MORALES_NOTIFICATION);
  const [activeFormat, setActiveFormat] = useState<'whatsapp' | 'email' | 'json'>('whatsapp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // WhatsApp plain text format
  const whatsappText = `*NOTIFICACIÓN DE SEGUIMIENTO SANITARIO · ACESS*
*APROBACIÓN 360 - AMBIENTE, SALUD Y SEGURIDAD*

Estimada *${data.profesional.nombre}*, le informamos el estado actualizado de su trámite de permiso sanitario:

📋 *DATOS DEL TRÁMITE*
• *N° Solicitud:* ${data.tramite.numeroSolicitud}
• *Código de Trámite:* ${data.tramite.codigoTramite}
• *Tipo de Permiso:* ${data.tramite.tipoPermiso}

🏢 *ESTABLECIMIENTO*
• *Denominación:* ${data.establecimiento.denominacion}
• *Razón Social:* ${data.profesional.razonSocial}
• *Servicio:* ${data.establecimiento.tipoServicio}

🔍 *ESTATUS ACTUAL:* 🟡 *${data.estatus.estado.toUpperCase()}*

📌 *OBSERVACIÓN CLAVE:*
${data.estatus.observacionClave}

⚡ *PRÓXIMA ACCIÓN:*
${data.estatus.accionPendiente}

_Para soporte técnico y preparación de la inspección física, comuníquese con su asesor de Aprobación 360._`;

  // Email format
  const emailText = `Asunto: [ACESS] Notificación de Trámite N° ${data.tramite.numeroSolicitud} - ${data.establecimiento.denominacion} - ${data.estatus.estado}

Estimada Dra. ${data.profesional.nombre},
${data.profesional.razonSocial}

Por medio de la presente, el sistema automatizado de seguimiento institucional de Aprobación 360 le notifica la actualización registrada en el portal de la Agencia de Aseguramiento de la Calidad de los Servicios de Salud y Medicina Prepagada (ACESS):

1. IDENTIFICACIÓN DEL TRÁMITE:
   - Número de Solicitud: ${data.tramite.numeroSolicitud}
   - Código de Trámite: ${data.tramite.codigoTramite}
   - Tipo de Permiso: ${data.tramite.tipoPermiso}

2. DATOS DEL ESTABLECIMIENTO:
   - Denominación Comercial: ${data.establecimiento.denominacion}
   - Nivel / Tipología: ${data.establecimiento.tipoServicio}

3. ESTADO OPERATIVO:
   - Estado: ${data.estatus.estado}
   - Observación Institucional: ${data.estatus.observacionClave}

4. ACCIÓN REQUERIDA:
   - ${data.estatus.accionPendiente}

RECOMENDACIONES PARA LA VISITA TÉCNICA:
- Contar en físico con el archivo documental institucional (títulos Senescyt, registro de equipos, carteras y certificados).
- Mantener señalética de bioseguridad y botiquín de emergencia al día.

Atentamente,
Asistente Automatizado de Gestión y Cumplimiento Sanitario
APROBACIÓN 360 · Ambiente, Salud y Seguridad`;

  const jsonText = JSON.stringify(data, null, 2);

  return (
    <div className="p-6 rounded-xl bg-[#1E293B]/80 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Notificación Oficial ACESS · Jessica Morales Villacis</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                PENDIENTE DE INSPECCIÓN
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Solicitud N° <strong className="text-white font-mono">{data.tramite.numeroSolicitud}</strong> · Trámite: <strong className="text-sky-300 font-mono">{data.tramite.codigoTramite}</strong>
            </p>
          </div>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFormat('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              activeFormat === 'whatsapp' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setActiveFormat('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              activeFormat === 'email' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Correo Formal</span>
          </button>
          <button
            onClick={() => setActiveFormat('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              activeFormat === 'json' ? 'bg-cyan-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Structured Card Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Profesional</span>
          <div className="text-xs font-bold text-white mt-0.5">{data.profesional.nombre}</div>
          <div className="text-[11px] text-slate-400 truncate">{data.profesional.razonSocial}</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Trámite</span>
          <div className="text-xs font-mono font-bold text-sky-400 mt-0.5">{data.tramite.codigoTramite}</div>
          <div className="text-[11px] text-slate-400 font-mono">Solicitud: {data.tramite.numeroSolicitud}</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Establecimiento</span>
          <div className="text-xs font-bold text-white mt-0.5">{data.establecimiento.denominacion}</div>
          <div className="text-[11px] text-slate-400">Nivel 1B Atención</div>
        </div>

        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
          <span className="text-[10px] text-amber-400 uppercase block font-semibold">Estatus</span>
          <div className="text-xs font-bold text-amber-300 mt-0.5">{data.estatus.estado}</div>
          <div className="text-[11px] text-amber-200/70">Coordinación en curso</div>
        </div>
      </div>

      {/* Output Content Display */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">
            {activeFormat === 'whatsapp' && 'Mensaje de Texto para WhatsApp (con formato negritas y emojis)'}
            {activeFormat === 'email' && 'Plantilla de Correo Electrónico Formal'}
            {activeFormat === 'json' && 'Estructura JSON Canónica para API o Webhook'}
          </span>
          <button
            onClick={() => {
              const text = activeFormat === 'whatsapp' ? whatsappText : activeFormat === 'email' ? emailText : jsonText;
              copyToClipboard(text, activeFormat);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            {copiedKey === activeFormat ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar {activeFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-72 whitespace-pre-wrap leading-relaxed">
          {activeFormat === 'whatsapp' && whatsappText}
          {activeFormat === 'email' && emailText}
          {activeFormat === 'json' && jsonText}
        </pre>
      </div>
    </div>
  );
};
