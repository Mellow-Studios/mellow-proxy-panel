import type { AuthFileItem } from '@/types';
import { normalizeRecentRequestAuthIndex } from '@/utils/recentRequests';
import { isDevinFile } from './validators';

const QUOTA_IDENTITY_SEPARATOR = '\0';

/**
 * Cache identity is filename-based for every existing provider. Devin alone can
 * expose multiple credential identities from one physical file, distinguished
 * by auth_index.
 */
export function getQuotaCacheKey(file: AuthFileItem): string {
  if (!isDevinFile(file)) return file.name;
  const authIndex = normalizeRecentRequestAuthIndex(file.authIndex);
  return `${file.name}${QUOTA_IDENTITY_SEPARATOR}${authIndex ?? ''}`;
}

/** Disambiguate same-name Devin cards without ever falling back to account (a secret). */
export function getQuotaDisplayName(file: AuthFileItem): string {
  if (!isDevinFile(file)) return file.name;
  const identity = file.email?.trim() || normalizeRecentRequestAuthIndex(file.authIndex);
  return identity ? `${file.name} · ${identity}` : file.name;
}

/**
 * The local part stops at `-`: the backend joins filename segments with it, as in
 * `claude-<sha8>-<email>.json`, so a wider match would swallow the prefix.
 */
const EMAIL_LOCAL_PART = /[A-Za-z0-9._%+]+(?=@[A-Za-z0-9-]+\.[A-Za-z0-9])/g;

/** Mask every email in a credential label to its first character, keeping the domain. */
export function maskEmails(label: string): string {
  return label.replace(EMAIL_LOCAL_PART, (localPart) => `${localPart.charAt(0)}***`);
}

/** Resolve a cache identity back to the physical filename used by file mutations. */
export function getQuotaCacheFileName(key: string): string {
  const separatorIndex = key.indexOf(QUOTA_IDENTITY_SEPARATOR);
  return separatorIndex === -1 ? key : key.slice(0, separatorIndex);
}
