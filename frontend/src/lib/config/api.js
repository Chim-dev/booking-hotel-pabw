import { env } from '$env/dynamic/public';

const configuredBaseUrl = (env.PUBLIC_BACKEND_URL || '').trim();

export const API_BASE_URL = configuredBaseUrl ? configuredBaseUrl.replace(/\/$/, '') : '';
