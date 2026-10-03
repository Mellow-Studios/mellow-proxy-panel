import { describe, expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import '@/i18n';
import { QuotaTimeline } from '@/features/quota/components/QuotaTimeline';
import type { AuthFileItem, DevinQuotaState } from '@/types';
import { getQuotaDisplayName, maskEmails } from '@/utils/quota/identity';

const devinFile: AuthFileItem = {
  name: 'shared.json',
  provider: 'devin',
  authIndex: '42',
  email: 'demo@example.test',
};

describe('credential label email masking', () => {
  test('keeps the first local-part character and the domain of every email in a label', () => {
    expect(maskEmails('claude-1a2b3c4d-kenneth@gmail.com.json')).toBe(
      'claude-1a2b3c4d-k***@gmail.com.json'
    );
    expect(maskEmails('codex-kenneth+work@mellow.gg-plus.json')).toBe(
      'codex-k***@mellow.gg-plus.json'
    );
    expect(maskEmails(getQuotaDisplayName(devinFile))).toBe('shared.json · d***@example.test');
  });

  test('leaves a label without an email unchanged', () => {
    expect(maskEmails('xai-1759400000000.json')).toBe('xai-1759400000000.json');
    expect(maskEmails('shared.json · 42')).toBe('shared.json · 42');
  });

  test('routes Devin timeline lane labels through the injected label transform', () => {
    const now = new Date(2026, 6, 29, 12).getTime();
    const quota: DevinQuotaState = {
      status: 'success',
      windows: [
        { id: 'weekly', remainingPercent: 60, resetAtMs: now + 2 * 86_400_000, periodHours: 168 },
      ],
      observedAtMs: null,
      plan: null,
      planStartMs: null,
      planEndMs: null,
    };
    const markup = renderToStaticMarkup(
      createElement(QuotaTimeline, {
        entries: [{ file: devinFile, type: 'devin' }],
        quotaFor: () => quota,
        displayNameFor: maskEmails,
        resolvedTheme: 'light',
        now,
      })
    );

    expect(markup).toContain('shared.json · d***@example.test');
    expect(markup).not.toContain('demo@example.test');
  });
});
