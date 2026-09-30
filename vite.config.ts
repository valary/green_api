import { copyFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// styled-components вставляет стили в <style> на лету, поэтому style-src без 'unsafe-inline' не обойтись.
// Скрипты — только свои. worker-src нужен service worker'у MSW в демо.
const contentSecurityPolicy = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    'connect-src https:',
    "worker-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
].join('; ');

// В dev CSP мешает HMR, поэтому мета добавляется только в сборку.
// 404.html — копия index.html: GitHub Pages отдаёт её на прямые ссылки вроде /green_api/chat/123.
function githubPages(): Plugin {
    return {
        name: 'github-pages',
        apply: 'build',
        transformIndexHtml: () => [
            {
                tag: 'meta',
                attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
                injectTo: 'head',
            },
        ],
        closeBundle() {
            copyFileSync('dist/index.html', 'dist/404.html');
        },
    };
}

export default defineConfig({
    base: process.env.VITE_BASE ?? '/',
    plugins: [react(), githubPages()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'test-utils': fileURLToPath(new URL('./test-utils', import.meta.url)),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./test-utils/setupTests.ts'],
        include: ['src/**/*.spec.{ts,tsx}'],
        restoreMocks: true,
    },
});
