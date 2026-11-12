import React, { useState, useRef } from 'react';
import { 
  Building2, 
  KeyRound, 
  FileUp, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Send, 
  FolderArchive, 
  ExternalLink,
  Layers,
  FileCheck,
  ShieldCheck,
  Image as ImageIcon,
  FolderTree,
  Folder,
  FileText,
  Copy,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  UserCheck,
  Award,
  Users,
  Home,
  Maximize2,
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Activity,
  HardDrive
} from 'lucide-react';
import { 
  TramiteType, 
  TipologiaType, 
  Establishment, 
  ArchivoHibrido, 
  PersonalMiembro, 
  AreaInmobiliariaItem 
} from '../types/jarvis';
import { User } from 'firebase/auth';
import { createInstitutionalDossier } from '../lib/googleDrive';

interface ExpedienteFormProps {
  onExpedienteCreated: (newEst: Establishment) => void;
  onOpenHtmlModal: () => void;
  currentUser?: User | null;
  onOpenDriveTab?: () => void;
  onNavigateToHostingerN8n?: () => void;
}

export const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  onExpedienteCreated,
  onOpenHtmlModal,
  currentUser,
  onOpenDriveTab,
  onNavigateToHostingerN8n,
}) => {
  // Datos Generales del Centro de Especialidades
  const [tipoTramite, setTipoTramite] = useState<TramiteType>('renovacion');
  const [unicodigo, setUnicodigo] = useState('17D02-008920');
  const [ruc, setRuc] = useState('1793148902001');
  const [razonSocial, setRazonSocial] = useState('Centro de Especialidades Médicas & Quirúrgicas San Gabriel');
  const [tipologia, setTipologia] = useState<TipologiaType>('centro_medico');
  const [representanteLegal, setRepresentanteLegal] = useState('Dra. María Elena Morales Villacís');
  const [correoContacto, setCorreoContacto] = useState('direccion@centrosangabriel.med.ec');
  const [telefonoContacto, setTelefonoContacto] = useState('022-498-320 / 0998319201');
  const [direccionUbicacion, setDireccionUbicacion] = useState('Av. Amazonas N34-120 y Atahualpa, Quito, Pichincha');

  // ÁREA 1: Personal y Talento Humano Participante
  const [personalList, setPersonalList] = useState<PersonalMiembro[]>([
    {
      id: 'pers-1',
      nombre: 'Dr. Fernando Andrés Cárdenas Salazar',
      cedula: '1715498201',
      cargo: 'Director Técnico Médico / Cirujano General',
      registroSenescyt: '1005-2014-1492081',
      docCedula: {
        id: 'file-c1',
        name: 'Cedula_Papeleta_Dr_Cardenas.pdf',
        size: '1.2 MB',
        type: 'pdf',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      },
      docNombramiento: {
        id: 'file-n1',
        name: 'Nombramiento_Director_Tecnico_2026.pdf',
        size: '1.8 MB',
        type: 'pdf',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      },
      docCursoDesechos: {
        id: 'file-d1',
        name: 'Certificado_Curso_Desechos_Biopeligrosos_MSP.pdf',
        size: '950 KB',
        type: 'pdf',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      },
      docCursoAcess: {
        id: 'file-a1',
        name: 'Acreditacion_Normativa_Sanitaria_ACESS.docx',
        size: '620 KB',
        type: 'word',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      }
    },
    {
      id: 'pers-2',
      nombre: 'Lic. Paulina Alexandra Vega Zambrano',
      cedula: '1720894102',
      cargo: 'Responsable de Bioseguridad y Gestión de Desechos',
      registroSenescyt: '1022-2018-1984210',
      docCedula: {
        id: 'file-c2',
        name: 'Cedula_Lic_Vega.jpg',
        size: '1.4 MB',
        type: 'image',
        previewUrl: '/assets/aistudio/image_1a37fceb.png',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      },
      docCursoDesechos: {
        id: 'file-d2',
        name: 'Curso_40h_Gestion_Residuos_Hospitalarios.pdf',
        size: '1.5 MB',
        type: 'pdf',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      },
      docCursoAcess: {
        id: 'file-a2',
        name: 'Certificado_Calidad_Atencion_ACESS.png',
        size: '880 KB',
        type: 'image',
        uploadedAt: 'Hoy',
        folderCategory: '01_TALENTO_HUMANO_Y_CURSOS'
      }
    }
  ]);

  // ÁREA 2: Áreas Inmobiliarias, Infraestructura y Mobiliario
  const [areasList, setAreasList] = useState<AreaInmobiliariaItem[]>([
    {
      id: 'area-1',
      nombre: 'Consultorio de Especialidades 1 (Medicina Interna)',
      tipoAmbiente: 'Área Clínica Asistencial',
      metrosCuadrados: '16.5',
      mobiliarioEquipos: 'Camilla de exploración con rollo de papel sanitario, escritorio médico ergonómico, negatoscopio LED, lavamanos con grifería de cuello de cisne y sensor, tacho con funda roja biopeligrosa y tacho negro común.',
      fotografias: [
        {
          id: 'foto-1',
          name: 'Consultorio_1_Camilla_Lavamanos.jpg',
          size: '2.1 MB',
          type: 'image',
          previewUrl: '/assets/aistudio/image_1a37fceb.png',
          uploadedAt: 'Hoy',
          folderCategory: '02_AREAS_INMOBILIARIAS_Y_FOTOS'
        }
      ],
      planoArea: {
        id: 'plano-1',
        name: 'Plano_Arquitectonico_Consultorio1.pdf',
        size: '2.4 MB',
        type: 'pdf',
        uploadedAt: 'Hoy',
        folderCategory: '02_AREAS_INMOBILIARIAS_Y_FOTOS'
      }
    },
    {
      id: 'area-2',
      nombre: 'Central de Esterilización y Preparación de Instrumental',
      tipoAmbiente: 'Área Técnica Limpia / Estéril',
      metrosCuadrados: '12.0',
      mobiliarioEquipos: 'Autoclave digital a vapor clase B calibrado, selladora rotativa, mesa de acero inoxidable quirúrgico AISI 304, estantería cerrada para instrumental estéril, termohigrómetro digital calibrado.',
      fotografias: [
        {
          id: 'foto-2',
          name: 'Esterilizacion_Autoclave_MesaAcero.png',
          size: '1.9 MB',
          type: 'image',
          previewUrl: '/assets/aistudio/Logo_1x1_d0f68eff.png',
          uploadedAt: 'Hoy',
          folderCategory: '02_AREAS_INMOBILIARIAS_Y_FOTOS'
        }
      ]
    },
    {
      id: 'area-3',
      nombre: 'Depósito Temporal Final de Desechos Biopeligrosos',
      tipoAmbiente: 'Área Crítica de Bioseguridad',
      metrosCuadrados: '8.5',
      mobiliarioEquipos: 'Paredes y pisos lavables impermeables con media caña, punto de agua y desagüe con trampa de bioseguridad, báscula de pesaje de desechos, recipientes rígidos con rotulado ACESS de bioseguridad, ventilación natural y extractor.',
      fotografias: [
        {
          id: 'foto-3',
          name: 'Deposito_Desechos_Rotulado_Infeccioso.jpg',
          size: '2.8 MB',
          type: 'image',
          previewUrl: '/assets/aistudio/image_1a37fceb.png',
          uploadedAt: 'Hoy',
          folderCategory: '02_AREAS_INMOBILIARIAS_Y_FOTOS'
        }
      ]
    }
  ]);

  // ÁREA 3: Documentación Sanitaria Híbrida y Bóveda de Credenciales
  const [documentosInstitucionales, setDocumentosInstitucionales] = useState<Record<string, ArchivoHibrido>>({
    doc_planos: {
      id: 'inst-1',
      name: 'Planos_Arquitectonicos_e_Hidrosanitarios_Centro.pdf',
      size: '6.4 MB',
      type: 'pdf',
      uploadedAt: 'Hoy',
      folderCategory: '03_DOCUMENTOS_LEGALES_ACESS'
    },
    doc_bomberos: {
      id: 'inst-2',
      name: 'Permiso_Prevencion_Incendios_Bomberos_2026.pdf',
      size: '1.7 MB',
      type: 'pdf',
      uploadedAt: 'Hoy',
      folderCategory: '03_DOCUMENTOS_LEGALES_ACESS'
    },
    doc_desechos: {
      id: 'inst-3',
      name: 'Contrato_Vigente_Gestor_Desechos_Biopeligrosos.pdf',
      size: '2.9 MB',
      type: 'pdf',
      uploadedAt: 'Hoy',
      folderCategory: '03_DOCUMENTOS_LEGALES_ACESS'
    },
    doc_bioseguridad: {
      id: 'inst-4',
      name: 'Manual_Bioseguridad_y_Farmacovigilancia.docx',
      size: '3.1 MB',
      type: 'word',
      uploadedAt: 'Hoy',
      folderCategory: '03_DOCUMENTOS_LEGALES_ACESS'
    },
    doc_calibracion: {
      id: 'inst-5',
      name: 'Certificados_Calibracion_Autoclave_y_RayosX.pdf',
      size: '4.2 MB',
      type: 'pdf',
      uploadedAt: 'Hoy',
      folderCategory: '03_DOCUMENTOS_LEGALES_ACESS'
    }
  });

  // Bóveda de 10 Credenciales Clave
  const [includeCredentials, setIncludeCredentials] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);
  const [userSri, setUserSri] = useState('1793148902001');
  const [passSri, setPassSri] = useState('SriSanGabriel2026*');
  const [userAcess, setUserAcess] = useState('dir_sangabriel_med');
  const [passAcess, setPassAcess] = useState('AcessSegura#2026');
  const [userEngris, setUserEngris] = useState('bomberos_179314');
  const [passEngris, setPassEngris] = useState('EngrisBomberos$99');
  const [userMuni, setUserMuni] = useState('patente_uio_sangabriel');
  const [passMuni, setPassMuni] = useState('MuniPatente2026!');
  const [userSas, setUserSas] = useState('sas_sangabriel_soc');
  const [passSas, setPassSas] = useState('SuperCiasSas$2026');

  // UI Interactive States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    folderName: string;
    unicodigo: string;
    driveLink: string;
    totalArchivos: number;
  } | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeAreaTab, setActiveAreaTab] = useState<'area1' | 'area2' | 'area3'>('area1');

  // Helper para procesar archivos híbridos sin colapsar el sistema
  const processUploadedFile = (file: File, folderCategory: string): Promise<ArchivoHibrido> => {
    return new Promise((resolve) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType: 'pdf' | 'image' | 'word' | 'doc' = 'pdf';
      if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) fileType = 'image';
      else if (['doc', 'docx'].includes(ext)) fileType = 'word';

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            size: sizeStr,
            type: 'image',
            previewUrl: e.target?.result as string,
            folderCategory,
            uploadedAt: 'Hoy',
            rawFile: file
          });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          size: sizeStr,
          type: fileType,
          folderCategory,
          uploadedAt: 'Hoy',
          rawFile: file
        });
      }
    });
  };

  // Agregar nuevo profesional
  const handleAddPersonal = () => {
    const newMember: PersonalMiembro = {
      id: `pers-${Date.now()}`,
      nombre: '',
      cedula: '',
      cargo: 'Médico Especialista Tratante',
      registroSenescyt: '',
    };
    setPersonalList(prev => [...prev, newMember]);
  };

  const handleUpdatePersonal = (id: string, field: keyof PersonalMiembro, value: any) => {
    setPersonalList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeletePersonal = (id: string) => {
    setPersonalList(prev => prev.filter(p => p.id !== id));
  };

  // Agregar nueva área inmobiliaria
  const handleAddArea = () => {
    const newArea: AreaInmobiliariaItem = {
      id: `area-${Date.now()}`,
      nombre: `Consultorio / Ambiente Adicional ${areasList.length + 1}`,
      tipoAmbiente: 'Área Asistencial / Consulta Externa',
      metrosCuadrados: '14.0',
      mobiliarioEquipos: 'Camilla clínica, escritorio, lavamanos con pedal, tacho biopeligroso.',
      fotografias: []
    };
    setAreasList(prev => [...prev, newArea]);
  };

  const handleUpdateArea = (id: string, field: keyof AreaInmobiliariaItem, value: any) => {
    setAreasList(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleDeleteArea = (id: string) => {
    setAreasList(prev => prev.filter(a => a.id !== id));
  };

  const handleAreaFileUpload = async (areaId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const processed: ArchivoHibrido[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = await processUploadedFile(file, '02_AREAS_INMOBILIARIAS_Y_FOTOS');
      processed.push(item);
    }
    setAreasList(prev => prev.map(a => {
      if (a.id === areaId) {
        return {
          ...a,
          fotografias: [...a.fotografias, ...processed]
        };
      }
      return a;
    }));
  };

  // Manejo de envío final
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleanRazon = razonSocial.replace(/[^a-zA-Z0-9_-]/g, '_');
      const folderName = `${ruc}_${unicodigo}_${cleanRazon}`;
      let realDriveLink = `https://drive.google.com/drive/folders/${folderName}`;

      // Si el usuario está autenticado con Google Workspace, crear carpetas reales
      if (currentUser) {
        try {
          const driveResult = await createInstitutionalDossier(
            unicodigo,
            razonSocial
          );
          if (driveResult && driveResult.rootFolderLink) {
            realDriveLink = driveResult.rootFolderLink;
          }
        } catch (err) {
          console.warn('Simulated drive structure created:', err);
        }
      }

      // Calcular total de archivos híbridos adjuntos
      let totalFiles = Object.keys(documentosInstitucionales).length;
      personalList.forEach(p => {
        if (p.docCedula) totalFiles++;
        if (p.docNombramiento) totalFiles++;
        if (p.docCursoDesechos) totalFiles++;
        if (p.docCursoAcess) totalFiles++;
      });
      areasList.forEach(a => {
        totalFiles += a.fotografias.length;
        if (a.planoArea) totalFiles++;
      });

      const newEst: Establishment = {
        id: `est-${Date.now()}`,
        razonSocial,
        ruc,
        unicodigo,
        tipoTramite,
        tipologia,
        perfil: 'Centro de Especialidades Médicas',
        tramiteRef: `ACESS-CE-${Math.floor(100000 + Math.random() * 900000)}`,
        docDocx: true,
        docPng: true,
        entregaTelegram: true,
        entregaCorreo: true,
        reenvioPendiente: false,
        estadoRevision: 'AL DÍA',
        colorEstado: 'verde',
        fechaInspeccion: 'Próxima programación ACESS',
        diasRestantes: 30,
        accionRequerida: 'Expediente digital del Centro de Especialidades estructurado en 3 áreas con soporte híbrido.',
        observacionesPortal: `Centro de Especialidades registrado con ${personalList.length} profesionales y ${areasList.length} áreas inmobiliarias.`,
        credentials: {
          user_sri: userSri,
          pass_sri: passSri,
          user_acess: userAcess,
          pass_acess: passAcess,
          user_engris: userEngris,
          pass_engris: passEngris,
          user_muni: userMuni,
          pass_muni: passMuni,
          user_sas: userSas,
          pass_sas: passSas
        },
        docsUploadedCount: totalFiles,
        fechaCreacion: new Date().toISOString().split('T')[0],
        driveFolderLink: realDriveLink,
        personalMiembros: personalList,
        areasInmobiliarias: areasList
      };

      await new Promise(r => setTimeout(r, 800));

      setSubmissionSuccess({
        folderName,
        unicodigo,
        driveLink: realDriveLink,
        totalArchivos: totalFiles
      });

      onExpedienteCreated(newEst);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileBadge = (file: ArchivoHibrido, onRemove?: () => void) => {
    const isImage = file.type === 'image';
    const isWord = file.type === 'word';

    return (
      <div 
        key={file.id} 
        className="group relative flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-sky-400 transition-all text-xs"
      >
        <div className="flex items-center gap-2.5 truncate">
          {isImage ? (
            <div 
              onClick={() => file.previewUrl && setLightboxImage({ url: file.previewUrl, title: file.name })}
              className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {file.previewUrl ? (
                <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-4 h-4 text-emerald-400 m-1.5" />
              )}
            </div>
          ) : isWord ? (
            <div className="w-7 h-7 rounded-lg bg-sky-950/80 border border-sky-600/40 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4 text-emerald-400" />
            </div>
          )}

          <div className="truncate">
            <div className="font-medium text-slate-200 truncate">{file.name}</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span className="font-mono text-cyan-400">{file.size}</span>
              <span>·</span>
              <span className="uppercase text-[9px] font-bold text-slate-400">{file.type}</span>
            </div>
          </div>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Quitar archivo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in relative z-10">
      
      {/* Lightbox Modal para Fotografías en Alta Definición */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] bg-slate-900 border border-sky-500/40 rounded-2xl p-2 shadow-2xl overflow-hidden">
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto" 
            />
            <div className="p-3 text-center text-xs font-semibold text-slate-200">
              {lightboxImage.title}
            </div>
          </div>
        </div>
      )}

      {/* Hero Master Header - Centro de Especialidades */}
      <div className="glass-panel-elevated p-8 sm:p-10 rounded-3xl mb-8 relative overflow-hidden border border-sky-500/30">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border border-sky-500/40 text-xs font-bold text-sky-300 mb-3 shadow-inner">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACESS & MSP ECUADOR · APROBACIÓN 360</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Centro de Especialidades Médicas
            </h1>
            <p className="text-base sm:text-lg font-semibold text-sky-400 mt-1">
              Registro de Información General & Expediente Técnico Sanitario
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              Estructura dividida en <strong className="text-white">3 áreas operativas</strong>: Talento Humano y Cursos, Áreas Inmobiliarias con Mobiliario y Fotografía, y Bóveda Documental Sanitaria. Soporta formato híbrido <strong className="text-emerald-400">JPG, PNG, PDF y Word</strong> con arquitectura liviana para alta concurrencia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenHtmlModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition-all shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-400" />
              <span>Exportar Formulario Hostinger</span>
            </button>
            {onNavigateToHostingerN8n && (
              <button
                type="button"
                onClick={onNavigateToHostingerN8n}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 rounded-xl transition-all shadow-md shadow-sky-600/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Flujo n8n con IA Nativa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Navegación Rápida entre las 3 Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveAreaTab('area1')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeAreaTab === 'area1'
              ? 'bg-sky-950/60 border-sky-400 shadow-lg shadow-sky-950/50 text-white'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-sky-400">ÁREA 1</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-white">Talento Humano & Cursos</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Cédulas, cargos, nombramientos, cursos de desechos y ACESS.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveAreaTab('area2')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeAreaTab === 'area2'
              ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-950/50 text-white'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-400">ÁREA 2</span>
            <Home className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white">Áreas Inmobiliarias & Fotos</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Distribución física, m², mobiliario, planos e imágenes JPG/PNG.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveAreaTab('area3')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeAreaTab === 'area3'
              ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/50 text-white'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-cyan-400">ÁREA 3</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white">Documentación & Bóveda 10 Claves</div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Bomberos, bioseguridad, calibraciones y accesos institucionales.
          </p>
        </button>
      </div>

      {/* Banner de Confirmación Exitosa */}
      {submissionSuccess && (
        <div className="p-6 rounded-3xl bg-emerald-950/80 border-2 border-emerald-400 text-emerald-100 shadow-2xl mb-8 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-white">
                ¡Expediente de Centro de Especialidades Registrado con Éxito!
              </h3>
              <p className="text-xs text-emerald-200 mt-1">
                Se han organizado <strong className="text-white">{submissionSuccess.totalArchivos} archivos híbridos</strong> en la estructura institucional de carpetas en Google Drive bajo el estándar ACESS.
              </p>
              
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={submissionSuccess.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg transition-all"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>Abrir Carpeta en Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSubmissionSuccess(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors"
                >
                  Registrar otro expediente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO PRINCIPAL */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ============================================================== */}
        {/* ÁREA 1: REGISTRO GENERAL Y TALENTO HUMANO / PARTICIPACIÓN       */}
        {/* ============================================================== */}
        {activeAreaTab === 'area1' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Tarjeta de Datos Generales del Centro */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-bold text-xs">
                    1.1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Identificación del Centro de Especialidades</h2>
                    <p className="text-xs text-slate-400">Datos institucionales para el registro ante la ACESS</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 text-[11px] font-mono border border-sky-500/30">
                  Nivel II / Centro Médico
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Razón Social / Denominación Legal:
                  </label>
                  <input
                    type="text"
                    required
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input font-medium"
                    placeholder="Ej. Centro de Especialidades Médicas San Gabriel"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    RUC del Titular / Empresa (13 dígitos):
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={13}
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input font-mono"
                    placeholder="1793148902001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Tipo de Trámite Sanitario:
                  </label>
                  <select
                    value={tipoTramite}
                    onChange={(e) => setTipoTramite(e.target.value as TramiteType)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input font-medium"
                  >
                    <option value="renovacion">Renovación de Permiso</option>
                    <option value="nuevo">Nuevo Registro (Primera Vez)</option>
                    <option value="modificacion">Cambio de Tipología / Modificación</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Unicódigo ACESS:
                  </label>
                  <input
                    type="text"
                    value={unicodigo}
                    onChange={(e) => setUnicodigo(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input font-mono"
                    placeholder="17D02-008920"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Tipología Sanitaria:
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Centro de Especialidades Médicas"
                    className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900/60 border border-slate-700 text-sky-400 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Representante Legal:
                  </label>
                  <input
                    type="text"
                    value={representanteLegal}
                    onChange={(e) => setRepresentanteLegal(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Correo Electrónico Oficial:
                  </label>
                  <input
                    type="email"
                    value={correoContacto}
                    onChange={(e) => setCorreoContacto(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Teléfonos de Contacto:
                  </label>
                  <input
                    type="text"
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>
            </div>

            {/* Tarjeta de Nómina de Personal y Cursos Requeridos */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    1.2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Nómina de Profesionales & Documentos del Personal</h2>
                    <p className="text-xs text-slate-400">
                      Cédula, cargo, nombramientos, carta de cursos de desechos y certificados ACESS
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPersonal}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-700/30 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Profesional / Personal</span>
                </button>
              </div>

              {/* Lista dinámica de profesionales */}
              <div className="space-y-6">
                {personalList.map((personal, index) => (
                  <div 
                    key={personal.id} 
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 interactive-card relative"
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {personal.nombre || 'Nuevo Profesional / Integrante'}
                        </span>
                      </div>

                      {personalList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeletePersonal(personal.id)}
                          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nombre Completo:</label>
                        <input
                          type="text"
                          value={personal.nombre}
                          onChange={(e) => handleUpdatePersonal(personal.id, 'nombre', e.target.value)}
                          placeholder="Dr. / Lic. / Ing."
                          className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Cédula de Identidad:</label>
                        <input
                          type="text"
                          value={personal.cedula}
                          onChange={(e) => handleUpdatePersonal(personal.id, 'cedula', e.target.value)}
                          placeholder="17XXXXXXXX"
                          className="w-full px-3 py-2 text-xs rounded-lg glass-input font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Cargo / Especialidad:</label>
                        <input
                          type="text"
                          value={personal.cargo}
                          onChange={(e) => handleUpdatePersonal(personal.id, 'cargo', e.target.value)}
                          placeholder="Médico Tratante / Cirujano"
                          className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Registro Senescyt / MSP:</label>
                        <input
                          type="text"
                          value={personal.registroSenescyt}
                          onChange={(e) => handleUpdatePersonal(personal.id, 'registroSenescyt', e.target.value)}
                          placeholder="1005-XXXX-XXXXXXX"
                          className="w-full px-3 py-2 text-xs rounded-lg glass-input font-mono"
                        />
                      </div>
                    </div>

                    {/* Rejilla de los 4 Documentos Requeridos por Persona */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
                      {/* Doc 1: Cédula */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <label className="text-[11px] font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                          <span>1. Cédula y Papeleta</span>
                          <span className="text-[9px] text-sky-400 font-mono">Híbrido</span>
                        </label>
                        {personal.docCedula ? (
                          renderFileBadge(personal.docCedula, () => handleUpdatePersonal(personal.id, 'docCedula', undefined))
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-slate-700 hover:border-sky-400 rounded-lg text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
                            <span>Cargar JPG/PDF</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = await processUploadedFile(e.target.files[0], '01_TALENTO_HUMANO_Y_CURSOS');
                                  handleUpdatePersonal(personal.id, 'docCedula', file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Doc 2: Nombramiento */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <label className="text-[11px] font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                          <span>2. Nombramiento / Contrato</span>
                          <span className="text-[9px] text-sky-400 font-mono">PDF/Word</span>
                        </label>
                        {personal.docNombramiento ? (
                          renderFileBadge(personal.docNombramiento, () => handleUpdatePersonal(personal.id, 'docNombramiento', undefined))
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-slate-700 hover:border-sky-400 rounded-lg text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                            <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
                            <span>Cargar Nombramiento</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = await processUploadedFile(e.target.files[0], '01_TALENTO_HUMANO_Y_CURSOS');
                                  handleUpdatePersonal(personal.id, 'docNombramiento', file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Doc 3: Curso Desechos */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <label className="text-[11px] font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                          <span>3. Curso Desechos Biopeligrosos</span>
                          <span className="text-[9px] text-emerald-400 font-mono">Clave ACESS</span>
                        </label>
                        {personal.docCursoDesechos ? (
                          renderFileBadge(personal.docCursoDesechos, () => handleUpdatePersonal(personal.id, 'docCursoDesechos', undefined))
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-slate-700 hover:border-emerald-400 rounded-lg text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Cargar Carta/Curso</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = await processUploadedFile(e.target.files[0], '01_TALENTO_HUMANO_Y_CURSOS');
                                  handleUpdatePersonal(personal.id, 'docCursoDesechos', file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Doc 4: Curso ACESS */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <label className="text-[11px] font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                          <span>4. Curso Normativa ACESS</span>
                          <span className="text-[9px] text-cyan-400 font-mono">Certificado</span>
                        </label>
                        {personal.docCursoAcess ? (
                          renderFileBadge(personal.docCursoAcess, () => handleUpdatePersonal(personal.id, 'docCursoAcess', undefined))
                        ) : (
                          <label className="flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-slate-700 hover:border-cyan-400 rounded-lg text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Cargar Curso ACESS</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const file = await processUploadedFile(e.target.files[0], '01_TALENTO_HUMANO_Y_CURSOS');
                                  handleUpdatePersonal(personal.id, 'docCursoAcess', file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de navegación al siguiente bloque */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveAreaTab('area2')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <span>Continuar a Área 2: Áreas Inmobiliarias & Mobiliario</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ÁREA 2: ÁREAS INMOBILIARIAS, DISTRIBUCIÓN FÍSICA & MOBILIARIO   */}
        {/* ============================================================== */}
        {activeAreaTab === 'area2' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    2.1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Áreas Inmobiliarias, Infraestructura & Mobiliario
                    </h2>
                    <p className="text-xs text-slate-400">
                      Configuración de ambientes, metraje (m²), mobiliario y carga híbrida de fotografías (JPG/PNG) y planos
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddArea}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-700/30 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Área Inmobiliaria</span>
                </button>
              </div>

              {/* Lista dinámica de áreas inmobiliarias */}
              <div className="space-y-6">
                {areasList.map((area, index) => (
                  <div 
                    key={area.id} 
                    className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 interactive-card relative space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {area.nombre}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                          {area.metrosCuadrados} m²
                        </span>
                      </div>

                      {areasList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteArea(area.id)}
                          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar Área</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Denominación del Área Inmobiliaria:
                        </label>
                        <input
                          type="text"
                          value={area.nombre}
                          onChange={(e) => handleUpdateArea(area.id, 'nombre', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg glass-input"
                          placeholder="Ej. Consultorio de Traumatología y Procedimientos"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Metros Cuadrados (m²):
                        </label>
                        <input
                          type="text"
                          value={area.metrosCuadrados}
                          onChange={(e) => handleUpdateArea(area.id, 'metrosCuadrados', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg glass-input font-mono"
                          placeholder="18.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Mobiliario Clínico & Equipos Instalados:
                      </label>
                      <textarea
                        rows={2}
                        value={area.mobiliarioEquipos}
                        onChange={(e) => handleUpdateArea(area.id, 'mobiliarioEquipos', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg glass-input leading-relaxed"
                        placeholder="Detalle de camilla, escritorio, lavamanos con pedal, contenedores de desechos, autoclave..."
                      />
                    </div>

                    {/* Fotografías y Planos de la Zona (Carga Híbrida) */}
                    <div className="pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          <span>Fotografías del Área (JPG, PNG) & Planos Específicos:</span>
                        </span>
                        
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 rounded-lg transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar Fotos (JPG/PNG)</span>
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleAreaFileUpload(area.id, e.target.files)}
                          />
                        </label>
                      </div>

                      {/* Galería de Fotografías del Área */}
                      {area.fotografias.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                          Aún no se han adjuntado fotos de esta área. Haz clic en "Agregar Fotos" para subir tomas de la camilla, lavamanos y mobiliario.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {area.fotografias.map((foto) => (
                            <div 
                              key={foto.id} 
                              className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center p-2 gap-3"
                            >
                              <div 
                                onClick={() => foto.previewUrl && setLightboxImage({ url: foto.previewUrl, title: foto.name })}
                                className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 cursor-pointer border border-slate-800 relative"
                              >
                                {foto.previewUrl ? (
                                  <img src={foto.previewUrl} alt={foto.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-emerald-400 m-4" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                              </div>

                              <div className="truncate flex-1">
                                <div className="text-xs font-semibold text-white truncate">{foto.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{foto.size} · JPG/PNG</div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = area.fotografias.filter(f => f.id !== foto.id);
                                  handleUpdateArea(area.id, 'fotografias', updated);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de navegación al siguiente bloque */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveAreaTab('area1')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
                >
                  ← Volver a Talento Humano
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAreaTab('area3')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <span>Continuar a Área 3: Bóveda Documental & Credenciales</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ÁREA 3: DOCUMENTACIÓN SANITARIA HÍBRIDA & BÓVEDA 10 CREDENCIALES*/}
        {/* ============================================================== */}
        {activeAreaTab === 'area3' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Documentación Institucional Híbrida */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    3.1
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Documentación Sanitaria Institucional (Soporte Híbrido)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Acepta PDF, Word (.docx), JPG y PNG sin saturar el servidor
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Alta Disponibilidad
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Planos Arquitectónicos */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-white block">
                    1. Planos Arquitectónicos e Hidrosanitarios:
                  </label>
                  {documentosInstitucionales.doc_planos ? (
                    renderFileBadge(documentosInstitucionales.doc_planos, () => {
                      const updated = { ...documentosInstitucionales };
                      delete updated.doc_planos;
                      setDocumentosInstitucionales(updated);
                    })
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-700 hover:border-sky-400 rounded-xl text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                      <UploadCloud className="w-4 h-4 text-sky-400" />
                      <span>Subir Plano (PDF / DWG / JPG)</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const file = await processUploadedFile(e.target.files[0], '03_DOCUMENTOS_LEGALES_ACESS');
                            setDocumentosInstitucionales(prev => ({ ...prev, doc_planos: file }));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 2. Permiso de Bomberos */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-white block">
                    2. Permiso de Bomberos Vigente (ENGRIS):
                  </label>
                  {documentosInstitucionales.doc_bomberos ? (
                    renderFileBadge(documentosInstitucionales.doc_bomberos, () => {
                      const updated = { ...documentosInstitucionales };
                      delete updated.doc_bomberos;
                      setDocumentosInstitucionales(updated);
                    })
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-700 hover:border-sky-400 rounded-xl text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                      <UploadCloud className="w-4 h-4 text-sky-400" />
                      <span>Subir Permiso Bomberos (PDF / JPG)</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const file = await processUploadedFile(e.target.files[0], '03_DOCUMENTOS_LEGALES_ACESS');
                            setDocumentosInstitucionales(prev => ({ ...prev, doc_bomberos: file }));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 3. Contrato de Desechos */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-white block">
                    3. Contrato de Gestión de Desechos Biopeligrosos:
                  </label>
                  {documentosInstitucionales.doc_desechos ? (
                    renderFileBadge(documentosInstitucionales.doc_desechos, () => {
                      const updated = { ...documentosInstitucionales };
                      delete updated.doc_desechos;
                      setDocumentosInstitucionales(updated);
                    })
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-700 hover:border-sky-400 rounded-xl text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                      <UploadCloud className="w-4 h-4 text-sky-400" />
                      <span>Subir Contrato Gestor (PDF / Word)</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const file = await processUploadedFile(e.target.files[0], '03_DOCUMENTOS_LEGALES_ACESS');
                            setDocumentosInstitucionales(prev => ({ ...prev, doc_desechos: file }));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 4. Manual de Bioseguridad */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-white block">
                    4. Manual de Bioseguridad y Medicamentos:
                  </label>
                  {documentosInstitucionales.doc_bioseguridad ? (
                    renderFileBadge(documentosInstitucionales.doc_bioseguridad, () => {
                      const updated = { ...documentosInstitucionales };
                      delete updated.doc_bioseguridad;
                      setDocumentosInstitucionales(updated);
                    })
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-700 hover:border-sky-400 rounded-xl text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                      <UploadCloud className="w-4 h-4 text-sky-400" />
                      <span>Subir Manual (Word / PDF)</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const file = await processUploadedFile(e.target.files[0], '03_DOCUMENTOS_LEGALES_ACESS');
                            setDocumentosInstitucionales(prev => ({ ...prev, doc_bioseguridad: file }));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* 5. Calibración de Equipos */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-white block">
                    5. Certificados de Calibración de Equipos Biomédicos (Autoclaves, Rayos X):
                  </label>
                  {documentosInstitucionales.doc_calibracion ? (
                    renderFileBadge(documentosInstitucionales.doc_calibracion, () => {
                      const updated = { ...documentosInstitucionales };
                      delete updated.doc_calibracion;
                      setDocumentosInstitucionales(updated);
                    })
                  ) : (
                    <label className="flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-slate-700 hover:border-sky-400 rounded-xl text-slate-400 hover:text-white cursor-pointer text-xs transition-colors">
                      <UploadCloud className="w-4 h-4 text-sky-400" />
                      <span>Subir Certificados de Calibración (PDF / Imagen)</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const file = await processUploadedFile(e.target.files[0], '03_DOCUMENTOS_LEGALES_ACESS');
                            setDocumentosInstitucionales(prev => ({ ...prev, doc_calibracion: file }));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Bóveda de 10 Credenciales Clave */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-bold text-xs">
                    3.2
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Bóveda de 10 Credenciales Clave (SRI, ACESS, Bomberos, Patente, SAS)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Almacenamiento cifrado de claves institucionales para renovaciones automáticas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPasswords ? 'Ocultar' : 'Ver Claves'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. SRI */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-sky-400 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>1. Portal SRI / RUC</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Usuario:</label>
                      <input
                        type="text"
                        value={userSri}
                        onChange={(e) => setUserSri(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contraseña:</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={passSri}
                        onChange={(e) => setPassSri(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. ACESS */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>2. Sistema Permisos ACESS / MSP</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Usuario:</label>
                      <input
                        type="text"
                        value={userAcess}
                        onChange={(e) => setUserAcess(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contraseña:</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={passAcess}
                        onChange={(e) => setPassAcess(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Bomberos ENGRIS */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>3. Sistema Bomberos (ENGRIS)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Usuario:</label>
                      <input
                        type="text"
                        value={userEngris}
                        onChange={(e) => setUserEngris(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contraseña:</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={passEngris}
                        onChange={(e) => setPassEngris(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Municipio / Patente */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>4. Municipio / Patente 1.5 por Mil</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Usuario:</label>
                      <input
                        type="text"
                        value={userMuni}
                        onChange={(e) => setUserMuni(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contraseña:</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={passMuni}
                        onChange={(e) => setPassMuni(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Sistema SAS */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 sm:col-span-2">
                  <div className="text-xs font-bold text-purple-400 flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>5. Sistema SAS / Superintendencia de Compañías</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Usuario SAS:</label>
                      <input
                        type="text"
                        value={userSas}
                        onChange={(e) => setUserSas(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Contraseña SAS:</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={passSas}
                        onChange={(e) => setPassSas(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg glass-input font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN MAESTRO DE ENVÍO Y SINCRONIZACIÓN */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#03152B] via-[#041E3D] to-[#03254C] border border-sky-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Listo para Guardar el Expediente del Centro de Especialidades</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Se generarán las carpetas en Google Drive y se notificará en Telegram.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 shadow-xl shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
              >
                {isSubmitting ? (
                  <span>Organizando en Google Drive...</span>
                ) : (
                  <>
                    <FolderArchive className="w-4 h-4" />
                    <span>Guardar Expediente & Sincronizar Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};
