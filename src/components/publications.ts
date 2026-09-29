import publications from '../data/publications.json';
import {el,link,section} from '../utils';
export function selectPublications(type:string,order:string,query='') {
  return publications.filter(p=>(type==='all'||p.type===type)&&`${p.title} ${p.authors} ${p.venue}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>order==='oldest'?a.year-b.year||a.title.localeCompare(b.title):b.year-a.year||a.title.localeCompare(b.title));
}
export function publicationSection(){
  const node=section('publications','03 / SCIENTIFIC PRODUCTION','Publications');const controls=el('div','publication-controls');const type=el('select');type.setAttribute('aria-label','Publication type');
  for(const [value,label]of [['all','All outputs'],['journal','Journal articles'],['proceedings','Conference proceedings'],['abstract','Abstracts / presentations'],['other','Datasets / reports']]){const option=el('option','',label);option.value=value;type.append(option);}
  const order=el('select');order.setAttribute('aria-label','Sort publications');for(const [value,label]of [['year','Newest first'],['oldest','Oldest first']]){const option=el('option','',label);option.value=value;order.append(option);}
  const search=el('input');search.type='search';search.placeholder='Search titles, authors, venues';search.setAttribute('aria-label','Search publications');controls.append(type,order,search);const list=el('div','publication-list');const count=el('p','muted');count.setAttribute('aria-live','polite');
  function render(){list.replaceChildren();const entries=selectPublications(type.value,order.value,search.value);count.textContent=`${entries.length} outputs`;for(const p of entries){const row=el('article','publication');row.id=`publication-${p.id}`;row.append(link(p.title,p.doi?`https://doi.org/${p.doi}`:p.url!),el('p','authors',p.authors));if(p.doi){const identifier=el('p','publication-identifier');identifier.append(link(`DOI: ${p.doi}`,`https://doi.org/${p.doi}`));row.append(identifier);}else if('identifier' in p&&typeof p.identifier==='string'&&p.url){const identifier=el('p','publication-identifier');identifier.append(link(p.identifier,p.url));row.append(identifier);}row.append(el('p','muted',`${p.venue} · ${p.year}`));list.append(row);}}
  [type,order,search].forEach(x=>x.addEventListener('input',render));render();node.append(controls,count,list);
  addEventListener('hashchange',()=>{if(location.hash.startsWith('#publication-')){type.value='all';search.value='';render();document.getElementById(location.hash.slice(1))?.scrollIntoView();}});return node;
}
