import './styles/main.css';
import profile from './data/profile.json';
import education from './data/education.json';
import experience from './data/experience.json';
import media from './data/media.json';
import {el,link,section} from './utils';
import {chatView} from './components/zoey-chat';
import {storySection} from './components/story-map';
import {publicationSection} from './components/publications';
import {mediaFigure} from './components/media';

const nav=document.querySelector('#navigation')!;
nav.append(link('GALVESVLV','#home'));
const links=el('nav');links.setAttribute('aria-label','Main navigation');
for(const id of ['about','education','experience','publications','zoey'])links.append(link(id==='zoey'?'Zoey AI':id[0].toUpperCase()+id.slice(1),`#${id}`));nav.append(links);
const main=document.querySelector('main')!;
const hero=el('section','hero');hero.id='home';
if(media.cover.src){const image=el('img','cover-image');image.alt=media.cover.alt;image.src=`${import.meta.env.BASE_URL}${media.cover.src.replace(/^\//,'')}`;image.onerror=()=>image.remove();hero.append(image);}
const cover=el('div','cover-layout');const intro=el('div','cover-intro');
intro.append(el('p','eyebrow','CLIMATE · SCIENCE · INTELLIGENCE'),el('h1','',profile.name),el('p','headline',profile.headline),el('p','hero-statement',profile.description),link('Read my story ↓','#about'));
cover.append(intro,mediaFigure(media.portrait,'portrait',true));hero.append(cover,chatView());main.append(hero);

const about=section('about','','About me');
const aboutGrid=el('div','about-grid');const bio=el('div','biography');bio.append(el('p','lead',profile.biography));
const wheel=el('div','education-wheel');aboutGrid.append(bio,wheel);about.append(aboutGrid);main.append(about);
import('./components/sunburst').then(x=>x.mountSunburst(wheel)).catch(()=>{const list=el('ul');education.forEach(course=>{const item=el('li');item.append(link(course.title,`#education-${course.id}`));list.append(item);});wheel.append(list);});
main.append(storySection('education','01 / EDUCATION','A learning journey.',education),storySection('experience','02 / EXPERIENCE','Science into practice.',experience),publicationSection());
const zoey=section('zoey','','Zoey AI');zoey.append(el('p','lead','Explore my research, publications, projects and professional experience.'),chatView(),mediaFigure(media.zoey,'zoey-portrait'));main.append(zoey);
const footer=document.querySelector('footer')!;footer.append(el('p','eyebrow','LET’S CONNECT'),el('h2','','Science is a conversation.'));const contact=el('div','contact-links');profile.links.forEach(x=>contact.append(link(`${x.label} ↗`,x.url)));footer.append(contact,el('p','muted',`© ${new Date().getFullYear()} ${profile.name}`));
const dialog=document.querySelector('#chat-dialog') as HTMLDialogElement;document.querySelector('#dialog-chat')!.append(chatView());document.querySelector('#chat-toggle')!.addEventListener('click',()=>dialog.showModal());document.querySelector('.dialog-close')!.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){links.querySelectorAll('a').forEach(a=>{if(a.hash===`#${entry.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-10% 0px -70% 0px'});main.querySelectorAll('section').forEach(x=>observer.observe(x));
