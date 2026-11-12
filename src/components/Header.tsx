import React, { useState } from 'react';
import { Share2, Check, FolderUp, Layers, HardDrive } from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewExpediente: () => void;
  onOpenExportHtml: () => void;
  onTriggerCronCycle: () => void;
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onAuthChange,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyClientLink = () => {
    // Current public URL or default shared link
    const currentUrl = window.location.origin;
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header className="border-b border-slate-800/80 bg-[#040C1E]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20 py-2">
          {/* Zone 1: Brand Wordmark & Corporate Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-slate-700/60 flex items-center justify-center shrink-0">
              <img 
                src="/assets/aistudio/Logo_1x1_d0f68eff.png" 
                alt="Aprobación 360" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white whitespace-nowrap leading-tight">
                CENTRO DE <span className="text-emerald-400">ESPECIALIDADES</span>
              </span>
              <span className="text-[10px] font-bold text-sky-400 tracking-wider whitespace-nowrap uppercase">
                Registro de Información General · ACESS
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-4 lg:gap-5 text-sm font-medium">
            <button
              onClick={() => setActiveTab('formulario')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'formulario' 
                  ? 'border-emerald-400 text-white font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderUp className="w-4 h-4 text-emerald-400" />
              <span>Registro General</span>
            </button>

            <button
              onClick={() => setActiveTab('matriz')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'matriz' 
                  ? 'border-emerald-400 text-white font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Matriz</span>
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'drive' 
                  ? 'border-emerald-400 text-white font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className="flex items-center gap-1.5">
                <span>Google Drive</span>
                {currentUser && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hostinger-n8n')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'hostinger-n8n' 
                  ? 'border-sky-400 text-white font-bold' 
                  : 'border-transparent text-sky-300 hover:text-white'
              }`}
            >
              <span className="relative flex items-center gap-1.5">
                <span>Hostinger & n8n IA</span>
                <span className="px-1.5 py-0.2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-[9px] font-extrabold rounded-full">
                  10 min
                </span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('telegram')}
              className={`hover:text-white transition-colors whitespace-nowrap pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'telegram' 
                  ? 'border-emerald-400 text-white font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Bot Telegram</span>
            </button>
          </nav>

          {/* Zone 3: Actions + Google Drive Authentication */}
          <div className="flex items-center gap-3 shrink-0">
            <GoogleSignInButton
              currentUser={currentUser}
              onAuthChange={onAuthChange}
            />

            <button
              onClick={handleCopyClientLink}
              title="Copiar link para enviar a clientes y que suban sus documentos"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0B2545] hover:bg-[#0E325D] border border-sky-500/40 rounded-lg transition-all shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copiado</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
