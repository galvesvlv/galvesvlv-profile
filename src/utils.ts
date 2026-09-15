export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') => { const node = document.createElement(tag); node.className = className; node.textContent = text; return node; };
export function link(text: string, href: string) { const a = el('a', '', text); a.href = href; if (href.startsWith('https://')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
export function tags(values: string[]) { const box = el('div', 'tags'); values.forEach(value => box.append(el('span', '', value))); return box; }
export function section(id: string, kicker: string, title: string) { const node = el('section', 'section'); node.id = id; if (kicker) node.append(el('p', 'eyebrow', kicker)); if (title) node.append(el('h2', '', title)); return node; }
