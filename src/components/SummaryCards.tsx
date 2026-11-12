import React from 'react';
import { Establishment } from '../types/jarvis';
import { Building2, Clock, CheckCircle2 } from 'lucide-react';

export const SummaryCards: React.FC<{ establishments: Establishment[] }> = ({ establishments }) => {
    const activos = establishments.length;
    const pendientes = establishments.filter(e => e.estadoRevision === 'CRÍTICA' || e.reenvioPendiente).length;
    const completados = establishments.filter(e => e.estadoRevision === 'AL DÍA').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-panel p-5 rounded-2xl interactive-card flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-sky-300 font-bold text-xs uppercase tracking-wider">Centro de Especialidades Activos</div>
                    <div className="text-2xl font-black text-white">{activos}</div>
                </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl interactive-card flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-amber-300 font-bold text-xs uppercase tracking-wider">Trámites en Revisión</div>
                    <div className="text-2xl font-black text-white">{pendientes}</div>
                </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl interactive-card flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-emerald-300 font-bold text-xs uppercase tracking-wider">Permisos Sanitarios Al Día</div>
                    <div className="text-2xl font-black text-white">{completados}</div>
                </div>
            </div>
        </div>
    );
};
