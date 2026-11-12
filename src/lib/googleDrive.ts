import { getAccessToken } from './googleAuth';

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  parents?: string[];
  isFolder: boolean;
}

export interface DriveStorageInfo {
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
  user?: {
    displayName?: string;
    emailAddress?: string;
    photoLink?: string;
  };
}

export interface CreatedExpedienteFolders {
  rootFolderId: string;
  rootFolderName: string;
  rootFolderLink: string;
  subfolders: Record<string, { id: string; name: string; link: string }>;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No hay sesión activa de Google Drive. Inicia sesión con Google.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errJson = await response.json();
      errorDetails = errJson.error?.message || JSON.stringify(errJson);
    } catch {
      errorDetails = await response.text();
    }
    throw new Error(`Google Drive API error (${response.status}): ${errorDetails}`);
  }

  return response;
}

/**
 * Get account and Drive quota info
 */
export async function getDriveAbout(): Promise<DriveStorageInfo> {
  const res = await fetchWithAuth(`${DRIVE_API_URL}/about?fields=user,storageQuota`);
  return res.json();
}

/**
 * List files and folders inside a specific parent folder (or root if omitted)
 */
export async function listDriveFiles(folderId?: string, query?: string): Promise<DriveItem[]> {
  let q = "trashed = false";
  if (folderId) {
    q += ` and '${folderId}' in parents`;
  }
  if (query && query.trim()) {
    const sanitized = query.replace(/'/g, "\\'");
    q += ` and (name contains '${sanitized}')`;
  }

  const fields = 'files(id, name, mimeType, iconLink, webViewLink, thumbnailLink, size, modifiedTime, createdTime, parents)';
  const params = new URLSearchParams({
    q,
    pageSize: '50',
    fields,
    orderBy: 'folder,modifiedTime desc',
  });

  const res = await fetchWithAuth(`${DRIVE_API_URL}/files?${params.toString()}`);
  const data = await res.json();

  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    iconLink: f.iconLink,
    webViewLink: f.webViewLink,
    thumbnailLink: f.thumbnailLink,
    size: f.size ? formatBytes(parseInt(f.size, 10)) : undefined,
    modifiedTime: f.modifiedTime,
    createdTime: f.createdTime,
    parents: f.parents,
    isFolder: f.mimeType === 'application/vnd.google-apps.folder',
  }));
}

/**
 * Create a new folder in Google Drive
 */
export async function createDriveFolder(name: string, parentId?: string): Promise<{ id: string; name: string; webViewLink: string }> {
  const metadata: any = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentId) {
    metadata.parents = [parentId];
  }

  const res = await fetchWithAuth(`${DRIVE_API_URL}/files?fields=id,name,webViewLink`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  return res.json();
}

/**
 * Creates the complete institutional ACESS folder hierarchy in Google Drive:
 * Root: [UNICODIGO]_[RAZON_SOCIAL]_EXPEDIENTE_ACESS
 * Subfolders:
 *   - 01_DOCUMENTOS_LEGALES
 *   - 02_PLANOS_Y_FOTOGRAFIAS
 *   - 03_RESOLUCIONES_ACESS
 *   - 04_SACCS_EXPEDIENTES
 */
export async function createInstitutionalDossier(
  unicodigo: string,
  razonSocial: string
): Promise<CreatedExpedienteFolders> {
  const cleanName = razonSocial.replace(/[\\/:*?"<>|]/g, '').trim();
  const rootFolderName = `${unicodigo}_${cleanName}_EXPEDIENTE_ACESS`;

  // 1. Create root dossier folder
  const root = await createDriveFolder(rootFolderName);

  // 2. Create subfolders
  const subfolderNames = [
    '01_DOCUMENTOS_LEGALES',
    '02_PLANOS_Y_FOTOGRAFIAS',
    '03_RESOLUCIONES_ACESS',
    '04_SACCS_EXPEDIENTES',
  ];

  const subfoldersMap: Record<string, { id: string; name: string; link: string }> = {};

  for (const subName of subfolderNames) {
    const sub = await createDriveFolder(subName, root.id);
    subfoldersMap[subName] = {
      id: sub.id,
      name: sub.name,
      link: sub.webViewLink || `https://drive.google.com/drive/folders/${sub.id}`,
    };
  }

  return {
    rootFolderId: root.id,
    rootFolderName,
    rootFolderLink: root.webViewLink || `https://drive.google.com/drive/folders/${root.id}`,
    subfolders: subfoldersMap,
  };
}

/**
 * Upload a text or json file directly into Google Drive
 */
export async function uploadTextFile(
  folderId: string,
  fileName: string,
  content: string,
  mimeType: string = 'text/plain'
): Promise<DriveItem> {
  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const res = await fetchWithAuth(
    `${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,createdTime`,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    webViewLink: data.webViewLink,
    size: data.size ? formatBytes(parseInt(data.size, 10)) : '1 KB',
    createdTime: data.createdTime,
    isFolder: false,
  };
}

/**
 * Upload a binary File or Blob to Google Drive
 */
export async function uploadFileToDrive(
  folderId: string,
  file: File | Blob,
  fileName: string,
  mimeType: string
): Promise<DriveItem> {
  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const arrayBuffer = await file.arrayBuffer();
  const metadataBytes = new TextEncoder().encode(
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n`
  );
  const closingBytes = new TextEncoder().encode(closeDelimiter);

  const combined = new Uint8Array(metadataBytes.length + arrayBuffer.byteLength + closingBytes.length);
  combined.set(metadataBytes, 0);
  combined.set(new Uint8Array(arrayBuffer), metadataBytes.length);
  combined.set(closingBytes, metadataBytes.length + arrayBuffer.byteLength);

  const res = await fetchWithAuth(
    `${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,createdTime`,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: combined,
    }
  );

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    webViewLink: data.webViewLink,
    size: data.size ? formatBytes(parseInt(data.size, 10)) : undefined,
    createdTime: data.createdTime,
    isFolder: false,
  };
}

/**
 * Delete a file or folder in Google Drive (Destructive: requires explicit confirmation dialog before calling)
 */
export async function deleteDriveItem(fileId: string): Promise<void> {
  await fetchWithAuth(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
  });
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
