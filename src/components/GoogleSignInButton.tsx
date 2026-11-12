import React, { useState } from 'react';
import { googleSignIn, googleSignOut, getCurrentUser } from '../lib/googleAuth';
import { User } from 'firebase/auth';
import { LogOut, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';

interface GoogleSignInButtonProps {
  currentUser: User | null;
  onAuthChange?: (user: User | null) => void;
  compact?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  currentUser,
  onAuthChange,
  compact = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result && onAuthChange) {
        onAuthChange(result.user);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setError(err?.message || 'Error al conectar con Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await googleSignOut();
      if (onAuthChange) {
        onAuthChange(null);
      }
    } catch (err: any) {
      console.error('Sign-out error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    if (compact) {
      return (
        <div className="flex items-center gap-2">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Google User'}
              className="w-7 h-7 rounded-full border border-emerald-400 object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border border-emerald-400">
              {(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}
            </div>
          )}
          <button
            onClick={handleSignOut}
            disabled={loading}
            title="Cerrar sesión de Google"
            className="text-slate-400 hover:text-rose-400 transition-colors p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 bg-[#001f35]/90 border border-emerald-500/50 rounded-xl px-3 py-1.5 backdrop-blur-md">
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || 'Google User'}
            className="w-7 h-7 rounded-full border border-emerald-400 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border border-emerald-400">
            {(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}
          </div>
        )}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white truncate max-w-[140px]">
              {currentUser.displayName || 'Usuario Google'}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1 rounded border border-emerald-500/40">
              <CheckCircle2 className="w-2.5 h-2.5" /> Drive
            </span>
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
            {currentUser.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          title="Desconectar Google Drive"
          className="ml-1 text-slate-400 hover:text-rose-300 transition-colors p-1"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      {/* Official Sign in with Google Button as prescribed by Google Workspace Integration skill */}
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="gsi-material-button inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg shadow-sm border border-slate-300 transition-all hover:shadow active:scale-95 disabled:opacity-50"
      >
        <div className="gsi-material-button-icon w-4 h-4 shrink-0 flex items-center justify-center">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            style={{ display: 'block', width: '16px', height: '16px' }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </div>
        <span className="whitespace-nowrap font-medium text-slate-800">
          {loading ? 'Conectando...' : 'Conectar con Google Drive'}
        </span>
      </button>

      {error && (
        <span className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
};
