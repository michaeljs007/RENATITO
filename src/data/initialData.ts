import { Establishment, JarvisConfig, SaccsVaultItem, AcessNotificationData } from '../types/jarvis';

export const JESSICA_MORALES_NOTIFICATION: AcessNotificationData = {
  profesional: {
    nombre: "Jessica Nathalie Morales Villacis",
    razonSocial: "Morales Villacis Jessica Magdalena"
  },
  tramite: {
    numeroSolicitud: "591",
    codigoTramite: "40120 (Primera Vez)",
    tipoPermiso: "PERMISOS - 41420"
  },
  establecimiento: {
    tipoServicio: "Establecimientos de Servicios de Salud Públicos y Privados / Nivel 1B Atención - Consultorio General",
    denominacion: "Consultorio General de Medicina General"
  },
  estatus: {
    estado: "Pendiente de Inspección",
    observacionClave: "El trámite se encuentra en proceso de inspección. Es indispensable monitorear permanentemente el correo electrónico registrado para confirmar la fecha y hora de la visita técnica.",
    accionPendiente: "Esperar coordinación de la inspección o notificar al usuario para la preparación de los requisitos físicos/documentales del consultorio."
  }
};

export const REAL_SACCS_CREDENTIALS: SaccsVaultItem[] = [
  {
    id: 'saccs-01',
    tramiteKey: 'SPF-431543',
    nombreTitular: 'MEDIFER S.A.S. SOCIEDAD POR ACCIONES SIMPLIFICADAS',
    usuarioRuc: '1793219933001',
    passwordPlain: 'Medifer2025',
    encryptedPasswordB64: 'k9Fa02Xm891AbC==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D01-001543',
    notes: 'Sociedad por Acciones Simplificada. Inspección de quirófano ambulatorio.'
  },
  {
    id: 'saccs-02',
    tramiteKey: 'SPF-431544',
    nombreTitular: 'FLORES ESTRELLA JUAN FRANCISCO',
    usuarioRuc: '1716745003001',
    passwordPlain: '58694712jfFE',
    encryptedPasswordB64: 'pL81mZ9810VxYw==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D02-001544',
    notes: 'Persona Natural. Consultorio Médico General.'
  },
  {
    id: 'saccs-03',
    tramiteKey: 'SPF-431545',
    nombreTitular: 'VALLEJO ARTEAGA ANDREA VIVIANA',
    usuarioRuc: '1719379008001',
    passwordPlain: 'VALLEJO2016',
    encryptedPasswordB64: 'rT34xK0918MnBv==[AES256]',
    status: 'ACTUALIZAR',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D03-001545',
    notes: 'Contraseña requiere actualización periódica en SACCS.'
  },
  {
    id: 'saccs-04',
    tramiteKey: 'SPF-431546',
    nombreTitular: 'HIDALGO SUAREZ JOSE LUIS',
    usuarioRuc: '1717302853001',
    passwordPlain: 'Anapaula2108',
    encryptedPasswordB64: 'qW12nB8821ZxCv==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D04-001546',
    notes: 'Consultorio Odontológico Especializado.'
  },
  {
    id: 'saccs-05',
    tramiteKey: 'SPF-431547',
    nombreTitular: 'LOZADA MARTINEZ GABRIELA DEL CARMEN',
    usuarioRuc: '1803824828001',
    passwordPlain: 'LOZADA2024',
    encryptedPasswordB64: 'tY90vC7719QweR==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '18D01-001547',
    notes: 'Laboratorio de Diagnóstico Clínico.'
  },
  {
    id: 'saccs-06',
    tramiteKey: 'SPF-431548',
    nombreTitular: 'BARRIENTOS SILVERA JAYNE MILAGROS',
    usuarioRuc: '1761272853001',
    passwordPlain: 'Silvera2025',
    encryptedPasswordB64: 'uI88xZ6610AsDf==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D05-001548',
    notes: 'Centro de Rehabilitación Física.'
  },
  {
    id: 'saccs-07',
    tramiteKey: 'SPF-431549',
    nombreTitular: 'AVALOS HERRERA NATHALIE MAGDALENA',
    usuarioRuc: '0603940750001',
    passwordPlain: 'AVALOS2026',
    encryptedPasswordB64: 'oP77mA5509GhJk==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '06D01-001549',
    notes: 'Consultorio Pediátrico Integral.'
  },
  {
    id: 'saccs-08',
    tramiteKey: 'SPF-431550',
    nombreTitular: 'DEPORTRAUMA CIA. LTDA.',
    usuarioRuc: '1792488850001',
    passwordPlain: 'DEPOR1792',
    encryptedPasswordB64: 'aB66qW4408ZxCv==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D06-001550',
    notes: 'Clínica de Traumatología y Medicina Deportiva.'
  },
  {
    id: 'saccs-09',
    tramiteKey: 'SPF-431551',
    nombreTitular: 'MONTENEGRO CORRALES CARLOS ARNULFO',
    usuarioRuc: '0501499834001',
    passwordPlain: 'CORRALES2016',
    encryptedPasswordB64: 'sD55eR3307TyUi==[AES256]',
    status: 'ACTUALIZAR',
    lastSync: '2026-11-03 08:00',
    unicodigo: '05D01-001551',
    notes: 'Centro Médico de Especialidades Clínicas.'
  },
  {
    id: 'saccs-10',
    tramiteKey: 'SPF-431552',
    nombreTitular: 'PERUGACHI CEVALLOS OLGA TERESA',
    usuarioRuc: '1702381086001',
    passwordPlain: 'CEVALLOS2016',
    encryptedPasswordB64: 'fG44tY2206UjIk==[AES256]',
    status: 'VIGENTE',
    lastSync: '2026-11-03 08:00',
    unicodigo: '17D07-001552',
    notes: 'Farmacia y Botiquín Comunitario.'
  }
];

