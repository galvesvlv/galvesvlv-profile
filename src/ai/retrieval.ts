import MiniSearch from 'minisearch';
import { corpus, type Chunk } from './corpus';
const index = new MiniSearch<Chunk>({ fields: ['title', 'text'], storeFields: ['title', 'text', 'href'], searchOptions: { boost: { title: 2 }, prefix: true, fuzzy: 0.15 } });
index.addAll(corpus);
export function retrieve(question: string): Chunk[] {
 const normalized = question.toLowerCase().replace(/inteligência artificial|\bai\b/g, 'artificial intelligence').replace(/pesquisa/g, 'research').replace(/modelos/g, 'models').replace(/climáticos/g, 'climate').replace(/extremos/g, 'extremes');
 const words = normalized.replace(/\b(what|does|how|he|his|vitor|which|has|with|show|me|about|the|is|and|of|in|use|worked)\b/g, ' ').trim();
 if (!words) return [corpus.find(x=>x.id==='profile')!];
 return index.search(words).filter(x => x.score >= 1).slice(0, 5).map(x => ({ id: String(x.id), title: x.title as string, text: x.text as string, href: x.href as string }));
}
