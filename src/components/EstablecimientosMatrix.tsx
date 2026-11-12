import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  KeyRound, 
  FileCheck, 
  FileX, 
  ExternalLink, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  EyeOff, 
  Copy, 
  FolderArchive,
  RefreshCw
} from 'lucide-react';
import { Establishment, StatusLevel } from '../types/jarvis';

interface EstablecimientosMatrixProps {
  establishments: Establishment[];
  onOpenNewExpediente: () => void;
  onRefreshData: () => void;
}

export const EstablecimientosMatrix: React.FC<EstablecimientosMatrixProps> = ({
  establishments,
  onOpenNewExpediente,
  onRefreshData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusLevel | 'pendientes'>('all');
  const [selectedVaultEst, setSelectedVaultEst] = useState<Establishment | null>(null);
  const [showVaultPasswords, setShowVaultPasswords] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filters
  const filteredEsts = establishments.filter((est) => {
    const matchesSearch =
      est.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.ruc.includes(searchTerm) ||
      est.unicodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.tramiteRef.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'pendientes') return est.reenvioPendiente || !est.docDocx || !est.docPng;
    return est.colorEstado === statusFilter;
  });

  const rojosCount = establishments.filter((e) => e.colorEstado === 'rojo').length;
  const amarillosCount = establishments.filter((e) => e.colorEstado === 'amarillo').length;
  const verdesCount = establishments.filter((e) => e.colorEstado === 'verde').length;
  const pendientesCount = establishments.filter((e) => e.reenvioPendiente || !e.docDocx || !e.docPng).length;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const exportCsv = () => {
    const headers = ['Razon Social', 'RUC', 'Unicodigo', 'Tramite', 'Tipologia', 'DOCX', 'PNG', 'Carpeta Google Drive', 'Inspeccion', 'Dias Restantes', 'Estado', 'Accion'];
    const rows = establishments.map((e) => [
      `"${e.razonSocial}"`,
      `"${e.ruc}"`,
      `"${e.unicodigo}"`,
      `"${e.tramiteRef}"`,
      `"${e.tipologia}"`,
      e.docDocx ? 'SI' : 'NO',
      e.docPng ? 'SI' : 'NO',
      `"${e.driveFolderLink || 'Organizado'}"`,
      `"${e.fechaInspeccion}"`,
      e.diasRestantes,
      `"${e.estadoRevision}"`,
      `"${e.accionRequerida.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `matriz_jarvis_acess_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-1">
            <span>Matriz SQLite: jarvis_control.db</span>
            <span aria-hidden="true">·</span>
            <span>Modo WAL</span>
            <span aria-hidden="true">·</span>
            <span>Auditoría Sanitaria ACESS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Matriz de Control y Perfiles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Seguimiento de {establishments.length} establecimientos, expedientes DOCX/PNG, inspecciones y carpetas en Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewExpediente}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors"
          >
            <span>+ Nuevo Expediente</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            statusFilter === 'all' 
              ? 'bg-[#1E293B] border-sky-500/80 shadow-md' 
              : 'bg-[#1E293B]/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs text-slate-400">Total Monitoreados</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {establishments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Establecimientos activos</div>
        </div>

        <div 
          onClick={() => setStatusFilter('rojo')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            statusFilter === 'rojo' 
              ? 'bg-red-950/40 border-red-500/80 shadow-md' 
              : 'bg-[#1E293B]/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs text-red-300 flex items-center justify-between">
            <span>Críticos (Rojo)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1 tabular-nums">
            {rojosCount}
          </div>
          <div className="text-[11px] text-red-300/70 mt-1">&lt; 15 días o con faltante</div>
        </div>

        <div 
          onClick={() => setStatusFilter('amarillo')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            statusFilter === 'amarillo' 
              ? 'bg-amber-950/40 border-amber-500/80 shadow-md' 
              : 'bg-[#1E293B]/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs text-amber-300 flex items-center justify-between">
            <span>Próximos (Amarillo)</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {amarillosCount}
          </div>
          <div className="text-[11px] text-amber-300/70 mt-1">15 - 30 días para inspección</div>
        </div>

        <div 
          onClick={() => setStatusFilter('verde')}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            statusFilter === 'verde' 
              ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md' 
              : 'bg-[#1E293B]/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs text-emerald-300 flex items-center justify-between">
            <span>Al Día (Verde)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {verdesCount}
          </div>
          <div className="text-[11px] text-emerald-300/70 mt-1">&gt; 30 días de vigencia</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por RUC, nombre o trámite..."
            className="w-full bg-[#1E293B] border border-slate-800 rounded px-3 py-2 pl-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded border border-slate-800 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({establishments.length})
          </button>
          <button
            onClick={() => setStatusFilter('rojo')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              statusFilter === 'rojo' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rojo ({rojosCount})
          </button>
          <button
            onClick={() => setStatusFilter('amarillo')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              statusFilter === 'amarillo' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Amarillo ({amarillosCount})
          </button>
          <button
            onClick={() => setStatusFilter('verde')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              statusFilter === 'verde' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Verde ({verdesCount})
          </button>
          <button
            onClick={() => setStatusFilter('pendientes')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              statusFilter === 'pendientes' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pendientes ({pendientesCount})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#1E293B]/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1E293B] text-slate-300 font-semibold border-b border-slate-800">
                <th className="py-3 px-4">Establecimiento & Perfil</th>
                <th className="py-3 px-3">RUC & Unicódigo</th>
                <th className="py-3 px-3">Trámite</th>
                <th className="py-3 px-3 text-center">Docs (DOCX / PNG)</th>
                <th className="py-3 px-3 text-center">Google Drive</th>
                <th className="py-3 px-3">Inspección</th>
                <th className="py-3 px-3">Revisión</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEsts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron establecimientos con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredEsts.map((est) => (
                  <tr key={est.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & Perfil */}
                    <td className="py-3 px-4 max-w-[240px]">
                      <div className="font-semibold text-slate-100 truncate">{est.razonSocial}</div>
                      <div className="text-[11px] text-slate-400 truncate">{est.perfil}</div>
                    </td>

                    {/* RUC & Unicodigo */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                      <div className="text-slate-200">{est.ruc}</div>
                      <div className="text-sky-400">{est.unicodigo}</div>
                    </td>

                    {/* Tramite */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono text-slate-300">{est.tramiteRef}</span>
                      <div className="text-[10px] text-slate-500 uppercase">{est.tipoTramite}</div>
                    </td>

                    {/* Documentacion */}
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                        <span className={est.docDocx ? 'text-emerald-400' : 'text-red-400'}>
                          {est.docDocx ? 'DOCX' : 'DOCX ✗'}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className={est.docPng ? 'text-emerald-400' : 'text-red-400'}>
                          {est.docPng ? 'PNG' : 'PNG ✗'}
                        </span>
                      </div>
                    </td>

                    {/* Google Drive */}
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      {est.driveFolderLink ? (
                        <a
                          href={est.driveFolderLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono hover:bg-emerald-900/60 transition-colors"
                        >
                          <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Drive ↗</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 text-[11px]">En proceso</span>
                      )}
                    </td>

                    {/* Inspección */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono text-slate-200 tabular-nums">{est.fechaInspeccion}</div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        {est.diasRestantes} día(s)
                      </div>
                    </td>

                    {/* Estado de Revisión */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          est.colorEstado === 'rojo'
                            ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                            : est.colorEstado === 'amarillo'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        }`}
                      >
                        {est.estadoRevision}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVaultEst(est)}
                          title="Bóveda de 10 Credenciales Institucionales"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        {est.driveFolderLink && (
                          <a
                            href={est.driveFolderLink}
                            target="_blank"
                            rel="noreferrer"
                            title="Carpeta en Google Drive"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                          >
                            <FolderArchive className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credential Vault Modal */}
      {selectedVaultEst && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-lg max-w-xl w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">
                  Bóveda de Credenciales · {selectedVaultEst.razonSocial}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVaultEst(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <div className="my-3 text-xs text-slate-400">
              RUC: <span className="font-mono text-slate-200">{selectedVaultEst.ruc}</span> · Unicódigo:{' '}
              <span className="font-mono text-slate-200">{selectedVaultEst.unicodigo}</span>
            </div>

            <div className="flex justify-end mb-3">
              <button
                onClick={() => setShowVaultPasswords(!showVaultPasswords)}
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
              >
                {showVaultPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showVaultPasswords ? 'Ocultar contraseñas' : 'Revelar contraseñas'}</span>
              </button>
            </div>

            {/* Credential Grid */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {/* 1. Municipio */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-sky-400 mb-1">1. Municipio</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Usuario:</span>
                    <span className="font-mono">{selectedVaultEst.credentials?.user_muni || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Clave:</span>
                    <span className="font-mono">
                      {showVaultPasswords ? (selectedVaultEst.credentials?.pass_muni || '-') : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Patente */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-sky-400 mb-1">2. Patente</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Usuario:</span>
                    <span className="font-mono">{selectedVaultEst.credentials?.user_patente || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Clave:</span>
                    <span className="font-mono">
                      {showVaultPasswords ? (selectedVaultEst.credentials?.pass_patente || '-') : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Curso */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-sky-400 mb-1">3. Curso</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Usuario:</span>
                    <span className="font-mono">{selectedVaultEst.credentials?.user_curso || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Clave:</span>
                    <span className="font-mono">
                      {showVaultPasswords ? (selectedVaultEst.credentials?.pass_curso || '-') : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Ascel */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-sky-400 mb-1">4. Ascel</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Usuario:</span>
                    <span className="font-mono">{selectedVaultEst.credentials?.user_ascel || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Clave:</span>
                    <span className="font-mono">
                      {showVaultPasswords ? (selectedVaultEst.credentials?.pass_ascel || '-') : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. SAS */}
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                <div className="font-semibold text-sky-400 mb-1">5. Superintendencia de Compañías / SAS</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Usuario:</span>
                    <span className="font-mono">{selectedVaultEst.credentials?.user_sas || 'sas_supercias'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Clave:</span>
                    <span className="font-mono">
                      {showVaultPasswords ? (selectedVaultEst.credentials?.pass_sas || 'SuperCiasPass!') : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Almacenado bajo chmod 600 jarvis:jarvis en Debian
              </span>
              <button
                onClick={() => setSelectedVaultEst(null)}
                className="px-3 py-1.5 text-xs text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors"
              >
                Cerrar Bóveda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
