import { el, link } from '../utils';
import type { Chunk } from '../ai/corpus';
interface Message { role: 'user'|'assistant'; text: string; sources?: Chunk[] }
const messages: Message[] = [];
const views: Array<() => void> = [];
let busy = false;
let abort: AbortController | undefined;
const questions = ['What does Vitor research?', 'How does he use artificial intelligence?', 'Which climate models has he worked with?', 'Show me his research on climate extremes.'];

export function chatView() {
  const box = el('div', 'chat');
  const head = el('div', 'chat-head');
  head.append(el('strong', '', '✳ ZOEY AI'));
  const log = el('div', 'chat-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
  const form = el('form', 'chat-form');
  const input = el('input'); input.placeholder = 'Ask about research, publications or experience…'; input.required = true; input.maxLength = 1500; input.setAttribute('aria-label', 'Your question to Zoey AI');
  const send = el('button', '', 'Send ↗'); send.type = 'submit';
  const stop = el('button', '', 'Stop'); stop.type = 'button'; stop.hidden = true; stop.onclick = () => abort?.abort(); form.append(input, send, stop);
  const suggestions = el('div', 'suggestions');
  questions.forEach(question => { const button = el('button', '', question); button.type = 'button'; button.onclick = () => { input.value = question; form.requestSubmit(); }; suggestions.append(button); });
  const clear = el('button', 'text-button', 'Clear conversation'); clear.type = 'button'; clear.onclick = () => { if (!busy) { messages.length = 0; views.forEach(render => render()); } };
  function render() {
    log.replaceChildren();
    for (const message of messages) { const item = el('div', `message ${message.role}`); item.append(el('small', '', message.role === 'user' ? 'YOU' : 'ZOEY AI'), el('p', '', message.text)); if (message.sources) { const refs = el('div', 'references'); message.sources.forEach(source => {const a=link(source.title,source.href);a.onclick=()=>{(document.querySelector('#chat-dialog') as HTMLDialogElement).close();};refs.append(a);}); item.append(refs); } log.append(item); }
    if (busy) log.append(el('p', 'muted', 'Looking through the portfolio…'));
    send.disabled = busy; stop.hidden = !busy; clear.disabled = busy; log.scrollTop = log.scrollHeight;
  }
  form.onsubmit = async event => {
    event.preventDefault(); const question = input.value.trim(); if (!question || busy) return; input.value = ''; messages.push({ role: 'user', text: question }); busy = true; abort = new AbortController(); views.forEach(update=>update());
    try {
      const { retrieve } = await import('../ai/retrieval'); const sources = retrieve(question);
      if (!sources.length) messages.push({ role: 'assistant', text: 'I could not find that information in the website knowledge base. Try a specific research topic, institution or publication.' });
      else if (!import.meta.env.VITE_ZOEY_API_URL) messages.push({ role: 'assistant', text: 'Local search — relevant excerpts from the portfolio (no generated AI answer):\n\n' + sources.slice(0, 3).map(source => `${source.title}\n${source.text}`).join('\n\n'), sources });
      else { const timer = setTimeout(() => abort?.abort(), 30000); try { const response = await fetch(import.meta.env.VITE_ZOEY_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, sourceIds: sources.map(source => source.id) }), signal: abort.signal }); const data = await response.json() as { answer?: string; error?: string }; if (!response.ok || !data.answer) throw new Error(data.error || 'The assistant is unavailable.'); messages.push({ role: 'assistant', text: data.answer, sources }); } finally { clearTimeout(timer); } }
    } catch (error) { messages.push({ role: 'assistant', text: error instanceof Error && error.name === 'AbortError' ? 'Request stopped or timed out. You can try again.' : error instanceof Error ? error.message : 'Unable to connect. Please try again.' }); }
    finally { busy = false; views.forEach(update=>update()); }
  };
  views.push(render); render();
  box.append(head, log, form, suggestions, clear);
  return box;
}
