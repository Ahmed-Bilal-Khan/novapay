// Stop hook: appends the most recent human prompt in this session's transcript
// to docs/ai-log/prompts.md, numbered and grouped by session (no timestamps).
// Stop does not fire when a turn is interrupted, so cancelled prompts are never logged.
import fs from 'node:fs';
import path from 'node:path';

const AUTOMATED = /^<(task-notification|side-sessions-event|ci-monitor-event|local-command-stdout|local-command-caveat|system-reminder)>/;
const INTERRUPT = /^\[Request interrupted by user[^\]]*\]\s*/;

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd;
const logFile = path.join(projectDir, 'docs', 'ai-log', 'prompts.md');

function promptText(entry) {
  if (entry.type !== 'user' || entry.isMeta || entry.isSidechain) return null;
  if (entry.origin && entry.origin.kind !== 'human') return null;
  const content = entry.message?.content;
  let text;
  if (typeof content === 'string') text = content;
  else if (Array.isArray(content) && !content.some((b) => b.type === 'tool_result')) {
    text = content.map((b) => (b.type === 'text' ? b.text : b.type === 'image' ? '[image]' : '')).join('\n\n');
  } else return null;
  text = text
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
    .replace(/<\/?pasted_content\b[^>]*>\n?/g, '')
    .replace(INTERRUPT, '')
    .trim();
  if (!text || AUTOMATED.test(text)) return null;
  const cmd = text.match(/<command-name>([\s\S]*?)<\/command-name>/);
  if (cmd) {
    const args = text.match(/<command-args>([\s\S]*?)<\/command-args>/);
    text = `${cmd[1].trim()} ${args ? args[1].trim() : ''}`.trim();
  }
  return text;
}

const lines = fs.readFileSync(input.transcript_path, 'utf8').split('\n');
let latest = null;
for (let i = lines.length - 1; i >= 0 && !latest; i--) {
  if (!lines[i].trim()) continue;
  let entry;
  try { entry = JSON.parse(lines[i]); } catch { continue; }
  const text = promptText(entry);
  if (text) latest = { id: entry.uuid, text };
}
if (!latest) process.exit(0);

let doc = fs.existsSync(logFile)
  ? fs.readFileSync(logFile, 'utf8')
  : '# AI prompt log\n\nEvery prompt sent to Claude Code in this project, grouped by session. Interrupted prompts are not logged.\n';

// The same prompt can be the latest one at several Stops (e.g. a turn woken by a background task).
const idMarker = `<!-- prompt:${latest.id} -->`;
if (doc.includes(idMarker)) process.exit(0);

const sessionMarker = `<!-- session:${input.session_id} -->`;
const quoted = latest.text.split('\n').map((l) => (l ? `> ${l}` : '>')).join('\n');

if (!doc.includes(sessionMarker)) {
  const sessionCount = (doc.match(/^## Session \d+$/gm) || []).length;
  doc = `${doc.trimEnd()}\n\n## Session ${sessionCount + 1}\n\n${sessionMarker}\n`;
}

// Insert at the end of this session's section, so interleaved sessions stay grouped.
const start = doc.indexOf(sessionMarker);
const nextSession = doc.slice(start).search(/^## Session \d+$/m);
const end = nextSession === -1 ? doc.length : start + nextSession;
const section = doc.slice(start, end);
const n = (section.match(/^### Prompt \d+$/gm) || []).length + 1;
const entry = `\n### Prompt ${n}\n\n${idMarker}\n\n${quoted}\n`;

doc = `${doc.slice(0, start)}${section.trimEnd()}\n${entry}${end < doc.length ? '\n' + doc.slice(end) : ''}`;
fs.mkdirSync(path.dirname(logFile), { recursive: true });
fs.writeFileSync(logFile, doc.trimEnd() + '\n');
