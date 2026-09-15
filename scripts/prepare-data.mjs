import {readFileSync,writeFileSync} from 'node:fs';
const markdown=readFileSync(new URL('../src/data/knowledge-base.md',import.meta.url),'utf8');
const chunks=markdown.split(/^## /m).filter(Boolean).map((part,i)=>{const [title,...body]=part.split('\n');return {id:`knowledge-${i}`,title:title.trim(),text:body.join('\n').trim(),href:title.includes('Zoey')?'#zoey':'#about'};});
writeFileSync(new URL('../src/data/knowledge.generated.json',import.meta.url),JSON.stringify(chunks,null,2)+'\n');
