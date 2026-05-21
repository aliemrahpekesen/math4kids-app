import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('public/_headers (Cloudflare Pages CSP + cache policy)', () => {
  let contents = '';

  beforeAll(() => {
    contents = readFileSync(resolve(__dirname, '../../public/_headers'), 'utf8');
  });

  it('defines the CSP for the root scope', () => {
    expect(contents).toMatch(/^\/\*$/m);
    expect(contents).toMatch(/Content-Security-Policy:.*default-src 'self'/);
  });

  it('locks connect-src to self (no third-party SDK exfiltration)', () => {
    expect(contents).toMatch(/connect-src 'self'/);
  });

  it('locks frame-ancestors to none (no embed)', () => {
    expect(contents).toMatch(/frame-ancestors 'none'/);
  });

  it('includes worker-src and manifest-src directives', () => {
    expect(contents).toMatch(/worker-src 'self'/);
    expect(contents).toMatch(/manifest-src 'self'/);
  });

  it('fences hardware via Permissions-Policy (camera, mic, geo, payment, sensors)', () => {
    expect(contents).toMatch(/Permissions-Policy:.*camera=\(\)/);
    expect(contents).toMatch(/microphone=\(\)/);
    expect(contents).toMatch(/geolocation=\(\)/);
    expect(contents).toMatch(/payment=\(\)/);
  });

  it('includes X-Frame-Options DENY + X-Content-Type-Options nosniff + Referrer-Policy', () => {
    expect(contents).toMatch(/X-Frame-Options: DENY/);
    expect(contents).toMatch(/X-Content-Type-Options: nosniff/);
    expect(contents).toMatch(/Referrer-Policy: same-origin/);
  });

  it('includes COOP same-origin (no SAB, so no COEP needed)', () => {
    expect(contents).toMatch(/Cross-Origin-Opener-Policy: same-origin/);
  });

  it('declares no-cache for shell paths (/, /index.html, /sw.js, /manifest.webmanifest)', () => {
    expect(contents).toMatch(/^\/$\n {2}Cache-Control: no-cache$/m);
    expect(contents).toMatch(/^\/index\.html$\n {2}Cache-Control: no-cache$/m);
    expect(contents).toMatch(/^\/sw\.js$\n {2}Cache-Control: no-cache$/m);
    expect(contents).toMatch(/^\/manifest\.webmanifest$\n {2}Cache-Control: no-cache$/m);
  });

  it('marks hashed assets as immutable + max-age=31536000', () => {
    expect(contents).toMatch(
      /^\/assets\/\*$\n {2}Cache-Control: public, max-age=31536000, immutable$/m
    );
  });
});
