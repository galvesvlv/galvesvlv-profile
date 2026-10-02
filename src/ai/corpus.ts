import profile from '../data/profile.json';
import education from '../data/education.json';
import experience from '../data/experience.json';
import research from '../data/research.json';
import publications from '../data/publications.json';
import knowledge from '../data/knowledge.generated.json';
export interface Chunk { id: string; title: string; text: string; href: string }
export const corpus: Chunk[] = [
 ...knowledge,
 { id: 'profile', title: 'About Vitor', text: `${profile.fullName}. ${profile.headline}. ${profile.biography}`, href: '#about' },
  ...education.map(x => ({ id: `education-${x.id}`, title: x.title, text: `${x.institution}. ${x.period}. ${x.description} ${x.thesis ?? ''} ${x.project ?? ''} ${x.tags.join(', ')}`, href: `#education-${x.id}` })),
  ...experience.map(x => ({ id: `experience-${x.id}`, title: `${x.institution}: ${x.title}`, text: `${x.period}. ${x.description} ${x.impact} ${x.tools?.join(', ') ?? ''} ${x.tags.join(', ')}`, href: `#experience-${x.id}` })),
  ...research.map(x => ({ id: `research-${x.id}`, title: x.title, text: `${x.description} ${x.tags.join(', ')}`, href: '#about' })),
  ...publications.map(x => ({ id: `publication-${x.id}`, title: x.title, text: `${x.authors}. ${x.venue}. ${x.year}. ${x.doi ? `DOI: ${x.doi}. ` : ''}${x.url ? `URL: ${x.url}. ` : ''}Metadata only; full paper text is not included.`, href: `#publication-${x.id}` }))
];
