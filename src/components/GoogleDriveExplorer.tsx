import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileText, 
  Search, 
  UploadCloud, 
  FolderPlus, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  HardDrive, 
  ChevronRight, 
  AlertTriangle, 
  Check, 
  FileUp, 
  FolderTree, 
  Eye, 
  ShieldCheck,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { 
  listDriveFiles, 
  createDriveFolder, 
  createInstitutionalDossier, 
  uploadFileToDrive, 
  deleteDriveItem, 
  getDriveAbout, 
  DriveItem, 
  DriveStorageInfo 
} from '../lib/googleDrive';
import { GoogleSignInButton } from './GoogleSignInButton';
import { User } from 'firebase/auth';

interface GoogleDriveExplorerProps {
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
}

export const GoogleDriveExplorer: React.FC<GoogleDriveExplorerProps> = ({
  currentUser,
  onAuthChange,
}) => {
  const [files, setFiles] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id?: string; name: string }>>([
    { name: 'Mi Unidad (Google Drive)' },
  ]);
  const [storageInfo, setStorageInfo] = useState<DriveStorageInfo | null>(null);

  // New folder modal
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Quick Dossier generator modal
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [dossierUnicodigo, setDossierUnicodigo] = useState('17D02-005678');
  const [dossierRazonSocial, setDossierRazonSocial] = useState('Centro Quirúrgico Metropolitano');
  const [isCreatingDossier, setIsCreatingDossier] = useState(false);
  const [dossierSuccessLink, setDossierSuccessLink] = useState<string | null>(null);

  // Upload file state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Destructive delete confirmation modal (Mandatory User Confirmation)
  const [itemToDelete, setItemToDelete] = useState<DriveItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadDriveData();
      loadStorageInfo();
    } else {
      setFiles([]);
      setStorageInfo(null);
    }
  }, [currentUser, currentFolderId]);

  const loadDriveData = async (query?: string) => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const items = await listDriveFiles(currentFolderId, query || searchQuery);
      setFiles(items);
    } catch (err: any) {
      console.error('Error loading Google Drive files:', err);
      setError(err?.message || 'Error al comunicarse con Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const info = await getDriveAbout();
      setStorageInfo(info);
    } catch (e) {
      console.warn('Could not fetch storage info:', e);
    }
  };

  const handleNavigateFolder = (folder: DriveItem) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setSearchQuery('');
  };

  const handleBreadcrumbClick = (index: number) => {
    const target = breadcrumbs[index];
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setCurrentFolderId(target.id);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDriveData(searchQuery);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    setError(null);
    try {
      await createDriveFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setShowNewFolderModal(false);
      await loadDriveData();
    } catch (err: any) {
      setError(err?.message || 'Error al crear la carpeta en Google Drive');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dossierUnicodigo.trim() || !dossierRazonSocial.trim()) return;
    setIsCreatingDossier(true);
    setError(null);
    try {
      const result = await createInstitutionalDossier(
        dossierUnicodigo.trim(),
        dossierRazonSocial.trim()
      );
      setDossierSuccessLink(result.rootFolderLink);
      await loadDriveData();
    } catch (err: any) {
      setError(err?.message || 'Error al crear la estructura de expediente en Google Drive');
    } finally {
      setIsCreatingDossier(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      const targetParent = currentFolderId;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (targetParent) {
          await uploadFileToDrive(targetParent, file, file.name, file.type || 'application/octet-stream');
        } else {
          // If in root, create inside root
          const rootFolder = await createDriveFolder('Expedientes_ACESS_Subidas');
          await uploadFileToDrive(rootFolder.id, file, file.name, file.type || 'application/octet-stream');
        }
      }
      setUploadSuccessMessage(`Subido(s) ${selectedFiles.length} archivo(s) a Google Drive.`);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
      await loadDriveData();
    } catch (err: any) {
      setError(err?.message || 'Error al subir archivo a Google Drive');
    } finally {
      setIsUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  // Explicit user confirmation modal for destructive operations
  const confirmDeleteAction = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteDriveItem(itemToDelete.id);
      setItemToDelete(null);
      await loadDriveData();
    } catch (err: any) {
      setError(err?.message || 'Error al eliminar el elemento en Google Drive');
    } finally {
      setIsDeleting(false);
    }
  };

  const getFileIcon = (item: DriveItem) => {
    if (item.isFolder) {
      return <Folder className="w-5 h-5 text-sky-400 shrink-0" />;
    }
    if (item.mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-400 shrink-0" />;
    }
    if (item.mimeType.includes('image')) {
      return <ImageIcon className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
    if (item.mimeType.includes('spreadsheet') || item.name.endsWith('.csv') || item.name.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-400 shrink-0" />;
    }
    return <FileCode className="w-5 h-5 text-slate-400 shrink-0" />;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Card */}
      <div className="bg-[#030e24]/90 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Nube Segura Google Workspace</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400">Google Drive API v3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gestor de Archivos y Carpetas en Google Drive
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Explora, sincroniza y estructura expedientes sanitarios directamente en tu almacenamiento de Google Drive con las normas de nomenclatura de ACESS.
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <GoogleSignInButton currentUser={currentUser} onAuthChange={onAuthChange} />
          </div>
        </div>

        {/* Account Info and Storage Bar */}
        {currentUser && storageInfo?.storageQuota && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Cuenta activa:</span>
              <span className="font-mono text-emerald-300 font-semibold">{currentUser.email}</span>
            </div>
            {storageInfo.storageQuota.usage && storageInfo.storageQuota.limit && (
              <div className="flex items-center gap-2 text-slate-400">
                <span>Almacenamiento:</span>
                <span className="font-mono text-white">
                  {(parseInt(storageInfo.storageQuota.usage, 10) / (1024 * 1024 * 1024)).toFixed(2)} GB
                  {' / '}
                  {(parseInt(storageInfo.storageQuota.limit, 10) / (1024 * 1024 * 1024)).toFixed(0)} GB
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {!currentUser ? (
        /* Not logged in view */
        <div className="bg-[#020b1b]/80 border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-8 h-8 text-sky-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Conecta tu cuenta de Google Drive
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Inicia sesión con Google para permitir que el sistema cree carpetas nativas estructuradas, cargue resoluciones sanitarias y vincule directamente tus expedientes de ACESS.
          </p>
          <div className="flex justify-center">
            <GoogleSignInButton currentUser={currentUser} onAuthChange={onAuthChange} />
          </div>
        </div>
      ) : (
        /* Main Drive Explorer Interface */
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-[#030e24]/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar archivos en Google Drive..."
                className="w-full pl-9 pr-4 py-2 bg-[#020712] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowDossierModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>+ Estructura ACESS</span>
              </button>

              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#002B49] hover:bg-[#003860] border border-sky-500/50 text-sky-200 font-semibold text-xs rounded-xl transition-all"
              >
                <FolderPlus className="w-3.5 h-3.5 text-sky-400" />
                <span>Nueva Carpeta</span>
              </button>

              <label className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl cursor-pointer border border-slate-700 transition-all">
                <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isUploading ? 'Subiendo...' : 'Subir Archivo'}</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => loadDriveData()}
                disabled={loading}
                title="Actualizar listado"
                className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </span>
              <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">✕</button>
            </div>
          )}

          {uploadSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}

          {/* Breadcrumbs Path Navigation */}
          <div className="flex items-center gap-1 text-xs text-slate-400 overflow-x-auto pb-1">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={`hover:text-white transition-colors whitespace-nowrap px-2 py-1 rounded-md ${
                    idx === breadcrumbs.length - 1
                      ? 'text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/30'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {bc.name}
                </button>
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Files List Table */}
          <div className="bg-[#030e24]/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#020713] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nombre en Google Drive</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Tamaño</th>
                    <th className="py-3 px-4">Última Modificación</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
                        <span>Sincronizando con Google Drive...</span>
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <HardDrive className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <span>No se encontraron archivos en este directorio de Google Drive.</span>
                      </td>
                    </tr>
                  ) : (
                    files.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(item)}
                            {item.isFolder ? (
                              <button
                                onClick={() => handleNavigateFolder(item)}
                                className="font-semibold text-white hover:text-sky-300 transition-colors text-left truncate max-w-sm"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <span className="font-medium text-slate-200 truncate max-w-sm">
                                {item.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {item.isFolder ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40 text-[10px] font-bold">
                              Carpeta
                            </span>
                          ) : (
                            <span className="truncate max-w-[120px] block text-slate-400 text-[11px]">
                              {item.mimeType.split('/').pop()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {item.size || '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {item.modifiedTime ? new Date(item.modifiedTime).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.webViewLink && (
                              <a
                                href={item.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                title="Abrir directamente en Google Drive"
                                className="p-1.5 rounded-lg bg-[#002B49] text-sky-300 hover:text-white border border-sky-500/40 transition-all hover:scale-105"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {/* Destructive Delete Button that triggers mandatory user confirmation dialog */}
                            <button
                              onClick={() => setItemToDelete(item)}
                              title="Eliminar de Google Drive"
                              className="p-1.5 rounded-lg bg-slate-800/60 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Carpeta Simple */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#030e24] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-sky-400" />
              <span>Nueva Carpeta en Google Drive</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Se creará dentro del directorio actual de Google Drive.
            </p>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ej. 05_DOCUMENTACION_EXTERNA"
                required
                className="w-full px-3.5 py-2.5 bg-[#020712] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Creando...' : 'Crear Carpeta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Generador Estructura Institucional ACESS */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#030e24] border border-emerald-500/60 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
                <FolderTree className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Generar Estructura Institucional ACESS en Drive
                </h3>
                <span className="text-[11px] text-slate-400">
                  Crea automáticamente la carpeta raíz y 4 subcarpetas normativas
                </span>
              </div>
            </div>

            {dossierSuccessLink ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Estructura generada exitosamente en Google Drive!</span>
                  </div>
                  <p className="text-emerald-300 text-[11px]">
                    Las carpetas normativas (01_LEGALES, 02_PLANOS, 03_RESOLUCIONES, 04_SACCS) ya están listas para recibir documentos.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 pt-2">
                  <a
                    href={dossierSuccessLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir Carpeta en Google Drive</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowDossierModal(false);
                      setDossierSuccessLink(null);
                    }}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateDossier} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unicódigo del Establecimiento (ACESS)
                  </label>
                  <input
                    type="text"
                    value={dossierUnicodigo}
                    onChange={(e) => setDossierUnicodigo(e.target.value)}
                    required
                    placeholder="Ej. 17D02-005678"
                    className="w-full px-3.5 py-2 bg-[#020712] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Razón Social / Nombre Comercial
                  </label>
                  <input
                    type="text"
                    value={dossierRazonSocial}
                    onChange={(e) => setDossierRazonSocial(e.target.value)}
                    required
                    placeholder="Ej. Centro Quirúrgico Metropolitano"
                    className="w-full px-3.5 py-2 bg-[#020712] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#010915] border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-bold">Subcarpetas a generar:</div>
                  <div className="pl-2">📁 01_DOCUMENTOS_LEGALES</div>
                  <div className="pl-2">📁 02_PLANOS_Y_FOTOGRAFIAS</div>
                  <div className="pl-2">📁 03_RESOLUCIONES_ACESS</div>
                  <div className="pl-2">📁 04_SACCS_EXPEDIENTES</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDossierModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingDossier}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {isCreatingDossier ? 'Creando en Google Drive...' : 'Crear en Google Drive'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE OPERATIONS */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#030e24] border-2 border-rose-500/70 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">
                Confirmar eliminación en Google Drive
              </h3>
            </div>

            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              ¿Estás seguro de que deseas eliminar permanentemente el siguiente elemento de tu Google Drive?
            </p>

            <div className="p-3 bg-[#010915] border border-slate-700/80 rounded-xl mb-4 font-mono text-xs text-rose-300 truncate">
              {itemToDelete.isFolder ? '📁 Carpeta: ' : '📄 Archivo: '}
              <strong className="text-white">{itemToDelete.name}</strong>
            </div>

            <p className="text-[11px] text-slate-400 mb-6">
              Esta acción modificará los datos de tu cuenta de Google Drive con tu autorización explícita.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar de Drive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