export const INITIAL_ESTABLISHMENTS: Establishment[] = [
  {
    id: 'est-01',
    razonSocial: 'Consultorio Odontológico Sonrisas',
    ruc: '1792451928001',
    unicodigo: '17D01-001234',
    tipoTramite: 'renovacion',
    tipologia: 'consultorio',
    perfil: 'Consultorio General',
    tramiteRef: 'SPF-431540',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: false,
    reenvioPendiente: false,
    estadoRevision: 'CRÍTICA',
    colorEstado: 'rojo',
    fechaInspeccion: '14/11/2026',
    diasRestantes: 11,
    accionRequerida: 'Presentar planos actualizados y calibración de autoclave.',
    observacionesPortal: 'Observación en etapa documental: plano arquitectónico sin firma de perito acreditado.',
    docsUploadedCount: 5,
    fechaCreacion: '2026-10-15',
    driveFolderLink: 'https://drive.google.com/drive/folders/1792451928001_17D01-001234_Sonrisas',
    credentials: {
      user_sri: '1792451928001',
      pass_sri: '••••••••••',
      user_acess: 'sonrisas_med',
      pass_acess: '••••••••••',
      user_engris: 'sonrisas_bomberos',
      pass_engris: '••••••••••',
      user_muni: 'patente_179245',
      pass_muni: '••••••••••',
      user_sas: 'sas_sonrisas_cia',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-02',
    razonSocial: 'Clínica Quirúrgica San Gabriel',
    ruc: '1791834920001',
    unicodigo: '17D05-008912',
    tipoTramite: 'renovacion',
    tipologia: 'hospital',
    perfil: 'Hospital del Día',
    tramiteRef: 'SPF-438921',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'CRÍTICA',
    colorEstado: 'rojo',
    fechaInspeccion: '18/11/2026',
    diasRestantes: 15,
    accionRequerida: 'Actualizar contrato de desechos biopeligrosos y póliza de responsabilidad civil.',
    observacionesPortal: 'Notificación de inspección física emitida por ACESS Zona 9.',
    docsUploadedCount: 12,
    fechaCreacion: '2026-10-18',
    driveFolderLink: 'https://drive.google.com/drive/folders/1791834920001_17D05-008912_SanGabriel',
    credentials: {
      user_sri: '1791834920001',
      pass_sri: '••••••••••',
      user_acess: 'sangabriel_hosp',
      pass_acess: '••••••••••',
      user_engris: 'engris_9812',
      pass_engris: '••••••••••',
      user_muni: 'muni_uio_sangabriel',
      pass_muni: '••••••••••',
      user_sas: 'sas_sangabriel_sa',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-03',
    razonSocial: 'Farmacias Económicas del Norte',
    ruc: '0992384712001',
    unicodigo: '09D02-004521',
    tipoTramite: 'modificacion',
    tipologia: 'farmacia',
    perfil: 'Distribuidora Farmacéutica',
    tramiteRef: 'SPF-432098',
    docDocx: true,
    docPng: false,
    entregaTelegram: true,
    entregaCorreo: false,
    reenvioPendiente: true,
    estadoRevision: 'PRÓXIMA',
    colorEstado: 'amarillo',
    fechaInspeccion: '25/11/2026',
    diasRestantes: 22,
    accionRequerida: 'Registrar nuevo Químico Farmacéutico responsable y registro Senescyt.',
    observacionesPortal: 'Cambio de regente técnico en trámite.',
    docsUploadedCount: 8,
    fechaCreacion: '2026-10-20',
    driveFolderLink: 'https://drive.google.com/drive/folders/0992384712001_09D02-004521_FarmaciasNorte',
    credentials: {
      user_sri: '0992384712001',
      pass_sri: '••••••••••',
      user_acess: 'farmnorte_rep',
      pass_acess: '••••••••••',
      user_engris: 'bomberos_gye_farm',
      pass_engris: '••••••••••',
      user_muni: 'gye_patente_farm',
      pass_muni: '••••••••••',
      user_sas: 'sas_farmnorte_ltda',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-04',
    razonSocial: 'Centro Médico & Especialidades Los Andes',
    ruc: '1790023419001',
    unicodigo: '17D03-007722',
    tipoTramite: 'renovacion',
    tipologia: 'centro_medico',
    perfil: 'Centro de Especialidades',
    tramiteRef: 'SPF-439002',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'PRÓXIMA',
    colorEstado: 'amarillo',
    fechaInspeccion: '29/11/2026',
    diasRestantes: 26,
    accionRequerida: 'Completar reporte de dosis radiológica en equipo de Rayos X dental.',
    observacionesPortal: 'Pendiente informe de dosimetría trimestral.',
    docsUploadedCount: 8,
    fechaCreacion: '2026-10-22',
    driveFolderLink: 'https://drive.google.com/drive/folders/1790023419001_17D03-007722_LosAndes',
    credentials: {
      user_sri: '1790023419001',
      pass_sri: '••••••••••',
      user_acess: 'losandes_dir',
      pass_acess: '••••••••••',
      user_engris: 'engris_andes',
      pass_engris: '••••••••••',
      user_muni: 'uio_patente_andes',
      pass_muni: '••••••••••',
      user_sas: 'sas_losandes_med',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-05',
    razonSocial: 'Laboratorio Clínico Alfa Diagnóstico',
    ruc: '0190345612001',
    unicodigo: '01D01-003319',
    tipoTramite: 'renovacion',
    tipologia: 'centro_medico',
    perfil: 'Laboratorio Clínico LAC-2',
    tramiteRef: 'SPF-440112',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: false,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '15/12/2026',
    diasRestantes: 42,
    accionRequerida: 'Permiso vigente. Mantener bitácora de control de calidad interno.',
    observacionesPortal: 'Auditoría previa aprobada con 98% de cumplimiento estándar.',
    docsUploadedCount: 8,
    fechaCreacion: '2026-10-25',
    driveFolderLink: 'https://drive.google.com/drive/folders/0190345612001_01D01-003319_LaboratorioAlfa',
    credentials: {
      user_sri: '0190345612001',
      pass_sri: '••••••••••',
      user_acess: 'alfadiag_cue',
      pass_acess: '••••••••••',
      user_engris: 'cuenca_bomberos_lab',
      pass_engris: '••••••••••',
      user_muni: 'cuenca_patente_alfa',
      pass_muni: '••••••••••',
      user_sas: 'sas_alfa_lab',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-06',
    razonSocial: 'Policlínico Metropolitano del Valle',
    ruc: '1793098112001',
    unicodigo: '17D08-005610',
    tipoTramite: 'renovacion',
    tipologia: 'centro_medico',
    perfil: 'Policlínico Ambulatorio',
    tramiteRef: 'SPF-441203',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '20/12/2026',
    diasRestantes: 47,
    accionRequerida: 'Verificar fechas de vencimiento de medicamentos en botiquín de emergencia.',
    observacionesPortal: 'Renovación anual programada.',
    docsUploadedCount: 8,
    fechaCreacion: '2026-10-26',
    driveFolderLink: 'https://drive.google.com/drive/folders/1793098112001_17D08-005610_PoliclinicoValle',
    credentials: {
      user_sri: '1793098112001',
      pass_sri: '••••••••••',
      user_acess: 'polivalle_uio',
      pass_acess: '••••••••••',
      user_engris: 'valle_engris_33',
      pass_engris: '••••••••••',
      user_muni: 'ruminahui_patente',
      pass_muni: '••••••••••',
      user_sas: 'sas_polivalle',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-07',
    razonSocial: 'Centro Pediátrico San Juan',
    ruc: '1890123849001',
    unicodigo: '18D01-002190',
    tipoTramite: 'nuevo',
    tipologia: 'consultorio',
    perfil: 'Consultorio Pediátrico',
    tramiteRef: 'SPF-442890',
    docDocx: true,
    docPng: true,
    entregaTelegram: false,
    entregaCorreo: false,
    reenvioPendiente: true,
    estadoRevision: 'PRÓXIMA',
    colorEstado: 'amarillo',
    fechaInspeccion: '02/12/2026',
    diasRestantes: 29,
    accionRequerida: 'Subir comprobante de pago de tasa de inspección ACESS.',
    observacionesPortal: 'Validación documental aprobada. Esperando comprobante de tasa.',
    docsUploadedCount: 5,
    fechaCreacion: '2026-10-27',
    driveFolderLink: 'https://drive.google.com/drive/folders/1890123849001_18D01-002190_PediatricoSanJuan',
    credentials: {
      user_sri: '1890123849001',
      pass_sri: '••••••••••',
      user_acess: 'pediatria_sanjuan',
      pass_acess: '••••••••••',
      user_engris: 'ambato_engris',
      pass_engris: '••••••••••',
      user_muni: 'ambato_patente_ped',
      pass_muni: '••••••••••',
      user_sas: 'sas_pediatria_amb',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-08',
    razonSocial: 'Óptica y Centro de Visión Integral',
    ruc: '1718293041001',
    unicodigo: '17D02-009844',
    tipoTramite: 'renovacion',
    tipologia: 'consultorio',
    perfil: 'Consultorio Optométrico',
    tramiteRef: 'SPF-443109',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '10/01/2027',
    diasRestantes: 68,
    accionRequerida: 'Ninguna acción urgente. Permiso vigente hasta enero 2027.',
    observacionesPortal: 'Expediente cerrado con resolución favorable.',
    docsUploadedCount: 5,
    fechaCreacion: '2026-10-28',
    driveFolderLink: 'https://drive.google.com/drive/folders/1718293041001_17D02-009844_OpticaVision',
    credentials: {
      user_sri: '1718293041001',
      pass_sri: '••••••••••',
      user_acess: 'optica_vision',
      pass_acess: '••••••••••',
      user_engris: 'bomberos_optica',
      pass_engris: '••••••••••',
      user_muni: 'patente_optica',
      pass_muni: '••••••••••',
      user_sas: 'sas_optica_uio',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-09',
    razonSocial: 'Hospital del Día Santa Elena',
    ruc: '2490018273001',
    unicodigo: '24D01-009012',
    tipoTramite: 'renovacion',
    tipologia: 'hospital',
    perfil: 'Hospital del Día / Cirugía',
    tramiteRef: 'SPF-437812',
    docDocx: false,
    docPng: false,
    entregaTelegram: false,
    entregaCorreo: false,
    reenvioPendiente: true,
    estadoRevision: 'CRÍTICA',
    colorEstado: 'rojo',
    fechaInspeccion: '12/11/2026',
    diasRestantes: 9,
    accionRequerida: 'Falta generar expediente DOCX/PNG y renovar contrato con gestor de biopeligrosos.',
    observacionesPortal: 'Último requerimiento previo a suspensión temporal por parte de ACESS.',
    docsUploadedCount: 11,
    fechaCreacion: '2026-10-29',
    driveFolderLink: 'https://drive.google.com/drive/folders/2490018273001_24D01-009012_SantaElena',
    credentials: {
      user_sri: '2490018273001',
      pass_sri: '••••••••••',
      user_acess: 'hosp_santaelena',
      pass_acess: '••••••••••',
      user_engris: 'salinas_bomberos',
      pass_engris: '••••••••••',
      user_muni: 'patente_santaelena',
      pass_muni: '••••••••••',
      user_sas: 'sas_santaelena_hosp',
      pass_sas: '••••••••••',
    }
  },
  {
    id: 'est-10',
    razonSocial: 'Farmacia San Blas Central',
    ruc: '1792901844001',
    unicodigo: '17D04-006733',
    tipoTramite: 'renovacion',
    tipologia: 'farmacia',
    perfil: 'Farmacia Comunitaria',
    tramiteRef: 'SPF-444501',
    docDocx: true,
    docPng: true,
    entregaTelegram: true,
    entregaCorreo: true,
    reenvioPendiente: false,
    estadoRevision: 'AL DÍA',
    colorEstado: 'verde',
    fechaInspeccion: '05/01/2027',
    diasRestantes: 63,
    accionRequerida: 'Revisión periódica de temperatura y humedad en área de almacenamiento.',
    observacionesPortal: 'Cumple estándares de Buenas Prácticas de Farmacia.',
    docsUploadedCount: 8,
    fechaCreacion: '2026-10-30',
    driveFolderLink: 'https://drive.google.com/drive/folders/1792901844001_17D04-006733_SanBlas',
    credentials: {
      user_sri: '1792901844001',
      pass_sri: '••••••••••',
      user_acess: 'farm_sanblas',
      pass_acess: '••••••••••',
      user_engris: 'engris_sanblas',
      pass_engris: '••••••••••',
      user_muni: 'uio_sanblas_pat',
      pass_muni: '••••••••••',
      user_sas: 'sas_sanblas',
      pass_sas: '••••••••••',
    }
  }
];

export const DEFAULT_CONFIG: JarvisConfig = {
  modo: 'ambos',
  excel_file: 'Matriz_Real.xlsx',
  sheet_name: 'Establecimientos',
  generar_docx: true,
  generar_png: true,
  enviar_adjuntos: true,
  dias_aviso_vigencia: 30,
  telegram_enviar_imagen: true,
  correo_activo: false,
  admin_chat_id: '584920194',
  telegram_token_masked: '7291834920:AAHq_m7Xk9...'
};

export const N8N_WORKFLOW_JSON = {
  "name": "Auditoria_ACESS_Drive_Telegram_Basico",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "expedientes-acess",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "1",
      "name": "Webhook_Formulario",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [160, 300]
    },
    {
      "parameters": {
        "jsCode": "const body = $input.first().json.body || {};\nconst binary = $input.first().binary || {};\n\nconst ruc = body.ruc || 'SIN_RUC';\nconst unicodigo = body.unicodigo || 'NUEVO';\nconst razonSocial = (body.razon_social || 'ESTABLECIMIENTO').replace(/[^a-zA-Z0-9_-]/g, '_');\nconst tipologia = body.tipologia || 'consultorio';\nconst tramite = body.tipo_tramite || 'nuevo';\n\nconst folderName = `${ruc}_${unicodigo}_${razonSocial}`;\nconst totalDocs = Object.keys(binary).length;\n\nreturn {\n  json: {\n    folderName,\n    ruc,\n    unicodigo,\n    razonSocial: body.razon_social,\n    tipologia,\n    tramite,\n    totalDocs,\n    creds: {\n      sri: `${body.user_sri || '-'} / ${body.pass_sri || '-'}`,\n      acess: `${body.user_acess || '-'} / ${body.pass_acess || '-'}`,\n      engris: `${body.user_engris || '-'} / ${body.pass_engris || '-'}`,\n      municipio: `${body.user_muni || '-'} / ${body.pass_muni || '-'}`,\n      sas: `${body.user_sas || '-'} / ${body.pass_sas || '-'}`\n    }\n  },\n  binary: binary\n};"
      },
      "id": "2",
      "name": "Parsear_Expediente",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [380, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "name": "={{ $json.folderName }}",
        "options": {}
      },
      "id": "3",
      "name": "Crear_Carpeta_Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [600, 300]
    },
    {
      "parameters": {
        "chatId": "-100XXXXXXXXXX",
        "text": "=🚀 *NUEVO EXPEDIENTE REGISTRADO EN JARVIS*\n\n🏢 *Establecimiento:* {{ $('Parsear_Expediente').item.json.razonSocial }}\n📌 *RUC:* `{{ $('Parsear_Expediente').item.json.ruc }}`\n🔢 *Unicódigo:* `{{ $('Parsear_Expediente').item.json.unicodigo }}`\n📋 *Trámite:* {{ $('Parsear_Expediente').item.json.tramite }} | *Tipología:* {{ $('Parsear_Expediente').item.json.tipologia }}\n📁 *Documentos Adjuntos:* {{ $('Parsear_Expediente').item.json.totalDocs }}\n\n🔑 *Bóveda de Credenciales Ingresadas:*\n• *SRI:* `{{ $('Parsear_Expediente').item.json.creds.sri }}`\n• *ACESS:* `{{ $('Parsear_Expediente').item.json.creds.acess }}`\n• *ENGRIS:* `{{ $('Parsear_Expediente').item.json.creds.engris }}`\n• *Municipio:* `{{ $('Parsear_Expediente').item.json.creds.municipio }}`\n• *SAS:* `{{ $('Parsear_Expediente').item.json.creds.sas }}`\n\n📂 *Acceso Directo a Carpeta Google Drive:*\n{{ $json.webViewLink }}",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "id": "4",
      "name": "Notificacion_JARVIS_Telegram",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.1,
      "position": [840, 300]
    }
  ],
  "connections": {
    "Webhook_Formulario": {
      "main": [
        [
          {
            "node": "Parsear_Expediente",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Parsear_Expediente": {
      "main": [
        [
          {
            "node": "Crear_Carpeta_Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crear_Carpeta_Drive": {
      "main": [
        [
          {
            "node": "Notificacion_JARVIS_Telegram",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
};

export const N8N_WORKFLOW_NATIVE_AI_JSON = {
  "name": "Auditoria_ACESS_Hostinger_IA_Nativa_Drive_Telegram",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "expedientes-acess",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "node_webhook",
      "name": "Webhook_Hostinger_Expedientes",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [140, 300]
    },
    {
      "parameters": {
        "jsCode": "const body = $input.first().json.body || {};\nconst binary = $input.first().binary || {};\n\nconst ruc = (body.ruc || '').trim();\nconst unicodigo = (body.unicodigo || (body.tipo_tramite === 'nuevo' ? 'NUEVO_REGISTRO' : 'SIN_UNICODIGO')).trim();\nconst razonSocial = (body.razon_social || 'ESTABLECIMIENTO_SALUD').trim();\nconst cleanName = razonSocial.replace(/[^a-zA-Z0-9_-]/g, '_');\nconst tipologia = body.tipologia || 'consultorio';\nconst tramite = body.tipo_tramite || 'renovacion';\n\n// Nomenclatura institucional de carpeta Google Drive\nconst folderName = `${ruc}_${unicodigo}_${cleanName}`;\nconst docKeys = Object.keys(binary);\nconst totalDocs = docKeys.length;\n\n// Cálculo de documentos requeridos por normativa ACESS\nlet docsEsperados = 5;\nif (tipologia === 'centro_medico' || tipologia === 'farmacia') docsEsperados = 8;\nif (tipologia === 'hospital') docsEsperados = 12;\n\nreturn {\n  json: {\n    folderName,\n    ruc,\n    unicodigo,\n    razonSocial,\n    cleanName,\n    tipologia,\n    tramite,\n    totalDocs,\n    docsEsperados,\n    documentosAdjuntos: docKeys.join(', ') || 'Ninguno adjunto',\n    creds: {\n      sri: `${body.user_sri || '-'} / ${body.pass_sri || '-'}`,\n      acess: `${body.user_acess || '-'} / ${body.pass_acess || '-'}`,\n      engris: `${body.user_engris || '-'} / ${body.pass_engris || '-'}`,\n      municipio: `${body.user_muni || '-'} / ${body.pass_muni || '-'}`,\n      sas: `${body.user_sas || '-'} / ${body.pass_sas || '-'}`\n    },\n    timestamp: new Date().toISOString()\n  },\n  binary: binary\n};"
      },
      "id": "node_parsear",
      "name": "Parsear_Expediente_ACESS",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [380, 300]
    },
    {
      "parameters": {
        "prompt": "=Eres el Auditor Sanitario Senior de Aprobación 360 y perito en normativas de ACESS / MSP Ecuador.\n\nEvalúa técnica y sanitariamente el siguiente expediente recibido desde Hostinger:\n- Establecimiento: {{ $json.razonSocial }}\n- RUC: {{ $json.ruc }}\n- Unicódigo: {{ $json.unicodigo }}\n- Trámite: {{ $json.tramite }}\n- Tipología Sanitaria: {{ $json.tipologia }}\n- Documentos Cargados: {{ $json.totalDocs }} de {{ $json.docsEsperados }} exigidos por normativa\n- Listado de archivos recibidos: {{ $json.documentosAdjuntos }}\n\nCriterios de auditoría:\n1. Si es Renovación y falta Unicódigo, marcar como RIESGO ALTO.\n2. Si la cantidad de documentos es menor a {{ $json.docsEsperados }}, emitir Dictamen OBSERVADO y detallar qué falta.\n3. Si cumple los documentos, emitir Dictamen FAVORABLE y dar 3 recomendaciones para la inspección física.\n\nFormato de respuesta obligatorio:\n🎯 DICTAMEN: [FAVORABLE / OBSERVADO / CRÍTICO]\n🚦 SEMÁFORO DE RIESGO: [VERDE / AMARILLO / ROJO]\n📋 EVALUACIÓN DOCUMENTAL: [Detalle conciso]\n⚠️ REQUISITOS FALTANTES O RIESGOS: [Puntos clave]\n💡 RECOMENDACIONES TÉCNICAS: [3 puntos para preparar la inspección física]\n📝 RESUMEN TELEGRAM: [2 líneas breves]"
      },
      "id": "node_ai_chain",
      "name": "Auditor_IA_Nativa_ACESS",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.4,
      "position": [640, 300]
    },
    {
      "parameters": {
        "modelName": "models/gemini-2.0-flash",
        "options": {
          "temperature": 0.2
        }
      },
      "id": "node_gemini_model",
      "name": "Gemini_IA_Nativa_Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [640, 500],
      "credentials": {
        "googlePalmApi": {
          "id": "gemini_api_key_cred",
          "name": "Google Gemini API Key"
        }
      }
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "name": "={{ $('Parsear_Expediente_ACESS').item.json.folderName }}",
        "options": {}
      },
      "id": "node_drive",
      "name": "Crear_Carpeta_Google_Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [900, 300]
    },
    {
      "parameters": {
        "chatId": "-100XXXXXXXXXX",
        "text": "=🤖 *DICTAMEN DE AUDITORÍA ACESS · IA NATIVA n8n*\n\n🏢 *Establecimiento:* {{ $('Parsear_Expediente_ACESS').item.json.razonSocial }}\n📌 *RUC:* `{{ $('Parsear_Expediente_ACESS').item.json.ruc }}` | *Unicódigo:* `{{ $('Parsear_Expediente_ACESS').item.json.unicodigo }}`\n📋 *Tipología:* {{ $('Parsear_Expediente_ACESS').item.json.tipologia }} | *Trámite:* {{ $('Parsear_Expediente_ACESS').item.json.tramite }}\n📁 *Docs:* {{ $('Parsear_Expediente_ACESS').item.json.totalDocs }} / {{ $('Parsear_Expediente_ACESS').item.json.docsEsperados }}\n\n🧠 *Dictamen emitido por la IA Nativa:*\n{{ $json.text }}\n\n📂 *Carpeta en Google Drive Creada:*\n{{ $('Crear_Carpeta_Google_Drive').item.json.webViewLink }}\n\n🔐 *Credenciales Capturadas:*\n• SRI: `{{ $('Parsear_Expediente_ACESS').item.json.creds.sri }}`\n• ACESS: `{{ $('Parsear_Expediente_ACESS').item.json.creds.acess }}`\n• Bomberos: `{{ $('Parsear_Expediente_ACESS').item.json.creds.engris }}`",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "id": "node_telegram",
      "name": "Alerta_Telegram_Con_IA",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.1,
      "position": [1160, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\n  \"success\": true,\n  \"message\": \"Expediente recibido y analizado por IA nativa en n8n\",\n  \"folderName\": \"{{ $('Parsear_Expediente_ACESS').item.json.folderName }}\",\n  \"folderUrl\": \"{{ $('Crear_Carpeta_Google_Drive').item.json.webViewLink }}\",\n  \"dictamenIA\": {{ JSON.stringify($('Auditor_IA_Nativa_ACESS').item.json.text) }},\n  \"timestamp\": \"{{ $now.toISO() }}\"\n}",
        "options": {
          "responseHeaders": {
            "entries": [
              {
                "name": "Access-Control-Allow-Origin",
                "value": "*"
              },
              {
                "name": "Access-Control-Allow-Methods",
                "value": "POST, OPTIONS"
              }
            ]
          }
        }
      },
      "id": "node_respond",
      "name": "Responder_A_Hostinger",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [1400, 300]
    }
  ],
  "connections": {
    "Webhook_Hostinger_Expedientes": {
      "main": [
        [
          {
            "node": "Parsear_Expediente_ACESS",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Parsear_Expediente_ACESS": {
      "main": [
        [
          {
            "node": "Auditor_IA_Nativa_ACESS",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gemini_IA_Nativa_Model": {
      "ai_languageModel": [
        [
          {
            "node": "Auditor_IA_Nativa_ACESS",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Auditor_IA_Nativa_ACESS": {
      "main": [
        [
          {
            "node": "Crear_Carpeta_Google_Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crear_Carpeta_Google_Drive": {
      "main": [
        [
          {
            "node": "Alerta_Telegram_Con_IA",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Alerta_Telegram_Con_IA": {
      "main": [
        [
          {
            "node": "Responder_A_Hostinger",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
};

export const GOOGLE_APPS_SCRIPT_CODE = `function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Registro de Información - Establecimiento de Salud')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function procesarFormulario(formObject) {
  try {
    var folderName = "Documentos Registros Establecimientos";
    var folders = DriveApp.getFoldersByName(folderName);
    var targetFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    var clientFolderName = (formObject.nombreComercial || "Cliente_Sin_Nombre") + " - " + new Date().toISOString().substring(0, 10);
    var clientFolder = targetFolder.createFolder(clientFolderName);

    function guardarArchivo(archivo, nombreBase) {
      if (archivo && archivo.size > 0) {
        var blob = Utilities.newBlob(Utilities.base64Decode(archivo.data), archivo.mimeType, nombreBase + "_" + archivo.fileName);
        var file = clientFolder.createFile(blob);
        return file.getUrl();
      }
      return "No adjunto";
    }

    var urlRuc = guardarArchivo(formObject.archivoRuc, "RUC");
    var urlLuz = guardarArchivo(formObject.archivoLuz, "Planilla_Luz");
    var urlCedula = guardarArchivo(formObject.archivoCedula, "Cedula_Resp_Legal");
    var urlPapeleta = guardarArchivo(formObject.archivoPapeleta, "Papeleta_Votacion");

    var spreadsheetName = "Base de Datos - Registros Establecimientos";
    var files = DriveApp.getFilesByName(spreadsheetName);
    var sheet;
    if (files.hasNext()) {
      sheet = SpreadsheetApp.open(files.next()).getActiveSheet();
    } else {
      var ss = SpreadsheetApp.create(spreadsheetName);
      sheet = ss.getActiveSheet();
      sheet.appendRow([
        "Fecha Registro", "Nombre Comercial", "Tipología", "Predio", "Correo", "Área (m2)",
        "Resp. Legal (Nombre)", "Resp. Legal (Cédula)",
        "Resp. Técnico (Nombre)", "Resp. Técnico (Cédula)",
        "Resp. Desechos (Nombre)", "Resp. Desechos (Cédula)",
        "Servicios Ofrecidos", "Equipos Biomédicos", "Nómina de Personal",
        "Áreas y Mobiliario", "Link Carpeta Drive",
        "Doc RUC", "Doc Planilla Luz", "Doc Cédula Resp. Legal", "Doc Papeleta Votación"
      ]);
    }

    var servicios = [
      formObject.servicio1, formObject.servicio2, formObject.servicio3,
      formObject.servicio4, formObject.servicio5
    ].filter(Boolean).join(";\\n");

    var equipos = "";
    if (formObject.equipos) {
      equipos = JSON.parse(formObject.equipos).map(function(e) {
        return e.nombre + " (Marca/Modelo: " + e.marcaModelo + ")";
      }).join(";\\n");
    }

    var personal = "";
    if (formObject.personal) {
      personal = JSON.parse(formObject.personal).map(function(p) {
        return p.nombre + " - C.I.: " + p.cedula + (p.cargo ? " (" + p.cargo + ")" : "");
      }).join(";\\n");
    }

    var areas = "";
    if (formObject.areas) {
      areas = JSON.parse(formObject.areas).map(function(a) {
        return "Área: " + a.area + " | Muebles: " + a.muebles;
      }).join(";\\n");
    }

    sheet.appendRow([
      new Date(),
      formObject.nombreComercial,
      formObject.tipologia,
      formObject.predio,
      formObject.correo,
      formObject.area,
      formObject.legalNombre,
      formObject.legalCedula,
      formObject.tecnicoNombre,
      formObject.tecnicoCedula,
      formObject.desechosNombre,
      formObject.desechosCedula,
      servicios,
      equipos,
      personal,
      areas,
      clientFolder.getUrl(),
      urlRuc,
      urlLuz,
      urlCedula,
      urlPapeleta
    ]);

    return { success: true, message: "¡Información registrada y archivada exitosamente!" };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}`;
