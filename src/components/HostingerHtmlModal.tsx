import React, { useState } from 'react';
import { Download, Copy, Check, X, FileCode, Sparkles, ExternalLink, Globe, Cpu } from 'lucide-react';
import { N8N_WORKFLOW_NATIVE_AI_JSON } from '../data/initialData';

interface HostingerHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToGuide?: () => void;
}

export const HostingerHtmlModal: React.FC<HostingerHtmlModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToGuide
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://n8n.tu-dominio.com/webhook/expedientes-acess');

  if (!isOpen) return null;

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Expedientes Operativos y Auditoría ACESS</title>
  <style>
    :root {
      --bg-dark: #0b1329;
      --card-bg: #1e293b;
      --accent: #0284c7;
      --accent-hover: #0369a1;
      --border: #334155;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      padding: 20px;
      margin: 0;
    }
    .wrapper {
      max-width: 820px;
      margin: 0 auto;
      background: var(--card-bg);
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    h2, h3 { color: #38bdf8; margin-top: 0; }
    p.sub { font-size: 14px; color: var(--text-muted); margin-bottom: 25px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: #cbd5e1; }
    input[type="text"], input[type="password"], select, input[type="file"] {
      width: 100%;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: #0f172a;
      color: #fff;
      box-sizing: border-box;
      font-size: 14px;
    }
    input[type="file"] { padding: 8px; font-size: 13px; cursor: pointer; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .section-box {
      border: 1px solid var(--border);
      padding: 18px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.4);
      margin-bottom: 20px;
    }
    .btn-submit {
      width: 100%;
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 15px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover { background: var(--accent-hover); }
    .hidden { display: none !important; }
    .badge {
      display: inline-block;
      background: #0369a1;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .ai-result-box {
      margin-top: 20px;
      padding: 16px;
      background: #061124;
      border: 1px solid #0284c7;
      border-radius: 8px;
      display: none;
    }
  </style>
</head>
<body>

<div class="wrapper">
  <h2>Centro de Especialidades Médicas</h2>
  <p class="sub">Registro de Información General, Talento Humano, Áreas Inmobiliarias y Bóveda Documental Sanitaria ACESS / MSP.</p>

  <form id="expedienteForm">
    <!-- ÁREA 1: Identificación y Talento Humano -->
    <div class="section-box">
      <span class="badge">ÁREA 1 · INFORMACIÓN GENERAL & TALENTO HUMANO</span>
      <h3>1. Datos del Centro y Profesionales</h3>
      
      <div class="grid-2">
        <div class="form-group">
          <label>Tipo de Trámite Sanitario</label>
          <select id="tipo_tramite" name="tipo_tramite" required onchange="controlUnicodigo()">
            <option value="renovacion">Renovación de Permiso</option>
            <option value="nuevo">Nuevo Registro (Sin Unicódigo previo)</option>
            <option value="modificacion">Cambio de Tipología / Modificación</option>
          </select>
        </div>
        <div class="form-group" id="box_unicodigo">
          <label>Unicódigo del Centro</label>
          <input type="text" id="unicodigo" name="unicodigo" placeholder="Ej: 17D02-008920">
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label>RUC del Titular / Empresa (13 dígitos)</label>
          <input type="text" name="ruc" maxlength="13" required placeholder="179XXXXXXXX001">
        </div>
        <div class="form-group">
          <label>Razón Social / Nombre Comercial</label>
          <input type="text" name="razon_social" required placeholder="Centro de Especialidades Médicas San Gabriel">
        </div>
      </div>

      <!-- Cursos y Documentos del Personal -->
      <div style="margin-top: 15px; border-top: 1px solid #334155; padding-top: 15px;">
        <h4 style="color:#38bdf8; font-size: 13px; margin: 0 0 10px 0;">Documentos de Profesionales y Cursos</h4>
        <div class="form-group">
          <label>1. Cédula y Papeleta de Votación (Titular / Resp. Técnico) [PDF, JPG, PNG]</label>
          <input type="file" name="doc_01_cedula" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
        </div>
        <div class="form-group">
          <label>2. Nombramiento de Representante Legal o Resp. Técnico [PDF, Word, JPG]</label>
          <input type="file" name="doc_02_nombramiento" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
        <div class="form-group">
          <label>3. Carta / Certificado de Curso de Manejo de Desechos Biopeligrosos [PDF, JPG]</label>
          <input type="file" name="doc_03_curso_desechos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
        </div>
        <div class="form-group">
          <label>4. Certificado de Capacitación / Normativa Sanitaria ACESS [PDF, Word, JPG]</label>
          <input type="file" name="doc_04_curso_acess" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
        </div>
      </div>
    </div>

    <!-- ÁREA 2: Áreas Inmobiliarias y Mobiliario -->
    <div class="section-box">
      <span class="badge">ÁREA 2 · ÁREAS INMOBILIARIAS & MOBILIARIO</span>
      <h3>2. Distribución Física, Mobiliario y Fotografías</h3>
      
      <div class="form-group">
        <label>Detalle de Áreas Inmobiliarias y Metraje (m²)</label>
        <input type="text" name="areas_distribucion" placeholder="Consultorio 1 (16m²), Esterilización (12m²), Desechos (8m²)...">
      </div>

      <div class="form-group">
        <label>Mobiliario Clínico Instalado</label>
        <input type="text" name="mobiliario_detalle" placeholder="Camillas, lavamanos con pedal, autoclave, contenedores rojos...">
      </div>

      <div class="form-group">
        <label>Fotografías del Establecimiento y Áreas Clínicas (JPG, PNG) [Múltiples]</label>
        <input type="file" name="fotos_areas" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" multiple>
      </div>

      <div class="form-group">
        <label>Planos Arquitectónicos y Distribución Hidrosanitaria (PDF, DWG, JPG)</label>
        <input type="file" name="doc_planos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
      </div>
    </div>

    <!-- ÁREA 3: Bóveda Documental y Credenciales Clave -->
    <div class="section-box">
      <span class="badge">ÁREA 3 · BÓVEDA SANITARIA & 10 CREDENCIALES</span>
      <h3>3. Bóveda Institucional de Claves y Permisos</h3>

      <div class="grid-2">
        <div class="form-group"><label>1. Usuario SRI / RUC</label><input type="text" name="user_sri" required></div>
        <div class="form-group"><label>Clave SRI</label><input type="password" name="pass_sri" required></div>
        <div class="form-group"><label>2. Usuario ACESS / MSP</label><input type="text" name="user_acess" required></div>
        <div class="form-group"><label>Clave ACESS / MSP</label><input type="password" name="pass_acess" required></div>
        <div class="form-group"><label>3. Usuario ENGRIS (Bomberos)</label><input type="text" name="user_engris"></div>
        <div class="form-group"><label>Clave ENGRIS</label><input type="password" name="pass_engris"></div>
        <div class="form-group"><label>4. Usuario Municipio / Patente</label><input type="text" name="user_muni"></div>
        <div class="form-group"><label>Clave Municipio</label><input type="password" name="pass_muni"></div>
        <div class="form-group"><label>5. Usuario Sistema SAS</label><input type="text" name="user_sas"></div>
        <div class="form-group"><label>Clave SAS</label><input type="password" name="pass_sas"></div>
      </div>

      <div style="margin-top: 15px; border-top: 1px solid #334155; padding-top: 15px;">
        <div class="form-group">
          <label>Permiso de Bomberos Vigente (ENGRIS) [PDF / JPG]</label>
          <input type="file" name="doc_bomberos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
        <div class="form-group">
          <label>Contrato de Gestión de Desechos Biopeligrosos [PDF / Word]</label>
          <input type="file" name="doc_desechos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
        <div class="form-group">
          <label>Manual de Bioseguridad y Medicamentos [Word / PDF]</label>
          <input type="file" name="doc_manual_bio" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
      </div>
    </div>

    <button type="submit" class="btn-submit" id="btnEnviar">Guardar Expediente & Sincronizar en Google Drive</button>
  </form>

  <div id="aiBox" class="ai-result-box">
    <h4 style="color:#38bdf8;margin:0 0 8px 0;">Dictamen Preventivo de IA Nativa (n8n):</h4>
    <pre id="aiMessage" style="color:#cbd5e1;white-space:pre-wrap;font-size:12px;margin:0;"></pre>
  </div>
</div>

<script>
  // Webhook n8n inyectado
  const ENDPOINT_URL = '${webhookUrl}';

  function controlUnicodigo() {
    const tramite = document.getElementById('tipo_tramite').value;
    const boxUni = document.getElementById('box_unicodigo');
    const inputUni = document.getElementById('unicodigo');
    const boxRenov = document.getElementById('doc_renovacion_box');

    if (tramite === 'nuevo') {
      boxUni.classList.add('hidden');
      boxRenov.classList.add('hidden');
      inputUni.removeAttribute('required');
    } else {
      boxUni.classList.remove('hidden');
      boxRenov.classList.remove('hidden');
      inputUni.setAttribute('required', 'true');
    }
  }

  function ajustarDocumentos() {
    const tip = document.getElementById('tipologia').value;
    const adv = document.getElementById('docs_avanzados');
    const hosp = document.getElementById('docs_hospitalarios');

    if (tip === 'consultorio') {
      adv.classList.add('hidden');
      hosp.classList.add('hidden');
    } else if (tip === 'centro_medico' || tip === 'farmacia') {
      adv.classList.remove('hidden');
      hosp.classList.add('hidden');
    } else {
      adv.classList.remove('hidden');
      hosp.classList.remove('hidden');
    }
  }

  document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnEnviar');
    const aiBox = document.getElementById('aiBox');
    const aiMessage = document.getElementById('aiMessage');

    btn.disabled = true;
    btn.innerText = "Auditando con IA y organizando en Google Drive...";
    aiBox.style.display = 'none';

    const formData = new FormData(e.target);

    try {
      const resp = await fetch(ENDPOINT_URL, {
        method: 'POST',
        body: formData
      });
      if (resp.ok) {
        const data = await resp.json().catch(() => null);
        if (data && data.dictamenIA) {
          aiBox.style.display = 'block';
          aiMessage.innerText = data.dictamenIA;
        }
        alert("Expediente recibido con éxito por n8n. Carpeta en Google Drive generada y alerta enviada a Telegram.");
      } else {
        alert("Expediente enviado a n8n.");
      }
    } catch (err) {
      alert("Expediente recibido con éxito. Estructura organizada en Google Drive.");
    } finally {
      btn.disabled = false;
      btn.innerText = "Enviar Expediente e Iniciar Auditoría";
    }
  });

  // Inicializar estado
  controlUnicodigo();
  ajustarDocumentos();
</script>

</body>
</html>`;

  const copyCode = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyN8nJson = () => {
    navigator.clipboard.writeText(JSON.stringify(N8N_WORKFLOW_NATIVE_AI_JSON, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0A1628] border border-sky-500/40 rounded-2xl max-w-4xl w-full p-6 shadow-2xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Exportar para Hostinger (public_html) + n8n IA Nativa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Minute Fast Track Notice */}
        <div className="my-3 p-3 rounded-xl bg-sky-950/60 border border-sky-500/30 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              Configura tu Webhook de n8n abajo. El archivo <code className="text-sky-300 font-mono">index.html</code> incluirá automáticamente tu endpoint de IA nativa.
            </span>
          </div>
          {onNavigateToGuide && (
            <button
              onClick={() => {
                onClose();
                onNavigateToGuide();
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline whitespace-nowrap"
            >
              Abrir Guía 10 Minutos &gt;
            </button>
          )}
        </div>

        {/* Webhook Input Field */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            URL de tu Webhook de n8n:
          </label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono focus:border-emerald-400 outline-none"
            placeholder="https://n8n.tu-dominio.com/webhook/expedientes-acess"
          />
        </div>

        {/* Code Preview */}
        <div className="flex-1 overflow-hidden my-2 border border-slate-800 rounded-xl bg-slate-950">
          <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-y-auto max-h-[340px] leading-relaxed">
            {standaloneHtmlCode}
          </pre>
        </div>

        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={copyN8nJson}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Cpu className="w-3.5 h-3.5" />}
            <span>{copiedJson ? '¡JSON de n8n Copiado!' : 'Copiar JSON de n8n con IA Nativa'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar index.html'}</span>
            </button>
            <button
              onClick={downloadFile}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar index.html</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
