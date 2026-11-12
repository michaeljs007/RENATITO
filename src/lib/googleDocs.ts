import { getAccessToken } from './googleAuth';

const DOCS_API_URL = 'https://docs.googleapis.com/v1';

/**
 * Creates a new document in Google Docs.
 */
export async function createGoogleDoc(title: string): Promise<{ documentId: string, documentUrl: string }> {
    const token = await getAccessToken();
    if (!token) throw new Error('No hay sesión activa de Google.');

    const res = await fetch(`${DOCS_API_URL}/documents`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });

    if (!res.ok) throw new Error('Error al crear documento de Google.');
    const data = await res.json();
    return { 
        documentId: data.documentId,
        documentUrl: `https://docs.google.com/document/d/${data.documentId}/edit`
    };
}
