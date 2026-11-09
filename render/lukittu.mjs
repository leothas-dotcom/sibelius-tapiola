// Ajaa render/render.mjs:n niin, että koneella on yksi renderi tai still-ajo kerrallaan (CLAUDE.md: näytönohjain on yhteinen).
// Käyttö: node render/lukittu.mjs <samat valinnat kuin render.mjs>
// Lukko on kansio build/render.lock. Jos se on varattu, odotetaan. Yli 20 minuuttia vanha lukko katsotaan jääneeksi ja poistetaan.
import { spawn } from 'node:child_process';
import { mkdirSync, rmdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const juuri = join(dirname(fileURLToPath(import.meta.url)), '..');
const lukko = join(juuri, 'build', 'render.lock');
const odota = (ms) => new Promise((r) => setTimeout(r, ms));

async function varaa() {
  for (let i = 0; ; i++) {
    try { mkdirSync(lukko); return; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (Date.now() - statSync(lukko).mtimeMs > 20 * 60 * 1000) { rmdirSync(lukko); continue; } } catch { continue; }
      if (i % 12 === 0) console.error('[lukittu] toinen renderi on käynnissä, odotan...');
      await odota(5000);
    }
  }
}
const vapauta = () => { try { if (existsSync(lukko)) rmdirSync(lukko); } catch { /* ei haittaa */ } };

await varaa();
process.on('SIGINT', () => { vapauta(); process.exit(130); });
const lapsi = spawn(process.execPath, [join(juuri, 'render', 'render.mjs'), ...process.argv.slice(2)], { stdio: 'inherit', cwd: juuri });
lapsi.on('exit', (koodi) => { vapauta(); process.exit(koodi ?? 1); });
