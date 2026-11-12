import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Send, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Cpu, 
  Clock, 
  FolderLock,
  Download,
  Smartphone,
  Layers,
  Sparkles,
  FileCode,
  Bell
} from 'lucide-react';
import { Establishment } from '../types/jarvis';
import { SaccsVaultManager } from './SaccsVaultManager';
import { AcessNotificationCard } from './AcessNotificationCard';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/initialData';

interface SaccsAutomationModuleProps {
  establishments: Establishment[];
}

export const SaccsAutomationModule: React.FC<SaccsAutomationModuleProps> = ({ establishments }) => {
  const [activeTab, setActiveTab] = useState<'boveda' | 'notificacion' | 'consola' | 'apps_script' | 'codigo'>('boveda');

  // Vault & Session State
  const [selectedUnicodigo, setSelectedUnicodigo] = useState('17D01-001234');
  const [captchaMode, setCaptchaMode] = useState<'telegram_manual' | '2captcha' | 'capsolver' | 'hibrido'>('telegram_manual');
  const [providerApiKey, setProviderApiKey] = useState('');
  const [sessionTtl, setSessionTtl] = useState(6);
  const [activeSessions, setActiveSessions] = useState<Record<string, any>>({});
  
  // Interactive Challenge State
  const [currentChallenge, setCurrentChallenge] = useState<{ id: string; code: string; unicodigo: string } | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [challengeResult, setChallengeResult] = useState<{ ok: boolean; message: string; session?: any } | null>(null);
  const [sendToTelegram, setSendToTelegram] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load status from backend
  useEffect(() => {
    fetch('/api/saccs/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          if (data.config?.captchaMode) setCaptchaMode(data.config.captchaMode);
          if (data.sessions) setActiveSessions(data.sessions);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerateChallenge = async () => {
    setIsGeneratingChallenge(true);
    setChallengeResult(null);
    setCaptchaInput('');
    try {
      const res = await fetch('/api/saccs/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unicodigo: selectedUnicodigo,
          dispatchToTelegram: sendToTelegram
        })
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentChallenge(data.challenge);
      }
    } catch (err: any) {
      setChallengeResult({ ok: false, message: `Error generando desafío: ${err.message}` });
    } finally {
      setIsGeneratingChallenge(false);
    }
  };

  const handleSolveChallenge = async (solutionText?: string) => {
    const textToSubmit = solutionText !== undefined ? solutionText : captchaInput;
    if (!textToSubmit.trim()) return;

    setIsSolving(true);
    try {
      const res = await fetch('/api/saccs/solve-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solution: textToSubmit.trim(),
          unicodigo: selectedUnicodigo
        })
      });
      const data = await res.json();
      if (data.ok) {
        setChallengeResult({ ok: true, message: data.message, session: data.session });
        setCurrentChallenge(null);
        // Refresh sessions list
        fetch('/api/saccs/status')
          .then((r) => r.json())
          .then((d) => d.ok && setActiveSessions(d.sessions));
      } else {
        setChallengeResult({ ok: false, message: data.error || 'Código incorrecto' });
      }
    } catch (err: any) {
      setChallengeResult({ ok: false, message: `Error: ${err.message}` });
    } finally {
      setIsSolving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/saccs/save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captchaMode,
          providerApiKey,
          sessionTtlHours: sessionTtl
        })
      });
      alert('Configuración de bóveda y captcha guardada con éxito.');
    } catch {}
  };

  const pythonSnippet = `# Integración de saccs_auth en jarvis_engine.py
from saccs_auth import SaccsVault, CaptchaManager, SaccsSessionClient

def ejecutar_auditoria_saccs(unicodigo, config, secrets):
    # 1. Inicializar bóveda segura AES-256-GCM
    vault = SaccsVault(master_password=secrets.get('vault_master_key'))

    # 2. Configurar resolvedor de captcha (manual vía Telegram o proveedor)
    captcha_mgr = CaptchaManager(
        mode=config.get('captcha_mode', 'telegram_manual'),
        provider_api_key=secrets.get('captcha_provider_api_key'),
        telegram_token=secrets.get('telegram_token'),
        admin_chat_id=secrets.get('admin_chat_id')
    )

    # 3. Cliente de sesión con TTL de 6h
    session_client = SaccsSessionClient(vault, captcha_mgr)

    # 4. Obtener sesión activa o autenticar automáticamente
    login_ok = session_client.login(
        unicodigo=unicodigo,
        user_acess=secrets.get('saccs_user'),
        pass_acess=secrets.get('saccs_pass')
    )

    if login_ok:
        cookies = session_client.get_valid_session(unicodigo)
        # Proceder a descargar estados de trámites y actas de inspección...
`;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-1">
            <span>Portal SACCS (ACESS / MSP)</span>
            <span aria-hidden="true">·</span>
            <span>Bóveda AES-256-GCM</span>
            <span aria-hidden="true">·</span>
            <span>Gestor de Captcha & Sesiones</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Módulo de Automatización de Login SACCS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Autenticación segura para establecimientos de salud con resolución de captchas asistida por Telegram o proveedores y almacenamiento cifrado de sesiones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-sky-300">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span>Vault: AES-256-GCM</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('boveda')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'boveda' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>SaccsVaultManager (10 Cuentas Reales)</span>
        </button>
        <button
          onClick={() => setActiveTab('notificacion')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'notificacion' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notificación ACESS (Jessica Morales)</span>
        </button>
        <button
          onClick={() => setActiveTab('consola')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'consola' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Consola Captcha & Login</span>
        </button>
        <button
          onClick={() => setActiveTab('apps_script')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'apps_script' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Apps Script (Sheets & Drive)</span>
        </button>
        <button
          onClick={() => setActiveTab('codigo')}
          className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'codigo' ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>saccs_auth.py (Debian)</span>
        </button>
      </div>

      {/* TAB 1: Bóveda de Credenciales SaccsVaultManager */}
      {activeTab === 'boveda' && <SaccsVaultManager />}

      {/* TAB 2: Notificación Canónica ACESS (Jessica Morales Villacis) */}
      {activeTab === 'notificacion' && <AcessNotificationCard />}

      {/* TAB 3: Consola interactiva */}
      {activeTab === 'consola' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Login Trigger Column */}
            <div className="p-5 rounded-lg bg-[#1E293B]/80 border border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-sky-400" />
                <span>1. Establecimiento a Autenticar</span>
              </h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Seleccionar Establecimiento:</label>
                <select
                  value={selectedUnicodigo}
                  onChange={(e) => setSelectedUnicodigo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono focus:outline-none focus:border-sky-500"
                >
                  {establishments.map((est) => (
                    <option key={est.id} value={est.unicodigo}>
                      {est.unicodigo} - {est.razonSocial.slice(0, 32)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Modo Captcha:</span>
                  <span className="font-semibold text-sky-300 uppercase">{captchaMode.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vigencia de sesión (TTL):</span>
                  <span className="font-mono text-slate-300">{sessionTtl} horas</span>
                </div>
                <div className="flex justify-between">
                  <span>Cifrado de Bóveda:</span>
                  <span className="font-mono text-emerald-400">AES-256-GCM</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToTelegram}
                    onChange={(e) => setSendToTelegram(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-sky-600 focus:ring-0"
                  />
                  <span>Enviar desafío al bot de Telegram en tiempo real</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleGenerateChallenge}
                disabled={isGeneratingChallenge}
                className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isGeneratingChallenge ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Conectando con SACCS...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Iniciar Autenticación SACCS</span>
                  </>
                )}
              </button>
            </div>

            {/* Captcha Box Column */}
            <div className="md:col-span-2 p-5 rounded-lg bg-[#1E293B]/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>2. Resolución del Captcha SACCS</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  El captcha del portal SACCS se captura y se envía de forma transparente al canal administrativo de Telegram o a la API de resolución.
                </p>

                {currentChallenge ? (
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Desafío para: <strong className="text-sky-300">{currentChallenge.unicodigo}</strong>
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          Escribe el texto de la imagen o responde desde Telegram:
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-950 text-amber-300 border border-amber-800">
                        PENDIENTE DE RESOLUCIÓN
                      </span>
                    </div>

                    {/* Simulated Captcha Visual Image with Noise and Font */}
                    <div className="p-4 bg-slate-900 border border-slate-700 rounded flex items-center justify-center select-none">
                      <div className="relative px-8 py-3 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded border border-slate-600 shadow-inner overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px]" />
                        <div className="text-2xl font-mono font-black tracking-widest text-sky-300 drop-shadow-md transform -skew-x-6">
                          {currentChallenge.code}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        placeholder="Ingresa los 5 caracteres..."
                        maxLength={6}
                        className="flex-1 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono tracking-widest uppercase focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSolveChallenge()}
                        disabled={isSolving || !captchaInput.trim()}
                        className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded transition-colors whitespace-nowrap"
                      >
                        {isSolving ? 'Validando...' : 'Validar y Login'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSolveChallenge(currentChallenge.code)}
                        className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
                        title="Simular resolución instantánea para prueba"
                      >
                        Auto-Resolver
                      </button>
                    </div>

                    {sendToTelegram && (
                      <div className="text-[11px] text-sky-400/90 flex items-center gap-1.5 pt-1">
                        <Bot className="w-3.5 h-3.5" />
                        <span>También puedes responder desde tu celular en Telegram escribiendo: <code className="font-mono text-white">/c {currentChallenge.code}</code></span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 rounded-lg bg-slate-900/50 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                    <KeyRound className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p>No hay un desafío de captcha en curso.</p>
                    <p className="text-slate-500 mt-1">
                      Haz clic en <strong>Iniciar Autenticación SACCS</strong> para generar un handshake de prueba.
                    </p>
                  </div>
                )}

                {/* Challenge Result Toast */}
                {challengeResult && (
                  <div
                    className={`mt-4 p-3 rounded text-xs flex items-start gap-2 ${
                      challengeResult.ok
                        ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200'
                        : 'bg-red-950/60 border border-red-800/80 text-red-200'
                    }`}
                  >
                    {challengeResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">{challengeResult.message}</div>
                      {challengeResult.session && (
                        <div className="mt-1 text-[11px] font-mono text-emerald-300/90">
                          Cookie: {challengeResult.session.cookie} · Expira: {challengeResult.session.expiraEn}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Sessions Counter */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Sesiones activas en bóveda: <strong className="text-white font-mono">{Object.keys(activeSessions).length}</strong></span>
                <span className="text-[11px] text-slate-500">Reutilización activa · Cero relogins innecesarios</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Google Apps Script (Sheets & Drive) */}
      {activeTab === 'apps_script' && (
        <div className="p-6 rounded-lg bg-[#1E293B]/70 border border-slate-800 space-y-4 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Aplicación Web Google Apps Script (Sheets & Drive)</span>
              </h3>
              <p className="text-slate-400 mt-1">
                Código para <code className="text-emerald-300 font-mono">Código.gs</code> e <code className="text-emerald-300 font-mono">Index.html</code> para captura de equipos biomédicos, personal y áreas en Google Sheets y carpetas Drive.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
                alert('¡Código de Apps Script copiado al portapapeles!');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Código.gs</span>
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
            {GOOGLE_APPS_SCRIPT_CODE}
          </pre>
        </div>
      )}

      {/* TAB 5: Código saccs_auth.py */}
      {activeTab === 'codigo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Archivo disponible en <code className="text-sky-300 font-mono">/scripts/saccs_auth.py</code>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(pythonSnippet);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? '¡Copiado!' : 'Copiar Snippet de Integración'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[460px] leading-relaxed">
            {pythonSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
