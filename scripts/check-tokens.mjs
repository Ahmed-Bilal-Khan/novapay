// npm run check: fails if any file under src/ contains a hex colour, an arbitrary
// Tailwind value or a Tailwind default colour, unless it's listed in scripts/check-allowlist.json.
// Colours, type, radius and shadow must come from tailwind.config.js (see CLAUDE.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindConfig from '../tailwind.config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'src');
const allowPath = path.join(root, 'scripts', 'check-allowlist.json');
const TEXT_FILES = /\.(jsx?|tsx?|mjs|cjs|css|html|svg)$/;

// Arbitrary values (w-[390px], bg-brand/[0.3], hover:border-[#E6E6E6]),
// arbitrary properties ([mask-type:luminance]) and arbitrary variants ([&>*]:p-2).
const ARBITRARY = [
  /(?<![\w$.])[!-]?[a-z][\w:-]*?(?:-|\/)\[[^\]\s'"`]+\]/gi,
  /(?<=^|[\s"'`{])\[[a-z-]+:[^\]\s'"`]+\]/gim,
  /(?<=^|[\s"'`{])\[[^\]\s'"`]+\]:/gm,
];
// #RGB, #RGBA, #RRGGBB, #RRGGBBAA. The lookbehind skips HTML entities like &#123;.
const HEX = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;

// Tailwind's default colour names. They stay available because our colours sit under
// `extend`, so a class like text-red-500 or text-neutral-400 would build without a token.
// white, black and transparent are allowed: they're absolutes, not palette choices
// (see DESIGN_SYSTEM.md). A family we define, like neutral, passes only for our own shades.
const ALLOWED_DEFAULTS = ['white', 'black', 'transparent'];
const DEFAULT_FAMILIES =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|' +
  'indigo|violet|purple|fuchsia|pink|rose|inherit|current|transparent|black|white';
const COLOUR_UTILITY =
  'bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|divide|placeholder|caret|accent|fill|stroke|shadow|decoration|from|via|to';
const DEFAULT_COLOUR_CLASS = new RegExp(
  `(?<![\\w-])(?:${COLOUR_UTILITY})-(${DEFAULT_FAMILIES})(?:-(\\d{2,3}))?(?:\\/[\\w.]+)?(?![\\w-])`,
  'g'
);
const DEFAULT_COLOUR_THEME = new RegExp(
  `theme\\(\\s*['"]colors\\.(${DEFAULT_FAMILIES})(?:\\.(\\d{2,3}))?['"]`,
  'g'
);
const tokens = tailwindConfig.theme.extend.colors;

function isTokenColour(family, shade) {
  if (ALLOWED_DEFAULTS.includes(family)) return true;
  const ours = tokens[family];
  if (ours === undefined) return false;
  if (!shade) return typeof ours === 'string' || 'DEFAULT' in ours;
  return typeof ours === 'object' && shade in ours;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : TEXT_FILES.test(d.name) ? [p] : [];
  });
}

function findings(file) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const out = [];
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    const spans = [];
    for (const re of ARBITRARY) {
      for (const m of line.matchAll(re)) {
        spans.push([m.index, m.index + m[0].length]);
        out.push({ file: rel, line: i + 1, kind: 'arbitrary value', match: m[0] });
      }
    }
    for (const m of line.matchAll(HEX)) {
      // A hex inside an arbitrary value (border-[#E6E6E6]) is reported once, as the arbitrary value.
      if (spans.some(([a, b]) => m.index >= a && m.index < b)) continue;
      out.push({ file: rel, line: i + 1, kind: 'hex colour', match: m[0] });
    }
    for (const re of [DEFAULT_COLOUR_CLASS, DEFAULT_COLOUR_THEME]) {
      for (const m of line.matchAll(re)) {
        if (isTokenColour(m[1], m[2])) continue;
        out.push({ file: rel, line: i + 1, kind: 'Tailwind default colour', match: m[0] });
      }
    }
  });
  return out;
}

const allow = JSON.parse(fs.readFileSync(allowPath, 'utf8')).allow;
const all = walk(srcDir).flatMap(findings);
const isAllowed = (f) => allow.some((a) => a.file === f.file && a.match === f.match);
const problems = all.filter((f) => !isAllowed(f));
const stale = allow.filter((a) => !all.some((f) => f.file === a.file && f.match === a.match));

for (const a of stale) {
  console.warn(`warning: allow-list entry no longer matches anything: ${a.file} ${a.match}`);
}
if (problems.length) {
  console.error(`check failed: ${problems.length} hex colour(s), arbitrary value(s) or Tailwind default colour(s) in src/\n`);
  for (const p of problems) console.error(`  ${p.file}:${p.line}  ${p.kind}  ${p.match}`);
  console.error('\nUse a token from tailwind.config.js. If this one is truly an exception, it goes in scripts/check-allowlist.json (ask first).');
  process.exit(1);
}
console.log(`check passed: no hex colours, arbitrary values or Tailwind default colours in src/ (${all.length} allowed by scripts/check-allowlist.json)`);
