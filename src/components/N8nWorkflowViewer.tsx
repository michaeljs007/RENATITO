import React, { useState } from 'react';
import { 
  Network, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  FolderArchive, 
  Bot, 
  FileCode, 
  Workflow, 
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles,
  Download,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Server,
  Globe,
  Upload,
  Cpu,
  Layers,
  HelpCircle,
  Play
} from 'lucide-react';
import { N8N_WORKFLOW_JSON, N8N_WORKFLOW_NATIVE_AI_JSON } from '../data/initialData';

export const N8nWorkflowViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diez_minutos' | 'flujo_ia' | 'probador' | 'archivos_hostinger'>('diez_minutos');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedHtaccess, setCopiedHtaccess] = useState(false);
  const [selectedWorkflowVersion, setSelectedWorkflowVersion] = useState<'ia_nativa' | 'basico'>('ia_nativa');

  // User's custom webhook URL state
  const [customWebhookUrl, setCustomWebhookUrl] = useState('https://n8n.tu-dominio.com/webhook/expedientes-acess');

  // Live Webhook Ping State
  const [isPingingWebhook, setIsPingingWebhook] = useState(false);
  const [webhookPingResult, setWebhookPingResult] = useState<{
    ok: boolean;
    status?: number;
    latencyMs?: number;
    data?: any;
    error?: string;
  } | null>(null);

  // Live Native AI Simulation State
  const [testRazonSocial, setTestRazonSocial] = useState('Clínica Odontológica & Cirugía San Rafael');
  const [testRuc, setTestRuc] = useState('1792451928001');
  const [testUnicodigo, setTestUnicodigo] = useState('17D01-001234');
  const [testTipologia, setTestTipologia] = useState<'consultorio' | 'centro_medico' | 'farmacia' | 'hospital'>('centro_medico');
  const [testTramite, setTestTramite] = useState('renovacion');
  const [testDocsCount, setTestDocsCount] = useState<number>(8);
  const [isRunningAiSimulation, setIsRunningAiSimulation] = useState(false);
  const [aiSimulationResult, setAiSimulationResult] = useState<{
    dictamen: string;
    semaforo: string;
    mode: string;
    model: string;
  } | null>(null);

  const safeRazon = testRazonSocial.replace(/[^a-zA-Z0-9_-]/g, '_');
  const simulatedFolderName = `${testRuc}_${testUnicodigo}_${safeRazon}`;

  const currentWorkflowData = selectedWorkflowVersion === 'ia_nativa' ? N8N_WORKFLOW_NATIVE_AI_JSON : N8N_WORKFLOW_JSON;

  const copyWorkflowJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentWorkflowData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const downloadWorkflowJson = () => {
    const jsonStr = JSON.stringify(currentWorkflowData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedWorkflowVersion === 'ia_nativa' ? 'workflow_n8n_acess_ia_nativa.json' : 'workflow_n8n_acess_basico.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Generate customized index.html for Hostinger with user's webhook
  const generateHostingerHtml = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portal de Carga de Expedientes Sanitarios · ACESS</title>
  <style>
    :root {
      --bg: #030917;
      --card: #0b1528;
      --accent: #0284c7;
      --accent-hover: #0369a1;
      --border: #1e293b;
      --text: #f8fafc;
      --muted: #94a3b8;
      --emerald: #10b981;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      padding: 24px 16px;
      margin: 0;
      line-height: 1.5;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
      background: var(--card);
      border: 1px solid var(--border);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    h1 { margin: 0 0 6px 0; font-size: 24px; color: #38bdf8; }
    p.sub { font-size: 13px; color: var(--muted); margin: 0; }
    .badge {
      display: inline-block;
      background: rgba(2, 132, 199, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .section-card {
      border: 1px solid var(--border);
      padding: 20px;
      border-radius: 12px;
      background: rgba(15, 23, 42, 0.5);
      margin-bottom: 20px;
    }
    .section-card h3 {
      font-size: 15px;
      color: #e2e8f0;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media(max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }
    .form-group { margin-bottom: 14px; }
    label { display: block; margin-bottom: 5px; font-size: 12px; font-weight: 600; color: #cbd5e1; }
    input[type="text"], input[type="password"], select, input[type="file"] {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: #060e1d;
      color: #fff;
      box-sizing: border-box;
      font-size: 13px;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #fff;
      border: none;
      padding: 16px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
    }
    .btn-submit:hover { opacity: 0.95; transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .hidden { display: none !important; }
    .ai-feedback {
      margin-top: 20px;
      padding: 16px;
      border-radius: 10px;
      background: #021a2c;
      border: 1px solid #0369a1;
      display: none;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="header">
    <span class="badge">APROBACIÓN 360 · ACESS ECUADOR</span>
    <h1>Centro de Especialidades Médicas</h1>
    <p class="sub">Registro de Información General, Talento Humano con Cursos, Áreas Inmobiliarias con Fotos y Bóveda Documental Sanitaria.</p>
  </div>

  <form id="expedienteForm">
    <!-- ÁREA 1: Identificación y Talento Humano -->
    <div class="section-card">
      <span class="badge">ÁREA 1 · INFORMACIÓN GENERAL & TALENTO HUMANO</span>
      <h3>1. Identificación y Documentos del Personal</h3>
      <div class="grid-2">
        <div class="form-group">
          <label>Tipo de Trámite Sanitario</label>
          <select id="tipo_tramite" name="tipo_tramite" required onchange="controlUnicodigo()">
            <option value="renovacion">Renovación de Permiso de Funcionamiento</option>
            <option value="nuevo">Nuevo Registro (Primera Vez - Sin Unicódigo)</option>
            <option value="modificacion">Cambio de Tipología / Modificación</option>
          </select>
        </div>
        <div class="form-group" id="box_unicodigo">
          <label>Unicódigo ACESS del Centro</label>
          <input type="text" id="unicodigo" name="unicodigo" placeholder="Ej: 17D02-008920" value="17D02-008920">
        </div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>RUC del Titular / Empresa (13 dígitos)</label>
          <input type="text" name="ruc" maxlength="13" required placeholder="179XXXXXXXX001" value="1793148902001">
        </div>
        <div class="form-group">
          <label>Razón Social del Centro de Especialidades</label>
          <input type="text" name="razon_social" required placeholder="Centro de Especialidades Médicas San Gabriel" value="Centro de Especialidades Médicas San Gabriel">
        </div>
      </div>

      <div style="margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px;">
        <h4 style="color:#38bdf8; font-size: 13px; margin: 0 0 10px 0;">Cursos y Acreditaciones del Personal (Híbrido)</h4>
        <div class="grid-2">
          <div class="form-group">
            <label>1. Cédula y Papeleta [PDF, JPG, PNG]</label>
            <input type="file" name="doc_01_cedula" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
          </div>
          <div class="form-group">
            <label>2. Nombramiento Resp. Técnico [PDF, Word, JPG]</label>
            <input type="file" name="doc_02_nombramiento" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label>3. Curso Manejo Desechos Biopeligrosos [PDF, JPG]</label>
            <input type="file" name="doc_03_curso_desechos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
          </div>
          <div class="form-group">
            <label>4. Curso Normativa Sanitaria ACESS [PDF, Word, JPG]</label>
            <input type="file" name="doc_04_curso_acess" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required>
          </div>
        </div>
      </div>
    </div>

    <!-- ÁREA 2: Áreas Inmobiliarias, Mobiliario y Fotos -->
    <div class="section-card">
      <span class="badge">ÁREA 2 · ÁREAS INMOBILIARIAS & MOBILIARIO</span>
      <h3>2. Distribución Física, Mobiliario y Fotografías</h3>
      <div class="form-group">
        <label>Distribución de Ambientes y Metraje (m²)</label>
        <input type="text" name="areas_distribucion" placeholder="Consultorio 1 (16m²), Esterilización (12m²), Depósito de Desechos (8m²)...">
      </div>
      <div class="form-group">
        <label>Mobiliario Clínico Instalado</label>
        <input type="text" name="mobiliario_detalle" placeholder="Camilla de exploración, lavamanos con pedal, autoclave digital, recipientes biopeligrosos...">
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Fotografías del Centro y Áreas (JPG, PNG) [Múltiples]</label>
          <input type="file" name="fotos_areas" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" multiple>
        </div>
        <div class="form-group">
          <label>Planos Arquitectónicos Sanitarios [PDF, DWG, JPG]</label>
          <input type="file" name="doc_planos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
      </div>
    </div>

    <!-- ÁREA 3: Bóveda Documental y 10 Credenciales Clave -->
    <div class="section-card">
      <span class="badge">ÁREA 3 · BÓVEDA SANITARIA & 10 CREDENCIALES</span>
      <h3>3. Bóveda Institucional de Credenciales & Permisos</h3>
      <div class="grid-2">
        <div class="form-group"><label>1. Usuario SRI / RUC</label><input type="text" name="user_sri" placeholder="1793148902001"></div>
        <div class="form-group"><label>Clave SRI</label><input type="password" name="pass_sri" placeholder="••••••••"></div>
        <div class="form-group"><label>2. Usuario ACESS / MSP</label><input type="text" name="user_acess" placeholder="usuario_acess"></div>
        <div class="form-group"><label>Clave ACESS / MSP</label><input type="password" name="pass_acess" placeholder="••••••••"></div>
        <div class="form-group"><label>3. Usuario Bomberos (ENGRIS)</label><input type="text" name="user_engris" placeholder="bomberos_179"></div>
        <div class="form-group"><label>Clave Bomberos</label><input type="password" name="pass_engris" placeholder="••••••••"></div>
        <div class="form-group"><label>4. Usuario Municipio / Patente</label><input type="text" name="user_muni" placeholder="patente_uio"></div>
        <div class="form-group"><label>Clave Municipio</label><input type="password" name="pass_muni" placeholder="••••••••"></div>
        <div class="form-group"><label>5. Usuario Sistema SAS</label><input type="text" name="user_sas" placeholder="sas_sociedad"></div>
        <div class="form-group"><label>Clave SAS</label><input type="password" name="pass_sas" placeholder="••••••••"></div>
      </div>
      <div class="grid-2" style="margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px;">
        <div class="form-group">
          <label>Permiso Bomberos Vigente [PDF / JPG]</label>
          <input type="file" name="doc_bomberos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
        <div class="form-group">
          <label>Contrato Gestor Desechos [PDF / Word]</label>
          <input type="file" name="doc_desechos" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
        </div>
      </div>
    </div>

    <button type="submit" class="btn-submit" id="btnEnviar">
      Auditar con IA Nativa & Archivar en Google Drive
    </button>
  </form>

  <div id="aiResult" class="ai-feedback">
    <h4 style="color:#38bdf8;margin:0 0 8px 0;">Respuesta de Auditoría de IA Nativa (n8n):</h4>
    <pre id="aiText" style="white-space:pre-wrap;font-size:12px;color:#e2e8f0;margin:0;"></pre>
    <div id="driveLinkBox" style="margin-top:12px;"></div>
  </div>
</div>

<script>
  // Webhook de producción en n8n
  const N8N_WEBHOOK_URL = '${customWebhookUrl}';

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
    const aiResult = document.getElementById('aiResult');
    const aiText = document.getElementById('aiText');
    const driveLinkBox = document.getElementById('driveLinkBox');

    btn.disabled = true;
    btn.innerText = "Procesando con IA Nativa en n8n y creando carpeta Google Drive...";
    aiResult.style.display = 'none';

    const formData = new FormData(e.target);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        aiResult.style.display = 'block';
        if (data && data.dictamenIA) {
          aiText.innerText = data.dictamenIA;
        } else {
          aiText.innerText = "Expediente recibido con éxito por n8n y procesado por la IA nativa.";
        }
        if (data && data.folderUrl) {
          driveLinkBox.innerHTML = '<a href="' + data.folderUrl + '" target="_blank" style="color:#10b981;font-weight:bold;text-decoration:underline;">Ver Carpeta en Google Drive</a>';
        }
        alert("¡Expediente auditado y registrado con éxito!");
      } else {
        alert("Expediente enviado a n8n (Status " + response.status + "). Revisa la consola de n8n.");
      }
    } catch (err) {
      alert("Expediente despachado. Verifique la conexión con n8n (" + N8N_WEBHOOK_URL + ")");
    } finally {
      btn.disabled = false;
      btn.innerText = "Auditar con IA Nativa & Archivar en Google Drive";
    }
  });

  controlUnicodigo();
  ajustarDocumentos();
</script>
</body>
</html>`;
  };

  const htaccessContent = `# HOSTINGER OPTIMIZED .HTACCESS FOR ACESS / MSP PORTAL
RewriteEngine On

# Forzar HTTPS en Hostinger
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Compresión GZIP para carga ultra rápida
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# Seguridad y CORS para Webhook n8n
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(generateHostingerHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const downloadHtmlFile = () => {
    const code = generateHostingerHtml();
    const blob = new Blob([code], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadHtaccessFile = () => {
    const blob = new Blob([htaccessContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '.htaccess');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePingWebhook = async () => {
    if (!customWebhookUrl) return;
    setIsPingingWebhook(true);
    setWebhookPingResult(null);

    try {
      const res = await fetch('/api/test-n8n-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: customWebhookUrl,
          payload: {
            ruc: testRuc,
            unicodigo: testUnicodigo,
            razon_social: testRazonSocial,
            tipologia: testTipologia,
            tipo_tramite: testTramite,
            user_sri: '1792451928001',
            pass_sri: '••••••••',
            user_acess: 'test_acess',
            pass_acess: '••••••••',
            test_mode: true
          }
        })
      });

      const data = await res.json();
      setWebhookPingResult(data);
    } catch (err: any) {
      setWebhookPingResult({
        ok: false,
        error: err.message
      });
    } finally {
      setIsPingingWebhook(false);
    }
  };

  const handleRunAiSimulation = async () => {
    setIsRunningAiSimulation(true);
    setAiSimulationResult(null);

    try {
      const res = await fetch('/api/simulate-native-ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razonSocial: testRazonSocial,
          ruc: testRuc,
          unicodigo: testUnicodigo,
          tipologia: testTipologia,
          tramite: testTramite,
          docsCount: testDocsCount,
          archivosPresentes: [
            'Cedula_Representante_Legal.pdf',
            'Planilla_IESS.pdf',
            'Cartera_de_Servicios.pdf',
            ...(testDocsCount >= 5 ? ['Permiso_Anterior.pdf', 'Registro_Mercantil.pdf'] : []),
            ...(testDocsCount >= 8 ? ['Senescyt_Personal.pdf', 'Planos_Arquitectonicos.pdf', 'Calibracion_Equipos.pdf'] : []),
            ...(testDocsCount >= 12 ? ['Desechos_Biopeligrosos.pdf', 'Manual_Bioseguridad.pdf', 'Bomberos_Permiso.pdf', 'Poliza_Responsabilidad.pdf'] : [])
          ]
        })
      });

      const data = await res.json();
      if (data.ok) {
        setAiSimulationResult({
          dictamen: data.dictamen,
          semaforo: data.semaforo,
          mode: data.mode,
          model: data.model
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningAiSimulation(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hero Master Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#03152B] via-[#041D3C] to-[#062952] border border-sky-500/30 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300">
                🚀 Puesta en Marcha en 10 Minutos
              </span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Hostinger cPanel/hPanel</span>
              <span>·</span>
              <span className="text-cyan-300 font-medium">n8n Advanced AI Nativa (LangChain + Gemini)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Migración a Hostinger & Automatizaciones con n8n IA
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Despliega tu portal institucional en la carpeta <code className="text-sky-300 font-mono px-1 py-0.5 bg-slate-900/80 rounded border border-slate-700">public_html</code> de Hostinger y conecta en minutos el pipeline que audita con la IA nativa de n8n, genera carpetas estructuradas en Google Drive y dispara alertas ejecutivas en Telegram.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={downloadWorkflowJson}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-md shadow-sky-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Workflow n8n (.json)</span>
            </button>
            <button
              onClick={downloadHtmlFile}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/30"
            >
              <Globe className="w-4 h-4" />
              <span>Descargar index.html Hostinger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 mb-8 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('diez_minutos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'diez_minutos'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Guía Paso a Paso (Cronómetro 10 Minutos)</span>
        </button>

        <button
          onClick={() => setActiveTab('flujo_ia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'flujo_ia'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Flujo n8n con IA Nativa (6 Nodos)</span>
        </button>

        <button
          onClick={() => setActiveTab('probador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'probador'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Play className="w-4 h-4 text-amber-400" />
          <span>Simulador de Auditoría IA & Ping Webhook</span>
        </button>

        <button
          onClick={() => setActiveTab('archivos_hostinger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'archivos_hostinger'
              ? 'bg-sky-600/20 text-sky-300 border border-sky-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>Archivos para Hostinger (public_html)</span>
        </button>
      </div>

      {/* TAB 1: 10-MINUTE STEP-BY-STEP FAST TRACK */}
      {activeTab === 'diez_minutos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#071326] border border-sky-500/30 flex flex-col justify-between relative group hover:border-sky-400 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/40">
                    FASE 1 · Minutos 0:00 a 3:00
                  </span>
                  <Cpu className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  1. Configurar n8n con la IA Nativa
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Importa el workflow prediseñado en tu n8n con soporte para nodos de LangChain e IA nativa.
                </p>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Abre tu panel de n8n y ve a <strong>Workflows &gt; Import from JSON</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Pega el JSON con la IA nativa (LangChain + Gemini / OpenAI).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Vincula tus credenciales de <strong>Google Drive OAuth2</strong> y <strong>Telegram</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>Enciende el switch <strong>Active</strong> y copia la URL del Webhook.</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={copyWorkflowJson}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-200 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 rounded-lg transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? '¡JSON Copiado!' : 'Copiar JSON para n8n'}</span>
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#071326] border border-emerald-500/30 flex flex-col justify-between relative group hover:border-emerald-400 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    FASE 2 · Minutos 3:00 a 6:00
                  </span>
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  2. Inyectar tu Webhook en index.html
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Ingresa tu URL de n8n para que el portal web de Hostinger dispare las solicitudes al endpoint correcto.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Tu URL de Webhook de n8n:
                    </label>
                    <input
                      type="text"
                      value={customWebhookUrl}
                      onChange={(e) => setCustomWebhookUrl(e.target.value)}
                      placeholder="https://n8n.tu-dominio.com/webhook/expedientes-acess"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono focus:border-emerald-400 outline-none"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    El archivo <code className="text-emerald-300 font-mono">index.html</code> incluirá automáticamente esta URL sin necesidad de programar nada.
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={downloadHtmlFile}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar index.html Listo</span>
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#071326] border border-cyan-500/30 flex flex-col justify-between relative group hover:border-cyan-400 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40">
                    FASE 3 · Minutos 6:00 a 10:00
                  </span>
                  <Upload className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  3. Subir a public_html en Hostinger
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Carga el archivo descargado en el Administrador de Archivos de Hostinger para poner en línea tu sistema.
                </p>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Entra a <strong>hPanel</strong> de Hostinger &gt; <strong>Sitios Web</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Abre <strong>Administrador de Archivos (File Manager)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Entra a la carpeta <code className="text-cyan-300 font-mono">public_html</code>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Arrastra <code className="text-cyan-300 font-mono">index.html</code> (y opcionalmente <code className="text-cyan-300 font-mono">.htaccess</code>).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>¡Abre tu dominio! Completa un formulario de prueba y verás el resultado en n8n, Drive y Telegram.</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('probador')}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 rounded-lg transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Probar Conexión Webhook Ahora</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Technical Summary Card */}
          <div className="p-6 rounded-2xl bg-[#0B1A30]/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Cómo funciona la IA Nativa en n8n?</span>
              </div>
              <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
                n8n integra internamente LangChain a través de sus nodos de <strong>Advanced AI</strong>. En este flujo, el nodo <code className="text-sky-300 font-mono">@n8n/n8n-nodes-langchain.chainLlm</code> ejecuta como motor de razonamiento el subnodo nativo <code className="text-emerald-300 font-mono">@n8n/n8n-nodes-langchain.lmChatGoogleGemini</code> (o OpenAI). Este modelo evalúa las 10 credenciales, coteja si la tipología (Consultorio 5 docs, Centro Médico 8 docs, Hospital 12 docs) cumple con los requerimientos de ACESS Ecuador, y emite un <strong>Dictamen Preventivo</strong> con semáforo de riesgo antes de registrarlo en Google Drive y Telegram.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('flujo_ia')}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all whitespace-nowrap shrink-0"
            >
              Ver Arquitectura del Flujo
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: N8N PIPELINE WITH NATIVE AI */}
      {activeTab === 'flujo_ia' && (
        <div className="space-y-6">
          {/* Version Selector & Copy Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">Versión del Flujo:</span>
              <button
                onClick={() => setSelectedWorkflowVersion('ia_nativa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedWorkflowVersion === 'ia_nativa'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✨ Con IA Nativa n8n (6 Nodos - Recomendado)
              </button>
              <button
                onClick={() => setSelectedWorkflowVersion('basico')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedWorkflowVersion === 'basico'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Clásico sin IA (4 Nodos)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyWorkflowJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? '¡Copiado!' : 'Copiar JSON'}</span>
              </button>
              <button
                onClick={downloadWorkflowJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .json</span>
              </button>
            </div>
          </div>

          {/* 6 Visual Nodes Grid */}
          <div className="p-6 rounded-2xl bg-[#071326] border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center justify-between">
              <span>Pipeline Automatizado en n8n</span>
              <span className="text-sky-400 font-mono text-[11px] normal-case">
                {selectedWorkflowVersion === 'ia_nativa' ? 'Pipeline Avanzado con IA Nativa y Respondedor' : 'Pipeline Estándar'}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Node 1: Webhook */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">1. Webhook HTTP</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Webhook_Hostinger</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Recibe vía <code className="text-sky-300 font-mono">POST /expedientes-acess</code> los datos multipart del formulario en Hostinger: RUC, unicódigo, 10 credenciales y archivos adjuntos.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  n8n-nodes-base.webhook (v1)
                </div>
              </div>

              {/* Node 2: Code Node */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">2. Javascript Code</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Parsear_Expediente</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Estandariza el nombre de la carpeta: <code className="text-amber-300 font-mono text-[10px]">RUC_UNICODIGO_RAZONSOCIAL</code>, valida conteo de documentos por tipología y sanitiza credenciales.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  n8n-nodes-base.code (v2)
                </div>
              </div>

              {/* Node 3: Native AI */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/50 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">3. IA Nativa (LangChain)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                    <span>Auditor_IA_Nativa</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nodo nativo <code className="text-cyan-300 font-mono text-[10px]">@n8n/chainLlm</code> conectado a <code className="text-cyan-300 font-mono text-[10px]">lmChatGoogleGemini</code>. Audita requisitos sanitarios y emite dictamen técnico con semáforo preventivo.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-400 font-mono">
                  @n8n/n8n-nodes-langchain.chainLlm
                </div>
              </div>

              {/* Node 4: Google Drive */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">4. Google Drive API</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Crear_Carpeta_Drive</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Crea automáticamente la carpeta en tu Google Drive corporativo y devuelve el enlace permanente <code className="text-emerald-300 font-mono text-[10px]">webViewLink</code>.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  n8n-nodes-base.googleDrive (v3)
                </div>
              </div>

              {/* Node 5: Telegram */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">5. Telegram Bot API</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Alerta_Telegram_IA</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Despacha en tiempo real al administrador un reporte con el dictamen de la IA nativa, semáforo de riesgo, bóveda de credenciales y link directo a Google Drive.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  n8n-nodes-base.telegram (v1.1)
                </div>
              </div>

              {/* Node 6: Respond to Webhook */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">6. Respond to Webhook</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Respuesta_Hostinger</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Devuelve un JSON con CORS habilitado al navegador del usuario en Hostinger con el dictamen de la IA y el enlace de la carpeta creada.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  n8n-nodes-base.respondToWebhook (v1.1)
                </div>
              </div>
            </div>
          </div>

          {/* Workflow JSON Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-slate-300">
                  Código JSON Listo para Pegar en n8n ({selectedWorkflowVersion === 'ia_nativa' ? 'IA Nativa' : 'Básico'})
                </span>
              </div>
              <button
                onClick={copyWorkflowJson}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-sky-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-[380px] leading-relaxed">
              {JSON.stringify(currentWorkflowData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE SIMULATOR & WEBHOOK TESTER */}
      {activeTab === 'probador' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Live AI Audit Simulator */}
            <div className="p-6 rounded-2xl bg-[#071326] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Simulador del Prompt de IA Nativa ACESS
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Gemini Flash / ACESS Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prueba cómo responderá el nodo de IA nativa de n8n al recibir un expediente según la tipología médica y cantidad de documentos:
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Razón Social:</label>
                  <input
                    type="text"
                    value={testRazonSocial}
                    onChange={(e) => setTestRazonSocial(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">RUC:</label>
                    <input
                      type="text"
                      value={testRuc}
                      onChange={(e) => setTestRuc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Unicódigo:</label>
                    <input
                      type="text"
                      value={testUnicodigo}
                      onChange={(e) => setTestUnicodigo(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Tipología:</label>
                    <select
                      value={testTipologia}
                      onChange={(e) => setTestTipologia(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                    >
                      <option value="consultorio">Consultorio (5 docs)</option>
                      <option value="centro_medico">Centro Médico (8 docs)</option>
                      <option value="farmacia">Farmacia (8 docs)</option>
                      <option value="hospital">Hospital del Día (12 docs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Docs Cargados ({testDocsCount}):</label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={testDocsCount}
                      onChange={(e) => setTestDocsCount(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-400 mt-2"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunAiSimulation}
                  disabled={isRunningAiSimulation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-md shadow-emerald-700/30 disabled:opacity-50"
                >
                  {isRunningAiSimulation ? (
                    <span>Evaluando con IA Nativa...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ejecutar Auditoría con IA Nativa</span>
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Result Box */}
              {aiSimulationResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">Dictamen Emitido:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        aiSimulationResult.semaforo === 'VERDE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : aiSimulationResult.semaforo === 'ROJO'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      SEMAFORO: {aiSimulationResult.semaforo}
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                    {aiSimulationResult.dictamen}
                  </pre>
                </div>
              )}
            </div>

            {/* Right Column: Webhook Ping Tester */}
            <div className="p-6 rounded-2xl bg-[#071326] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">
                    Probador de Conectividad con n8n
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                  HTTP POST Ping
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verifica si tu instancia de n8n está online y responde adecuadamente a las llamadas entrantes antes de subir los archivos a Hostinger:
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    URL de Webhook a Testear:
                  </label>
                  <input
                    type="text"
                    value={customWebhookUrl}
                    onChange={(e) => setCustomWebhookUrl(e.target.value)}
                    placeholder="https://n8n.tu-dominio.com/webhook/expedientes-acess"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sky-300 font-mono text-xs focus:border-sky-400 outline-none"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Payload enviado en el test:</div>
                  <div className="font-mono text-[10px] text-slate-400">
                    {JSON.stringify({
                      ruc: testRuc,
                      unicodigo: testUnicodigo,
                      razon_social: testRazonSocial,
                      tipologia: testTipologia,
                      tipo_tramite: testTramite
                    }, null, 2)}
                  </div>
                </div>

                <button
                  onClick={handlePingWebhook}
                  disabled={isPingingWebhook}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-md shadow-sky-600/30 disabled:opacity-50"
                >
                  {isPingingWebhook ? (
                    <span>Enviando paquete de prueba a n8n...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Ping de Prueba al Webhook</span>
                    </>
                  )}
                </button>
              </div>

              {/* Webhook Result Box */}
              {webhookPingResult && (
                <div
                  className={`p-4 rounded-xl border space-y-2 mt-4 animate-fade-in ${
                    webhookPingResult.ok
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{webhookPingResult.ok ? '✅ Conexión Exitosa con n8n' : '⚠️ Respuesta con Observación'}</span>
                    <span className="font-mono text-[10px]">
                      {webhookPingResult.status ? `HTTP ${webhookPingResult.status}` : ''}
                      {webhookPingResult.latencyMs ? ` · ${webhookPingResult.latencyMs}ms` : ''}
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {webhookPingResult.data
                      ? JSON.stringify(webhookPingResult.data, null, 2)
                      : webhookPingResult.error || 'Sin contenido en respuesta'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOSTINGER FILES READY FOR PUBLIC_HTML */}
      {activeTab === 'archivos_hostinger' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#071326] border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Paquete de Archivos para Hostinger (public_html)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Descarga estos 2 archivos y súbelos directamente a la raíz de tu dominio en Hostinger.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadHtmlFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar index.html</span>
                </button>
                <button
                  onClick={downloadHtaccessFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .htaccess</span>
                </button>
              </div>
            </div>

            {/* File 1: index.html preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">1. index.html</span>
                  <span className="text-[10px] text-slate-500">
                    (Formulario con 10 credenciales, soporte para 5 a 12 docs, y webhook inyectado)
                  </span>
                </div>
                <button
                  onClick={copyHtmlCode}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                >
                  {copiedHtml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHtml ? 'Copiado' : 'Copiar HTML'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72">
                {generateHostingerHtml()}
              </pre>
            </div>

            {/* File 2: .htaccess preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">2. .htaccess</span>
                  <span className="text-[10px] text-slate-500">
                    (Configuración recomendada para Hostinger con forzado HTTPS y CORS)
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(htaccessContent);
                    setCopiedHtaccess(true);
                    setTimeout(() => setCopiedHtaccess(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                >
                  {copiedHtaccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHtaccess ? 'Copiado' : 'Copiar .htaccess'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-48">
                {htaccessContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
